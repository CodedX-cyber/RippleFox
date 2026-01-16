import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_user_password(email, new_password):
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        print(f"✅ Password has been reset for user: {email}")
        return True
    except User.DoesNotExist:
        print(f"❌ User with email {email} does not exist")
        return False

if __name__ == "__main__":
    email = "kingalale@gmail.com"
    new_password = "testpass123"  # Simple password for testing
    reset_user_password(email, new_password)
