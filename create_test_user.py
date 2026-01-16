import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

# Get the User model
User = get_user_model()

# Create or update test user
try:
    user = User.objects.get(email='test@example.com')
    user.set_password('testpass123')
    user.is_active = True
    user.save()
    print("Updated existing test user")
except User.DoesNotExist:
    user = User.objects.create_user(
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User',
        is_active=True
    )
    print("Created new test user")

print(f"Email: {user.email}")
print("Password set to: testpass123")
