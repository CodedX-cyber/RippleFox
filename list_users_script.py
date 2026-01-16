import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("Users in the database:")
print("-" * 50)

for user in User.objects.all():
    print(f"Email: {user.email}")
    print(f"Active: {user.is_active}")
    print(f"Staff: {user.is_staff}")
    print(f"Superuser: {user.is_superuser}")
    print(f"Last login: {user.last_login}")
    print(f"Date joined: {user.date_joined}")
    print("-" * 50)
