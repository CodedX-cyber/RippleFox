import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

def list_users():
    """List all users in the database."""
    User = get_user_model()
    users = User.objects.all()
    
    print(f"\n=== Found {users.count()} users ===")
    for user in users:
        print(f"- {user.email} (ID: {user.id}, Active: {user.is_active}, Last Login: {user.last_login})")

if __name__ == "__main__":
    list_users()
