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
from apps.users.backends import EmailBackend

User = get_user_model()

# User credentials
email = 'kingalale@gmail.com'
password = 'testpass123'  # Simple password for testing

def test_authentication():
    """Test authentication with the custom backend."""
    try:
        # Get the user
        user = User.objects.get(email=email)
        print(f"\n=== Testing Authentication for {email} ===")
        print(f"User exists: {user.email}")
        print(f"is_active: {user.is_active}")
        print(f"Password set: {bool(user.password)}")
        
        # Verify password directly
        password_ok = check_password(password, user.password)
        print(f"\n1. Direct password check: {password_ok}")
        
        # Test with default authenticate
        print("\n2. Testing with default authenticate():")
        auth_user = authenticate(email=email, password=password)
        print(f"Authenticated user: {auth_user}")
        
        # Test with custom backend directly
        print("\n3. Testing with custom EmailBackend:")
        backend = EmailBackend()
        custom_auth_user = backend.authenticate(None, email=email, password=password)
        print(f"Custom backend auth: {custom_auth_user}")
        
        if custom_auth_user:
            print(f"User authenticated: {custom_auth_user.email}")
        else:
            print("Authentication failed with custom backend")
            
            # Additional debug
            print("\n=== Debug Info ===")
            print("Trying to check password directly with user.check_password():")
            try:
                print(f"Password check result: {user.check_password(password)}")
                print(f"Stored password hash: {user.password[:30]}...")
            except Exception as e:
                print(f"Error checking password: {str(e)}")
            
    except User.DoesNotExist:
        print(f"\nError: User {email} does not exist")
    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_authentication()
