import os
import sys
import django

def setup_django():
    """Set up Django environment."""
    # Add the project root to Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    sys.path.append(project_root)
    
    # Set up Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()

def create_test_user():
    """Create a test user with admin privileges."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    email = 'test@example.com'
    password = 'testpass123'
    
    # Delete existing user if exists
    User.objects.filter(email=email).delete()
    
    # Create new user
    user = User.objects.create_user(
        email=email,
        password=password,
        first_name='Test',
        last_name='User',
        is_active=True,
        is_staff=True,
        is_superuser=True
    )
    
    print(f"\n=== Test User Created ===")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"Is Active: {user.is_active}")
    print(f"Is Staff: {user.is_staff}")
    print(f"Is Superuser: {user.is_superuser}")
    
    return user

def verify_authentication(email, password):
    """Verify that authentication works for the given credentials."""
    from django.contrib.auth import authenticate
    
    print("\n=== Verifying Authentication ===")
    user = authenticate(email=email, password=password)
    
    if user is not None:
        print("Authentication successful!")
        print(f"Authenticated as: {user.email}")
        return True
    else:
        print("Authentication failed!")
        return False

if __name__ == "__main__":
    try:
        print("Setting up Django...")
        setup_django()
        
        print("Creating test user...")
        user = create_test_user()
        
        # Verify authentication
        verify_authentication(user.email, 'testpass123')
        
    except Exception as e:
        print(f"\nError: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
