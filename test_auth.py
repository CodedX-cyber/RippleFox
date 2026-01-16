import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate

def test_authentication(email, password):
    User = get_user_model()
    
    print(f"\n{'='*50}")
    print(f"Testing authentication for: {email}")
    print(f"Password length: {len(password)} characters")
    print("-" * 50)
    
    # Check if user exists
    try:
        user = User.objects.get(email=email)
        print(f"✅ User found: {user.email}")
        print(f"   - Active: {user.is_active}")
        print(f"   - Staff: {user.is_staff}")
        print(f"   - Superuser: {user.is_superuser}")
        print(f"   - Has password set: {bool(user.password)}")
        
        # Try to authenticate
        auth_user = authenticate(email=email, password=password)
        if auth_user is not None:
            print("✅ Authentication SUCCESSFUL")
            print(f"   - Authenticated user: {auth_user.email}")
            return True
        else:
            print("❌ Authentication FAILED")
            
            # Additional debug info
            from django.contrib.auth.hashers import check_password
            is_correct = check_password(password, user.password)
            print(f"   - Password matches stored hash: {is_correct}")
            
            if not is_correct:
                print(f"   - Stored password hash: {user.password}")
                
            return False
            
    except User.DoesNotExist:
        print(f"❌ User with email {email} does not exist")
        return False

if __name__ == "__main__":
    # Test with the user's credentials
    test_authentication("kingalale@gmail.com", "2025Volts2026$$")
