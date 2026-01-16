"""
Views for the users app.
"""
import logging
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate, login
from django.utils import timezone
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.views.generic import TemplateView
from rest_framework import status, permissions, generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import User, UserActivity, UserProfile
from .serializers import (
    UserSerializer, LoginSerializer, 
    PasswordResetSerializer, PasswordResetConfirmSerializer,
    UserActivitySerializer, UserProfileSerializer
)
from .utils import (
    get_client_ip, get_user_agent,
    generate_verification_token, send_verification_email,
    generate_password_reset_token, send_password_reset_email
)

logger = logging.getLogger(__name__)
User = get_user_model()

class UserRegistrationView(APIView):
    """
    View for user registration.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """
        Handle user registration.
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate verification token and send email
            token = generate_verification_token(user)
            send_verification_email(user, token, request)
            
            # Log the registration
            logger.info(f"New user registered: {user.email}")
            
            return Response(
                {"detail": "Registration successful. Please check your email to verify your account."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    """
    View for user login with MFA support.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """
        Handle user login with MFA verification if enabled.
        """
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        user = serializer.validated_data['user']
        
        # Check if account is locked
        if user.account_locked_until and user.account_locked_until > timezone.now():
            return Response(
                {'error': 'Account is temporarily locked. Please try again later.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Create user activity log
        UserActivity.objects.create(
            user=user,
            session_key=request.session.session_key or 'no-session',
            ip_address=get_client_ip(request),
            user_agent=get_user_agent(request)
        )
        
        # Update last login and reset failed attempts
        user.last_login = timezone.now()
        user.failed_login_attempts = 0
        user.account_locked_until = None
        user.save(update_fields=['last_login', 'failed_login_attempts', 'account_locked_until'])
        
        # If MFA is enabled, require verification
        if user.mfa_enabled:
            # Generate a temporary token for MFA verification
            temp_token = RefreshToken.for_user(user)
            return Response({
                'mfa_required': True,
                'temp_token': str(temp_token.access_token),
                'message': 'MFA verification required',
            }, status=status.HTTP_200_OK)
        
        # Generate final tokens if MFA is not required
        refresh = RefreshToken.for_user(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
            'mfa_required': False,
        }
        
        logger.info(f"User logged in: {user.email}")
        return Response(data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    """View to get current user's profile."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Return the current user's profile."""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserLogoutView(APIView):
    """
    View for user logout.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """
        Handle user logout.
        """
        try:
            # Get the refresh token from the request data
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                
                # Log the logout
                logger.info(f"User logged out: {request.user.email}")
                
                return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return Response(
                {"detail": "An error occurred during logout."},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View for retrieving and updating user profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
            
        logger.info(f"User profile updated: {instance.email}")
        return Response(serializer.data)

class PasswordResetView(APIView):
    """
    View for requesting a password reset.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """
        Handle password reset request.
        """
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email, is_active=True)
                token = generate_password_reset_token(user)
                send_password_reset_email(user, token, request)
                
                logger.info(f"Password reset requested for: {email}")
                return Response(
                    {"detail": "Password reset email has been sent if the email exists in our system."},
                    status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                # Don't reveal that the user doesn't exist
                logger.warning(f"Password reset attempt for non-existent email: {email}")
                return Response(
                    {"detail": "If this email exists in our system, you will receive a password reset link."},
                    status=status.HTTP_200_OK
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    """
    View for confirming a password reset.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, uidb64, token):
        """
        Handle password reset confirmation.
        """
        # This would be implemented to validate the token and reset the password
        # Implementation would verify the token and update the password
        pass

class EmailVerificationView(APIView):
    """
    View for email verification.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, uidb64, token):
        """
        Handle email verification.
        """
        # This would be implemented to verify the email
        # Implementation would verify the token and mark the email as verified
        pass

class UserActivityView(generics.ListAPIView):
    """
    View for retrieving user activity logs.
    """
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user).order_by('-login_time')

class DashboardView(View):
    """
    Dashboard view that shows different content based on user roles.
    """
    template_name = 'users/dashboard.html'
    
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        # Get user's roles
        user_roles = [group.name.lower() for group in request.user.groups.all()]
        
        # Dashboard data based on roles
        context = {
            'user': request.user,
            'roles': user_roles,
            'is_ceo': 'ceo' in user_roles,
            'is_cto': 'cto' in user_roles,
            'is_cfo': 'cfo' in user_roles,
            'is_hr': 'hr' in user_roles,
            'is_it_admin': 'it_admin' in user_roles,
            'is_manager': 'manager' in user_roles,
            'is_staff': 'staff' in user_roles,
            'is_admin_staff': 'admin_staff' in user_roles,
            'is_it_support': 'it_support' in user_roles,
        }
        
        # Add role-specific data
        if context['is_ceo']:
            context['ceo_dashboard'] = {
                'title': 'CEO Dashboard',
                'metrics': [
                    {'name': 'Total Revenue', 'value': '$1.2M', 'change': '+12%'},
                    {'name': 'Active Users', 'value': '1,452', 'change': '+5%'},
                    {'name': 'Projects', 'value': '28', 'change': '+3'},
                ]
            }
        
        if context['is_cto'] or context['is_it_admin']:
            context['tech_dashboard'] = {
                'title': 'Technology Dashboard',
                'systems': [
                    {'name': 'Web Servers', 'status': 'online', 'uptime': '99.9%'},
                    {'name': 'Database', 'status': 'online', 'uptime': '99.8%'},
                    {'name': 'API', 'status': 'online', 'uptime': '99.7%'},
                ]
            }
        
        if context['is_hr'] or context['is_admin_staff']:
            context['hr_dashboard'] = {
                'title': 'HR Dashboard',
                'stats': [
                    {'name': 'Total Employees', 'value': '142'},
                    {'name': 'Open Positions', 'value': '8'},
                    {'name': 'On Leave', 'value': '5'},
                ]
            }
        
        # Add permissions
        context['can_view_reports'] = request.user.has_perm('auth.can_view_reports')
        context['can_manage_users'] = request.user.has_perm('auth.can_edit_user')
        
        return render(request, self.template_name, context)

class HomeView(TemplateView):
    """
    Home view that shows a landing page for unauthenticated users
    and redirects authenticated users to their dashboard.
    """
    template_name = 'home.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('users:dashboard')  # Updated to use namespaced URL
        return super().get(request, *args, **kwargs)

class TokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view to include user data in the response.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200 and 'access' in response.data:
            user = request.user
            if user.is_authenticated:
                response.data['user'] = UserSerializer(user).data
                
        return response
