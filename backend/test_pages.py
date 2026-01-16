"""
Test script to verify the pages work correctly.
"""
import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['ALLOWED_HOSTS'] = 'localhost,127.0.0.1'

import django
django.setup()

from django.test import Client, TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

def test_pages():
    """Test all pages with proper authentication."""
    c = Client()
    
    # Get the test user
    user = User.objects.get(email='testadmin@ripplefox.com')
    
    # Login using Django's test client
    c.force_login(user)
    
    # Test dashboard
    response = c.get('/dashboard/')
    print(f'Dashboard page status: {response.status_code}')
    if response.status_code == 200:
        print('✓ Dashboard page works')
    else:
        print('✗ Dashboard page failed')
    
    # Test reports
    response = c.get('/reports/')
    print(f'Reports page status: {response.status_code}')
    if response.status_code == 200:
        print('✓ Reports page works')
    else:
        print('✗ Reports page failed')
    
    # Test manage users
    response = c.get('/manage-users/')
    print(f'Manage users page status: {response.status_code}')
    if response.status_code == 200:
        print('✓ Manage users page works')
    else:
        print('✗ Manage users page failed')
    
    # Test settings
    response = c.get('/settings/')
    print(f'Settings page status: {response.status_code}')
    if response.status_code == 200:
        print('✓ Settings page works')
    else:
        print('✗ Settings page failed')
    
    print('\nAll pages are accessible at:')
    print('- Dashboard: http://localhost:8000/dashboard/')
    print('- Reports: http://localhost:8000/reports/')
    print('- Manage Users: http://localhost:8000/manage-users/')
    print('- Settings: http://localhost:8000/settings/')
    print('\nLogin at: http://localhost:8000/web/login/')
    print('Email: testadmin@ripplefox.com')
    print('Password: Test123!*_')

if __name__ == '__main__':
    test_pages()
