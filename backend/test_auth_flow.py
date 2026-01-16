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
    
    # Import the user model after Django setup
    from django.contrib.auth import get_user_model
    return get_user_model()

def test_authentication():
    """Test authentication with the superuser."""
    User = setup_django()
    
    # Get the superuser
    try:
        user = User.objects.get(email='kingalale@gmail.com')
        print(f"Found user: {user.email}")
        print(f"Is active: {user.is_active}")
        print(f"Is superuser: {user.is_superuser}")
        
        # Test password check
        from django.contrib.auth.hashers import check_password
        print("\nTesting password check:")
        
        # First try with a wrong password
        print("Testing with wrong password...")
        if check_password('wrong_password', user.password):
            print("ERROR: Wrong password was accepted!")
        else:
            print("✓ Wrong password correctly rejected")
        
        # Now try with the correct password (you'll need to enter this)
        print("\nPlease enter the password for the superuser:")
        password = input("Password: ").strip()
        
        if check_password(password, user.password):
            print("✓ Password matches!")
            
            # Try authenticating with the backend
            from django.contrib.auth import authenticate
            print("\nTesting authentication...")
            auth_user = authenticate(email=user.email, password=password)
            
            if auth_user:
                print(f"✓ Authentication successful! User: {auth_user.email}")
                return True
            else:
                print("✗ Authentication failed!")
                print("Possible issues:")
                print("1. Check AUTHENTICATION_BACKENDS in settings.py")
                print("2. Check the custom EmailBackend implementation")
                return False
                
        else:
            print("✗ Password does not match!")
            print("Please make sure you're using the correct password.")
            return False
            
    except User.DoesNotExist:
        print("✗ Superuser not found!")
        print("Please make sure you have created a superuser with email 'kingalale@gmail.com'")
        return False

if __name__ == "__main__":
    print("=== Testing Authentication Flow ===\n")
    test_authentication()
