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

def reset_superuser_password():
    """Reset the password for the superuser."""
    User = setup_django()
    
    try:
        # Get the superuser
        user = User.objects.get(email='kingalale@gmail.com')
        print(f"Found user: {user.email}")
        
        # Get new password
        print("\nEnter a new password for the superuser:")
        password = input("New password: ").strip()
        
        if not password:
            print("Password cannot be empty!")
            return False
            
        # Set the new password
        user.set_password(password)
        user.save()
        
        print("\nPassword has been updated successfully!")
        print(f"Email: {user.email}")
        print(f"New password: {password}")
        
        return True
        
    except User.DoesNotExist:
        print("Superuser with email 'kingalale@gmail.com' not found!")
        return False
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== Reset Superuser Password ===\n")
    if reset_superuser_password():
        print("\nYou can now log in with the new password.")
    else:
        print("\nFailed to reset password. Please check the error message above.")
