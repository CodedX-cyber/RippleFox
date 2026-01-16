import os
import django
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password, check_password

User = get_user_model()

# User credentials
email = 'kingalale@gmail.com'
password = 'testpass123'  # Simple password for testing

try:
    # Get the user
    user = User.objects.get(email=email)
    logger.info(f"Found user: {email}")
    
    # Print current user status
    logger.info(f"Current status - is_active: {user.is_active}, last_login: {user.last_login}")
    
    # Set and save the new password
    logger.info("Setting new password...")
    user.set_password(password)
    user.is_active = True
    user.save()
    
    # Verify the password was set correctly
    user.refresh_from_db()
    logger.info("Verifying password...")
    password_correct = check_password(password, user.password)
    logger.info(f"Password verification: {password_correct}")
    
    # Try to authenticate
    logger.info("Attempting authentication...")
    auth_user = authenticate(email=email, password=password)
    logger.info(f"Authentication successful: {auth_user is not None}")
    
    if auth_user:
        logger.info(f"Authenticated user: {auth_user.email}")
        logger.info(f"User is active: {auth_user.is_active}")
        logger.info(f"User last login: {auth_user.last_login}")
    else:
        # If authentication failed, try to find out why
        logger.warning("Authentication failed. Possible reasons:")
        logger.warning(f"- User is_active: {user.is_active}")
        logger.warning(f"- Password set: {bool(user.password)}")
        
        # Check if password matches
        user = User.objects.get(email=email)
        password_matches = check_password(password, user.password)
        logger.warning(f"- Password matches: {password_matches}")
        
        # Check backend authentication
        from django.conf import settings
        for backend in settings.AUTHENTICATION_BACKENDS:
            logger.warning(f"Trying backend: {backend}")
            user = authenticate(backend=backend, email=email, password=password)
            if user:
                logger.warning(f"Success with backend: {backend}")
                break
        
except User.DoesNotExist:
    logger.error(f"User with email {email} does not exist")
except Exception as e:
    logger.error(f"Error: {str(e)}", exc_info=True)

print("\n=== Final Status ===")
print(f"User {email} exists:", User.objects.filter(email=email).exists())
if User.objects.filter(email=email).exists():
    user = User.objects.get(email=email)
    print(f"- is_active: {user.is_active}")
    print(f"- last_login: {user.last_login}")
    print(f"- password set: {bool(user.password)}")
    
    # Verify password directly
    password_ok = check_password(password, user.password)
    print(f"- password matches: {password_ok}")
    
    # Try to authenticate
    auth_user = authenticate(email=email, password=password)
    print(f"- can authenticate: {auth_user is not None}")
