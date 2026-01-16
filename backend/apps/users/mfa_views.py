"""
Views for Multi-Factor Authentication (MFA) functionality.
"""
import pyotp
import secrets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .mfa_serializers import MFASetupSerializer, MFAVerifySerializer, MFABackupCodeSerializer


class MFASetupView(APIView):
    """View for setting up MFA."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Generate a new secret if not exists
        if not request.user.mfa_secret:
            request.user.mfa_secret = pyotp.random_base32()
            request.user.save(update_fields=['mfa_secret'])
        
        # Generate QR code and backup codes
        serializer = MFASetupSerializer()
        qr_code = serializer.generate_qr_code(request.user)
        
        # Generate backup codes if not exists
        if not request.user.backup_codes:
            backup_codes = [secrets.token_urlsafe(8).upper() for _ in range(10)]
            request.user.backup_codes = backup_codes
            request.user.save(update_fields=['backup_codes'])
        else:
            backup_codes = request.user.backup_codes
        
        return Response({
            'mfa_secret': request.user.mfa_secret,
            'qr_code': qr_code,
            'backup_codes': backup_codes if not request.user.mfa_enabled else None,
        })


class MFAVerifyView(APIView):
    """View for verifying MFA setup."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = MFAVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        token = serializer.validated_data['token']
        totp = pyotp.TOTP(request.user.mfa_secret)
        
        if totp.verify(token, valid_window=1):
            # Enable MFA for the user
            if not request.user.mfa_enabled:
                request.user.mfa_enabled = True
                request.user.save(update_fields=['mfa_enabled'])
            
            # Generate tokens
            refresh = RefreshToken.for_user(request.user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'mfa_required': False,
                'message': 'MFA verified successfully',
            })
        
        return Response(
            {'error': 'Invalid token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class MFALoginView(APIView):
    """View for MFA verification during login."""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        if 'email' not in request.data or 'token' not in request.data:
            return Response(
                {'error': 'Email and token are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=request.data['email'])
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if token is valid
        token = request.data['token']
        totp = pyotp.TOTP(user.mfa_secret)
        
        if totp.verify(token, valid_window=1) or token in (user.backup_codes or []):
            # If backup code was used, remove it
            if token in (user.backup_codes or []):
                user.backup_codes.remove(token)
                user.save(update_fields=['backup_codes'])
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'mfa_required': False,
                'message': 'MFA verified successfully',
            })
        
        return Response(
            {'error': 'Invalid token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class MFABackupCodesView(APIView):
    """View for managing MFA backup codes."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Generate new backup codes
        backup_codes = [secrets.token_urlsafe(8).upper() for _ in range(10)]
        request.user.backup_codes = backup_codes
        request.user.save(update_fields=['backup_codes'])
        
        return Response({
            'backup_codes': backup_codes,
            'message': 'New backup codes generated. Save them in a secure place.',
        })
    
    def post(self, request):
        # Verify a backup code
        serializer = MFABackupCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['code']
        if code in (request.user.backup_codes or []):
            # Remove used code
            request.user.backup_codes.remove(code)
            request.user.save(update_fields=['backup_codes'])
            
            # Generate tokens
            refresh = RefreshToken.for_user(request.user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'mfa_required': False,
                'message': 'Backup code verified successfully',
            })
        
        return Response(
            {'error': 'Invalid backup code'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
