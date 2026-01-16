"""
Authentication views for the users app.
"""
import logging
from django.conf import settings
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate

from .models import User, UserProfile, UserActivity
from .auth_serializers import (
    UserRegistrationSerializer,
    ResendVerificationSerializer,
    VerifyEmailSerializer,
    CustomTokenObtainPairSerializer,
    CheckAvailabilitySerializer,
    UserLoginSerializer
)
from .serializers import UserProfileSerializer, UserSerializer
from .utils import (
    get_client_ip, get_user_agent,
    generate_verification_token, send_verification_email,
    send_password_reset_email, verify_password_reset_token
)

logger = logging.getLogger(__name__)

class UserRegistrationView(APIView):
    """
    View for user registration with email verification.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Handle user registration with email verification."""
        logger.info(f"Registration attempt with data: {request.data}")
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
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
            except Exception as e:
                logger.error(f"Error during registration: {str(e)}", exc_info=True)
                return Response(
                    {"detail": "An error occurred during registration. Please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        logger.warning(f"Registration validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    View for user login with JWT token authentication.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Handle user login."""
        logger.info(f"Login attempt with data: {request.data}")
        
        # First, validate the request data
        try:
            data = request.data if isinstance(request.data, dict) else {}
            # Handle nested form data structure
            if 'email' in data and isinstance(data['email'], dict):
                # Handle nested form data: {'email': {'email': '...', 'password': '...'}}
                email = str(data['email'].get('email', '')).strip()
                password = str(data['email'].get('password', ''))
            else:
                # Handle flat structure: {'email': '...', 'password': '...'}
                email = str(data.get('email', '')).strip()
                password = str(data.get('password', ''))
        
        except Exception as e:
            logger.error(f"Error processing login data: {str(e)}")
            return Response(
                {
                    "detail": "Invalid request data format",
                    "code": "invalid_format"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not email or not password:
            logger.warning("Login failed: Missing email or password")
            return Response(
                {
                    "detail": "Both email and password are required",
                    "code": "missing_credentials",
                    "fields": ["email" if not email else "password"]
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Try to get the user first to check if they exist
            try:
                user = User.objects.get(email=email)
                logger.info(f"User found: {user.email}, is_active: {user.is_active}")
            except User.DoesNotExist:
                logger.warning(f"Login failed: User with email {email} does not exist")
                return Response(
                    {
                        "detail": "Invalid email or password",
                        "code": "invalid_credentials",
                        "fields": ["email", "password"]
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Now try to authenticate with detailed logging
            logger.info(f"Attempting to authenticate user: {email}")
            logger.info(f"Password length: {len(password)} characters")
            
            # Try to authenticate with the provided credentials
            user = authenticate(request, email=email, password=password)
            
            # Log authentication result
            if user is None:
                logger.warning(f"Authentication failed for user: {email}")
                
                # Additional check to see if it's a password issue
                from django.contrib.auth.hashers import check_password
                try:
                    user = User.objects.get(email=email)
                    password_matches = check_password(password, user.password)
                    logger.warning(f"Password match check: {password_matches}")
                    if not password_matches:
                        logger.warning("Password does not match stored hash")
                except Exception as e:
                    logger.error(f"Error checking password: {str(e)}")
                
                return Response(
                    {
                        "detail": "Invalid email or password",
                        "code": "invalid_credentials",
                        "fields": ["email", "password"]
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            if not user.is_active:
                logger.warning(f"Login failed: User {email} is inactive")
                return Response(
                    {"detail": "This account is inactive. Please contact support."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Update last login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            # Prepare user data with required fields
            user_data = {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name or '',
                'last_name': user.last_name or '',
                'is_active': user.is_active,
                'is_verified': user.is_verified if hasattr(user, 'is_verified') else True,
                'user_type': user.user_type if hasattr(user, 'user_type') else 'customer',
                'subscription_plan': user.subscription_plan if hasattr(user, 'subscription_plan') else 'free',
                'date_joined': user.date_joined.isoformat() if user.date_joined else None,
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error during login for user {email}: {str(e)}", exc_info=True)
            return Response(
                {"detail": "An error occurred during login. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResendVerificationView(APIView):
    """
    View for resending verification email.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Handle resend verification email request."""
        serializer = ResendVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Generate new verification token and send email
            token = generate_verification_token(user)
            send_verification_email(user, token, request)
            
            return Response(
                {"detail": "Verification email has been resent. Please check your inbox."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    """
    View for email verification.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Handle email verification."""
        serializer = VerifyEmailSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            try:
                # Try to get the user by the token
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user = User.objects.get(verification_token=token)
                if not user.is_email_verified:
                    user.is_email_verified = True
                    user.save()
                    return Response(
                        {"detail": "Email verified successfully."}, 
                        status=status.HTTP_200_OK
                    )
                return Response(
                    {"detail": "Email already verified."},
                    status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                return Response(
                    {"detail": "Invalid or expired verification token."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckAvailabilityView(APIView):
    """
    View for checking email/username availability.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Check if email or username is available."""
        serializer = CheckAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            username = serializer.validated_data.get('username')
            
            response = {}
            if email is not None:
                response['email_available'] = not User.objects.filter(email=email).exists()
            if username is not None:
                response['username_available'] = not User.objects.filter(username=username).exists()
                
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain view that includes user data in the response.
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Get the user from the validated data
            user = User.objects.get(email=request.data.get('email'))
            
            # Add user data to the response
            response.data['user'] = {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'is_active': user.is_active,
                'is_verified': user.is_email_verified,
                'user_type': user.user_type,
                'subscription_plan': user.subscription_plan
            }
            
            # Log the login
            UserActivity.objects.create(
                user=user,
                action='login',
                ip_address=get_client_ip(request),
                user_agent=get_user_agent(request)
            )
            
            # Update last login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
        return response


class UserProfileView(APIView):
    """View to get and update current user's profile."""
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method == 'GET':
            return []  # Allow any user to access this endpoint
        return [permissions.IsAuthenticated()]  # Require authentication for other methods
    
    def get(self, request):
        """Return the current user's profile if authenticated, or 401 if not."""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            # If no profile exists, return basic user data
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Update the current user's profile."""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        except UserProfile.DoesNotExist:
            serializer = UserProfileSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
