import os
import django
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.db import connection

User = get_user_model()

# User credentials
email = 'kingalale@gmail.com'
password = 'testpass123'  # Simple password for testing

def reset_and_verify():
    """Reset the user's password and verify authentication."""
    try:
        # Get the user
        user = User.objects.get(email=email)
        print(f"\n=== Resetting password for {email} ===")
        
        # Print current user status
        print(f"Current status - is_active: {user.is_active}, last_login: {user.last_login}")
        
        # Set a new password using set_password
        print("Setting new password...")
        user.set_password(password)
        user.is_active = True
        user.save()
        
        # Print the raw SQL being executed
        print("\n=== SQL Query ===")
        print(connection.queries[-1]['sql'])
        
        # Verify the password was set correctly
        user.refresh_from_db()
        print("\n=== Verifying password ===")
        password_ok = check_password(password, user.password)
        print(f"Password verification: {password_ok}")
        
        # Try to authenticate
        print("\n=== Testing Authentication ===")
        auth_user = authenticate(email=email, password=password)
        print(f"Authentication successful: {auth_user is not None}")
        
        if auth_user:
            print(f"Authenticated user: {auth_user.email}")
            print(f"User is active: {auth_user.is_active}")
        else:
            print("\n=== Debug Info ===")
            # Check password directly
            user = User.objects.get(email=email)
            print(f"Direct password check: {check_password(password, user.password)}")
            
            # Check authentication backends
            from django.conf import settings
            print("\nTrying each authentication backend:")
            for backend in settings.AUTHENTICATION_BACKENDS:
                print(f"\nBackend: {backend}")
                try:
                    auth_user = authenticate(backend=backend.split('.')[-1], 
                                          email=email, 
                                          password=password)
                    print(f"Result: {auth_user}")
                except Exception as e:
                    print(f"Error: {str(e)}")
        
        # Show final user status
        print("\n=== Final User Status ===")
        user = User.objects.get(email=email)
        print(f"Email: {user.email}")
        print(f"is_active: {user.is_active}")
        print(f"last_login: {user.last_login}")
        print(f"password set: {bool(user.password)}")
        print(f"password hash: {user.password}")
        
    except User.DoesNotExist:
        print(f"\nError: User {email} does not exist")
    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reset_and_verify()
