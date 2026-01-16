import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

User = get_user_model()

def check_user_credentials(email, password):
    try:
        user = User.objects.get(email=email)
        print(f"User found: {user.email}")
        print(f"Is active: {user.is_active}")
        print(f"Is staff: {user.is_staff}")
        print(f"Is superuser: {user.is_superuser}")
        print(f"Password set: {'Yes' if user.password else 'No'}")
        
        # Check if password matches
        if user.check_password(password):
            print("✅ Password is CORRECT")
        else:
            print("❌ Password is INCORRECT")
            
        return user
    except User.DoesNotExist:
        print(f"❌ User with email {email} does not exist")
        return None

if __name__ == "__main__":
    email = "kingalale@gmail.com"
    password = "2025Volts2026$$"
    print(f"Checking credentials for: {email}")
    user = check_user_credentials(email, password)
    
    if user:
        print("\nUser details:")
        print(f"ID: {user.id}")
        print(f"Name: {user.get_full_name()}")
        print(f"Date joined: {user.date_joined}")
        print(f"Last login: {user.last_login}")
