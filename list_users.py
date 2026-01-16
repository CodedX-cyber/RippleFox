import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def list_all_users():
    users = User.objects.all()
    if not users.exists():
        print("No users found in the database.")
        return
        
    print("\nUsers in the database:")
    print("-" * 50)
    for user in users:
        print(f"Email: {user.email}")
        print(f"  - ID: {user.id}")
        print(f"  - Active: {user.is_active}")
        print(f"  - Staff: {user.is_staff}")
        print(f"  - Superuser: {user.superuser}")
        print(f"  - Last login: {user.last_login}")
        print(f"  - Date joined: {user.date_joined}")
        print(f"  - Password set: {'Yes' if user.password else 'No'}")
        print("-" * 50)

if __name__ == "__main__":
    list_all_users()
