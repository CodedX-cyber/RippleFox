import os
import sys
import django
from pathlib import Path

def setup_django():
    """Set up Django environment."""
    # Add the backend directory to Python path
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0, backend_dir)
    
    # Add the project root to Python path
    project_root = os.path.dirname(backend_dir)
    sys.path.insert(0, project_root)
    
    # Set up Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    try:
        django.setup()
    except Exception as e:
        print(f"Error setting up Django: {e}")
        print(f"Current sys.path: {sys.path}")
        print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
        raise
    
    # Import the user model after Django setup
    from django.contrib.auth import get_user_model
    return get_user_model()

def create_test_user():
    """Create a test user with admin privileges."""
    User = setup_django()
    
    # Create or update the admin user
    email = 'admin@example.com'
    password = 'admin123'
    
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
            'first_name': 'Admin',
            'last_name': 'User'
        }
    )
    
    if created or not user.check_password(password):
        user.set_password(password)
        user.save()
        print(f"User '{email}' created/updated with password: {password}")
    else:
        print(f"User '{email}' already exists")
    
    return user

if __name__ == "__main__":
    try:
        user = create_test_user()
        print("\n=== Test User Details ===")
        print(f"Email: {user.email}")
        print(f"ID: {user.id}")
        print(f"Is Active: {user.is_active}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Superuser: {user.is_superuser}")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
