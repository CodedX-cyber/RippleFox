import os
import sys
import django

# Add the backend directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, 'backend'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate

def setup_test_user():
    User = get_user_model()
    email = "test@example.com"
    password = "testpass123"
    
    # Delete user if exists
    User.objects.filter(email=email).delete()
    
    # Create new user
    user = User.objects.create_user(
        email=email,
        password=password,
        first_name="Test",
        last_name="User",
        is_active=True
    )
    
    print(f"✅ Created test user: {email}")
    print(f"   Password: {password}")
    
    # Test authentication
    auth_user = authenticate(email=email, password=password)
    if auth_user:
        print("✅ Authentication successful!")
        print(f"   User: {auth_user.email}")
        print(f"   ID: {auth_user.id}")
    else:
        print("❌ Authentication failed!")
    
    return user

if __name__ == "__main__":
    setup_test_user()
