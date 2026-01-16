import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
email = 'kingalale@gmail.com'
new_password = '2025Volts2026$$'  # The new password you want to set

try:
    # Get the user
    user = User.objects.get(email=email)
    print(f"Resetting password for user: {user.email}")
    
    # Set the new password
    user.set_password(new_password)
    user.is_active = True
    user.save()
    
    # Verify the password was set
    user.refresh_from_db()
    print("Password has been reset successfully!")
    print(f"User is active: {user.is_active}")
    
    # Test authentication
    from django.contrib.auth import authenticate
    auth_user = authenticate(email=email, password=new_password)
    print(f"Authentication test: {'SUCCESS' if auth_user else 'FAILED'}")
    
except User.DoesNotExist:
    print(f"Error: User with email {email} does not exist")
except Exception as e:
    print(f"An error occurred: {str(e)}")
