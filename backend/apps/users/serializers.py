"""Serializers for the users app."""

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .models import User, UserProfile, UserActivity


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserProfile model.
    """
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'date_of_birth', 'address', 'city', 'state', 
            'country', 'postal_code', 'website', 'twitter', 'linkedin',
            'email_notifications', 'marketing_emails'
        ]
        extra_kwargs = {
            'date_of_birth': {'required': False},
        }

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    profile = UserProfileSerializer(required=False)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password', 'placeholder': 'Password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password', 'placeholder': 'Confirm Password'}
    )
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture',
            'language', 'timezone', 'is_active', 'is_verified', 'date_joined',
            'last_login', 'profile', 'password', 'confirm_password'
        ]
        read_only_fields = ('id', 'is_active', 'is_verified', 'date_joined', 'last_login')
        extra_kwargs = {
            'password': {'write_only': True},
            'profile_picture': {'required': False},
        }
    
    def validate(self, attrs):
        """
        Validate that the password and confirm_password match.
        """
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": _("Password fields didn't match.")})
        
        # Remove confirm_password from the returned data
        attrs.pop('confirm_password', None)
        return attrs
    
    def create(self, validated_data):
        """Create a new user with the given validated data.
        
        Args:
            validated_data (dict): The validated data for user creation.
            
        Returns:
            User: The newly created user instance.
        """
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)
        
        # Create user
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        
        # Create user profile
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        else:
            UserProfile.objects.create(user=user)
            
        return user
    
    def update(self, instance, validated_data):
        """Update a user instance with the given validated data.
        
        Args:
            instance (User): The user instance to update.
            validated_data (dict): The validated data for user update.
            
        Returns:
            User: The updated user instance.
        """
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        # Update password if provided
        if password:
            instance.set_password(password)
            
        instance.save()
        
        # Update profile if it exists
        profile = instance.profile
        if profile_data and profile:
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
            
        return instance

class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': _('Email is required'),
            'invalid': _('Enter a valid email address')
        }
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': _('Password is required')
        }
    )
    
    def validate(self, attrs):
        """Validate user credentials.
        
        Args:
            attrs (dict): The input data containing email and password.
            
        Returns:
            dict: The validated attributes if authentication is successful.
            
        Raises:
            serializers.ValidationError: If authentication fails, user is inactive,
            or email is not verified.
        """
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')
            
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        
        if not user:
            msg = _('Unable to log in with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')
            
        if not user.is_active:
            msg = _('User account is disabled.')
            raise serializers.ValidationError(msg, code='authorization')
            
        if not user.is_verified:
            msg = _('Email address is not verified.')
            raise serializers.ValidationError(msg, code='authorization')
            
        attrs['user'] = user
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset email.
    """
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for confirming a password reset.
    """
    new_password = serializers.CharField(required=True, style={'input_type': 'password'})
    confirm_new_password = serializers.CharField(required=True, style={'input_type': 'password'})
    
    def validate(self, attrs):
        """
        Validate that the two password fields match.
        """
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

class UserActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for UserActivity model.
    """
    class Meta:
        model = UserActivity
        fields = ['id', 'session_key', 'ip_address', 'login_time', 'last_activity', 'logout_time', 'is_active']
        read_only_fields = fields

class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user (admin only).
    """
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'phone_number', 'language', 'timezone']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user details.
    """
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'language', 'timezone', 'is_active']

class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing users (minimal fields).
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'last_login']
