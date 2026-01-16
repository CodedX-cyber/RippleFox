import os
import sys
import django

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
    django.setup()
    
    # Import necessary modules
    from django.contrib.auth import get_user_model, authenticate
    from django.contrib.auth.hashers import check_password
    
    return get_user_model(), authenticate

def check_authentication():
    """Check authentication with the superuser."""
    User, authenticate = setup_django()
    
    try:
        # Get the superuser
        user = User.objects.get(email='kingalale@gmail.com')
        print(f"Found user: {user.email}")
        print(f"Is active: {user.is_active}")
        print(f"Is superuser: {user.is_superuser}")
        
        # Get the password from the user
        print("\nPlease enter the password for the superuser:")
        password = input("Password: ").strip()
        
        # Check password directly
        print("\n=== Direct Password Check ===")
        if check_password(password, user.password):
            print("✓ Password matches!")
        else:
            print("✗ Password does not match!")
        
        # Try authenticating with the default backend
        print("\n=== Testing Default Backend ===")
        auth_user = authenticate(username=user.email, password=password)
        if auth_user:
            print("✓ Default backend authentication successful!")
        else:
            print("✗ Default backend authentication failed!")
        
        # Try authenticating with the email backend
        print("\n=== Testing Email Backend ===")
        auth_user = authenticate(email=user.email, password=password)
        if auth_user:
            print("✓ Email backend authentication successful!")
        else:
            print("✗ Email backend authentication failed!")
        
        # Print the user's password hash for debugging
        print("\n=== User's Password Hash ===")
        print(user.password)
        
        return True
        
    except User.DoesNotExist:
        print("✗ Superuser not found!")
        return False
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== Authentication Backend Check ===\n")
    check_authentication()
