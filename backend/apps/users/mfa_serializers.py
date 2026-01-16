"""
Serializers for Multi-Factor Authentication (MFA) functionality.
"""
from rest_framework import serializers
import pyotp
import qrcode
import base64
from io import BytesIO


class MFASetupSerializer(serializers.Serializer):
    """Serializer for MFA setup."""
    
    def generate_qr_code(self, user):
        """Generate QR code for MFA setup."""
        if not user.mfa_secret:
            raise serializers.ValidationError("MFA secret not found")
            
        # Create TOTP URI
        totp_uri = pyotp.totp.TOTP(user.mfa_secret).provisioning_uri(
            name=user.email,
            issuer_name="Volt Conglomerate"
        )
        
        # Generate QR code
        img = qrcode.make(totp_uri)
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode('utf-8')


class MFAVerifySerializer(serializers.Serializer):
    """Serializer for MFA verification."""
    token = serializers.CharField(required=True, max_length=6, min_length=6)
    
    def validate_token(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Token must be a 6-digit number")
        return value


class MFABackupCodeSerializer(serializers.Serializer):
    """Serializer for MFA backup codes."""
    code = serializers.CharField(required=True, max_length=10, min_length=8)
