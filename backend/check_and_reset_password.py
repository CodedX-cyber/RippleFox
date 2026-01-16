import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password

User = get_user_model()
email = 'kingalale@gmail.com'
password = '2025Volts2026$$'  # The password you're trying to use

try:
    # Get the user
    user = User.objects.get(email=email)
    print(f"User found: {user.email}")
    print(f"Active: {user.is_active}")
    print(f"Last login: {user.last_login}")
    
    # Check if password is usable
    print(f"\nPassword status:")
    print(f"Has usable password: {user.has_usable_password()}")
    
    # Try to authenticate
    from django.contrib.auth import authenticate
    auth_user = authenticate(email=email, password=password)
    print(f"\nAuthentication result: {'Success' if auth_user else 'Failed'}")
    
    # If authentication fails, reset the password
    if not auth_user:
        print("\nResetting password...")
        user.set_password(password)
        user.save()
        print("Password has been reset successfully!")
        
        # Verify the new password
        auth_user = authenticate(email=email, password=password)
        print(f"Verification after reset: {'Success' if auth_user else 'Failed'}")
    
except User.DoesNotExist:
    print(f"User with email {email} does not exist")
except Exception as e:
    print(f"An error occurred: {str(e)}")
