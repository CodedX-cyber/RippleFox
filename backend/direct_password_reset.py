import os
import django
import logging
from django.db import connection

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model

User = get_user_model()

# User credentials
email = 'kingalale@gmail.com'
password = 'testpass123'  # Simple password for testing

def reset_password_directly():
    """Reset the user's password directly in the database."""
    try:
        # Get the user
        user = User.objects.get(email=email)
        print(f"Resetting password for user: {email}")
        
        # Generate the password hash
        password_hash = make_password(password)
        
        # Update the password directly in the database
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE users_user SET password = %s, is_active = TRUE WHERE email = %s",
                [password_hash, email]
            )
            print(f"Updated password for {email}")
            print(f"Password hash: {password_hash}")
        
        # Verify the update
        user = User.objects.get(email=email)
        print("\n=== Verification ===")
        print(f"User exists: {user.email}")
        print(f"is_active: {user.is_active}")
        print(f"Password set: {bool(user.password)}")
        
        # Try to authenticate
        from django.contrib.auth import authenticate
        auth_user = authenticate(email=email, password=password)
        print(f"\nAuthentication result: {auth_user is not None}")
        
        if auth_user:
            print(f"Successfully authenticated as: {auth_user.email}")
        else:
            print("Authentication failed. Possible issues:")
            print("1. The password hash might not be compatible with your authentication backends")
            print("2. Check that the user's is_active flag is True")
            print("3. Verify your AUTHENTICATION_BACKENDS in settings.py")
            
    except User.DoesNotExist:
        print(f"User {email} does not exist in the database")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reset_password_directly()
