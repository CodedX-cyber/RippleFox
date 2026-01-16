import os
import django
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password

User = get_user_model()
email = 'kingalale@gmail.com'
# Using a simpler password for testing
password = '2025Volts2026$$'

try:
    # Get the user
    user = User.objects.get(email=email)
    logger.info(f"Found user: {user.email}, is_active: {user.is_active}")
    
    # Print current password hash (for debugging)
    logger.info(f"Current password hash: {user.password[:30]}...")
    
    # Set and save the new password
    user.set_password(password)
    user.is_active = True
    user.save()
    logger.info("Password updated successfully")
    
    # Verify the password was set
    user.refresh_from_db()
    password_matches = check_password(password, user.password)
    logger.info(f"Password verification: {password_matches}")
    
    # Additional verification
    from django.contrib.auth import authenticate
    auth_user = authenticate(email=email, password=password)
    logger.info(f"Authentication result: {'Success' if auth_user else 'Failed'}")
    
    if auth_user:
        logger.info(f"Authenticated user: {auth_user.email}")
    else:
        logger.warning("Authentication failed")
        
    print("\n=== Verification Results ===")
    print(f"Password updated for: {email}")
    print(f"Password matches: {password_matches}")
    print(f"Authentication successful: {auth_user is not None}")
    
except Exception as e:
    logger.error(f"Error: {str(e)}", exc_info=True)
    print(f"\nError: {str(e)}")
