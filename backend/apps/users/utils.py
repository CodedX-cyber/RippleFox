"""Utility functions for the users app.

This module provides various utility functions for user-related operations such as
email verification, password reset, and token generation/validation.
"""

import logging
import uuid
from datetime import datetime, timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from .models import User
from .tokens import account_activation_token, password_reset_token

logger = logging.getLogger(__name__)

def get_client_ip(request):
    """Get the client's IP address from the request.
    
    Args:
        request: The HTTP request object.
        
    Returns:
        str: The client's IP address.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_user_agent(request):
    """Get the user agent from the request.
    
    Args:
        request: The HTTP request object.
        
    Returns:
        str: The user agent string or an empty string if not found.
    """
    return request.META.get('HTTP_USER_AGENT', '')

def generate_verification_token(user):
    """Generate a verification token for the user.
    
    Args:
        user: The user instance.
        
    Returns:
        str: A verification token.
    """
    return account_activation_token.make_token(user)

def send_verification_email(user, token, request=None):
    """Send a verification email to the user.
    
    Args:
        user: The user instance.
        token: The verification token.
        request: Optional HTTP request object for building absolute URLs.
        
    Returns:
        bool: True if the email was sent successfully, False otherwise.
    """
    try:
        # Create verification URL
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
        
        # Prepare email context
        context = {
            'user': user,
            'verification_url': verification_url,
            'site_name': settings.SITE_NAME,
            'support_email': settings.DEFAULT_FROM_EMAIL,
        }
        
        # Render email templates
        subject = f'Verify your email address - {settings.SITE_NAME}'
        message = render_to_string('emails/verification_email.txt', context)
        html_message = render_to_string('emails/verification_email.html', context)
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Verification email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Error sending verification email to {user.email}: {str(e)}")
        return False

def generate_password_reset_token(user):
    """Generate a password reset token for the user.
    
    Args:
        user: The user instance.
        
    Returns:
        str: A password reset token.
    """
    return password_reset_token.make_token(user)

def send_password_reset_email(user, token, request=None):
    """Send a password reset email to the user.
    
    Args:
        user: The user instance.
        token: The password reset token.
        request: Optional HTTP request object for building absolute URLs.
        
    Returns:
        bool: True if the email was sent successfully, False otherwise.
    """
    try:
        # Create password reset URL
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        
        # Prepare email context
        context = {
            'user': user,
            'reset_url': reset_url,
            'site_name': settings.SITE_NAME,
            'support_email': settings.DEFAULT_FROM_EMAIL,
            'expiry_hours': settings.PASSWORD_RESET_TIMEOUT // 3600,  # Convert seconds to hours
        }
        
        # Render email templates
        subject = f'Password Reset Request - {settings.SITE_NAME}'
        message = render_to_string('emails/password_reset_email.txt', context)
        html_message = render_to_string('emails/password_reset_email.html', context)
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Password reset email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Error sending password reset email to {user.email}: {str(e)}")
        return False

def validate_verification_token(uidb64, token):
    """Validate a verification token.
    
    Args:
        uidb64: The base64-encoded user ID.
        token: The verification token.
        
    Returns:
        User: The user if the token is valid, None otherwise.
    """
    try:
        # Decode the uid
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User._default_manager.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    
    if user is not None and account_activation_token.check_token(user, token):
        return user
    return None

def validate_password_reset_token(uidb64, token):
    """Validate a password reset token.
    
    Args:
        uidb64: The base64-encoded user ID.
        token: The password reset token.
        
    Returns:
        User: The active user if the token is valid, None otherwise.
    """
    try:
        # Decode the uid
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User._default_manager.get(pk=uid, is_active=True)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    
    if user is not None and password_reset_token.check_token(user, token):
        return user
    return None

# Alias for backward compatibility
verify_password_reset_token = validate_password_reset_token

def check_password_strength(password):
    """Check the strength of a password.
    
    Args:
        password: The password to check.
        
    Returns:
        tuple: A tuple of (is_valid, message) where is_valid is a boolean
              indicating if the password meets strength requirements,
              and message is a string describing the requirements not met.
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit."
    
    if not any(char.isalpha() for char in password):
        return False, "Password must contain at least one letter."
    
    if not any(not char.isalnum() for char in password):
        return False, "Password must contain at least one special character."
    
    return True, "Password is strong."
