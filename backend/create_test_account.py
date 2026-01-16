import os
import django
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

def create_test_user():
    """Create a test user with a known password."""
    try:
        # Delete the test user if it exists
        User.objects.filter(email='testuser@example.com').delete()
        
        # Create a new test user
        user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_active=True
        )
        
        print("\n=== Test User Created ===")
        print(f"Email: {user.email}")
        print(f"Password: testpass123")
        print(f"is_active: {user.is_active}")
        
        # Verify the user can be authenticated
        from django.contrib.auth import authenticate
        auth_user = authenticate(email='testuser@example.com', password='testpass123')
        print(f"\nAuthentication successful: {auth_user is not None}")
        
        if auth_user:
            print(f"Authenticated as: {auth_user.email}")
        
        return user
        
    except Exception as e:
        print(f"Error creating test user: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_test_user()
