import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db import connection

# Print database connection info
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        print(f"Database connection successful. Version: {db_version[0]}")
except Exception as e:
    print(f"Database connection error: {e}")
    exit(1)

User = get_user_model()
email = 'kingalale@gmail.com'
password = ''  # The password you want to set

print("\n=== User Account Check ===")
try:
    # Try to get the user
    user = User.objects.filter(email=email).first()
    
    if user:
        print(f"User found: {user.email}")
        print(f"Active: {user.is_active}")
        print(f"Has usable password: {user.has_usable_password()}")
        
        # Check current password
        password_ok = user.check_password(password)
        print(f"Password check: {'CORRECT' if password_ok else 'INCORRECT'}")
        
        if not password_ok:
            print("Resetting password...")
            user.set_password(password)
            user.is_active = True
            user.save()
            print("Password has been reset successfully!")
    else:
        print("User does not exist. Creating new user...")
        user = User.objects.create_user(
            email=email,
            password=password,
            is_active=True
        )
        print(f"User {email} created successfully!")
    
    # Test authentication
    print("\n=== Testing Authentication ===")
    from django.contrib.auth import authenticate
    auth_user = authenticate(email=email, password=password)
    
    if auth_user:
        print("Authentication SUCCESSFUL!")
        print(f"User ID: {auth_user.id}")
        print(f"Email: {auth_user.email}")
        print(f"Is Active: {auth_user.is_active}")
        print(f"Is Staff: {getattr(auth_user, 'is_staff', False)}")
    else:
        print("Authentication FAILED!")
        print("Possible reasons:")
        print("1. User is not active")
        print("2. Password is incorrect")
        print("3. Authentication backend issue")
        
        # Additional diagnostics
        user = User.objects.get(email=email)
        print("\nUser record details:")
        print(f"ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Is Active: {user.is_active}")
        print(f"Password set: {bool(user.password)}")
        print(f"Last Login: {user.last_login}")
        print(f"Date Joined: {user.date_joined}")
        
        # Check password directly
        print("\nPassword verification:")
        from django.contrib.auth.hashers import check_password
        password_ok = check_password(password, user.password)
        print(f"Password matches: {password_ok}")
        
        if not password_ok:
            print("Attempting to reset password again...")
            user.set_password(password)
            user.save()
            print("Password has been reset. Please try authenticating again.")

except Exception as e:
    print(f"\nAn error occurred: {str(e)}")
    import traceback
    traceback.print_exc()

print("\nScript completed.")
