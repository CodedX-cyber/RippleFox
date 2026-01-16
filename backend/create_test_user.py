"""
Script to create a test user with proper permissions for testing the pages.
"""
import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from apps.users.permissions import create_groups, has_permission, CAN_VIEW_REPORTS, CAN_MANAGE_USERS

User = get_user_model()

def create_test_user():
    """Create a test user with admin permissions."""
    # Create groups and permissions
    create_groups()
    
    # Create or get test user
    email = 'testadmin@ripplefox.com'
    password = 'Test123!*_'
    
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'first_name': 'Test',
            'last_name': 'Admin',
            'is_staff': True,
            'is_active': True,
            'is_verified': True
        }
    )
    
    if created:
        user.set_password(password)
        user.save()
        print(f"Created new user: {email}")
    else:
        print(f"User already exists: {email}")
    
    # Add user to CEO group (has all permissions)
    from django.contrib.auth.models import Group
    ceo_group = Group.objects.get(name='CEO')
    user.groups.add(ceo_group)
    
    # Verify permissions
    print(f"\nPermissions for {email}:")
    print(f"Can view reports: {has_permission(user, CAN_VIEW_REPORTS)}")
    print(f"Can manage users: {has_permission(user, CAN_MANAGE_USERS)}")
    
    print(f"\nUser details:")
    print(f"Email: {user.email}")
    print(f"Name: {user.get_full_name()}")
    print(f"Is staff: {user.is_staff}")
    print(f"Is active: {user.is_active}")
    print(f"Groups: {[group.name for group in user.groups.all()]}")
    
    print(f"\nLogin credentials:")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"\nYou can now access:")
    print(f"- Dashboard: http://localhost:8000/dashboard/")
    print(f"- Reports: http://localhost:8000/reports/")
    print(f"- Manage Users: http://localhost:8000/manage-users/")
    print(f"- Settings: http://localhost:8000/settings/")

if __name__ == '__main__':
    create_test_user()
