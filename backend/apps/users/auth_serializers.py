from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = (
            'email', 'password', 'password2', 'first_name', 'last_name',
            'phone_number', 'profile_picture', 'language', 'timezone'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'phone_number': {'required': False, 'allow_blank': True},
            'language': {'required': False, 'default': 'en'},
            'timezone': {'required': False, 'default': 'UTC'}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Handle both snake_case and camelCase field names
        if 'firstName' in attrs:
            attrs['first_name'] = attrs.pop('firstName')
        if 'lastName' in attrs:
            attrs['last_name'] = attrs.pop('lastName')
        if 'marketingConsent' in attrs:
            attrs['marketing_consent'] = attrs.pop('marketingConsent')
            
        return attrs

    def create(self, validated_data):
        # Remove password2 since it's not needed for user creation
        validated_data.pop('password2', None)
        
        try:
            # Get the password first as it's required
            password = validated_data.pop('password')
            email = validated_data.pop('email')
            
            # Create user with all fields
            user = User.objects.create_user(
                email=email,
                password=password,
                **validated_data
            )
            
            # Handle profile picture if provided
            if 'profile_picture' in validated_data:
                user.profile_picture = validated_data['profile_picture']
            
            user.save()
            return user
            
        except Exception as e:
            # Log the full error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Error creating user: {str(e)}', exc_info=True)
            
            # Handle specific database errors
            if 'duplicate key value violates unique constraint' in str(e).lower():
                if 'email' in str(e).lower():
                    raise serializers.ValidationError({
                        'email': 'A user with this email already exists.'
                    })
                elif 'username' in str(e).lower():
                    raise serializers.ValidationError({
                        'username': 'A user with this username already exists.'
                    })
            
            # For any other database errors, return a generic message
            raise serializers.ValidationError({
                'detail': 'Could not create user. Please try again later.'
            })


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = {
            'email': self.user.email,
            'user_type': self.user.user_type,
            'subscription_plan': self.user.subscription_plan
        }
        return data


class CheckAvailabilitySerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)

    def validate(self, data):
        if not data.get('email') and not data.get('username'):
            raise serializers.ValidationError("At least one of email or username must be provided")
        return data


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        from django.contrib.auth import get_user_model
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validate email format
        if not email:
            raise serializers.ValidationError({
                'detail': 'Email is required.',
                'code': 'email_required',
                'fields': ['email']
            })
            
        # Validate password
        if not password:
            raise serializers.ValidationError({
                'detail': 'Password is required.',
                'code': 'password_required',
                'fields': ['password']
            })
        
        # Validate password
        if not password:
            raise serializers.ValidationError({
                'detail': 'Password is required.',
                'code': 'password_required',
                'fields': ['password']
            })
        
        # Use our custom login_user function
        User = get_user_model()
        user = User.objects.filter(email=email).first()
        
        # Check if user exists and password is correct
        if user and user.check_password(password):
            # Bypass email verification check
            if not user.is_active:
                raise serializers.ValidationError({
                    'detail': 'Account is inactive. Please contact support.',
                    'code': 'account_inactive',
                    'fields': ['email']
                })
            return user
        
        # If we get here, either user doesn't exist or password is wrong
        raise serializers.ValidationError({
            'detail': 'Invalid email or password.',
            'code': 'invalid_credentials',
            'fields': ['email', 'password']
        })
