"""
Tests for the users API endpoints.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models_settings import UserSettings

User = get_user_model()

class UsersAPITestCase(TestCase):
    """Test cases for users API endpoints."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            password='testpass123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        self.regular_user = User.objects.create_user(
            email='user@example.com',
            password='testpass123',
            first_name='Regular',
            last_name='User'
        )

    def test_user_list_admin_only(self):
        """Test that only admin users can list all users."""
        # Test with unauthenticated user
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test with regular user
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Test with admin user
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_reports_endpoint(self):
        """Test the reports endpoint."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/reports/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('total_users', response.data['data'])

    def test_settings_endpoint(self):
        """Test the settings endpoint."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/api/settings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('theme', response.data)
        self.assertIn('language', response.data)

    def test_update_settings(self):
        """Test updating user settings."""
        self.client.force_authenticate(user=self.regular_user)
        data = {
            'theme': 'dark',
            'language': 'es',
            'email_notifications': False
        }
        response = self.client.post('/api/settings/update_settings/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify settings were updated
        user_settings = UserSettings.objects.get(user=self.regular_user)
        self.assertEqual(user_settings.theme, 'dark')
        self.assertEqual(user_settings.language, 'es')
        self.assertFalse(user_settings.email_notifications)

    def test_system_settings_admin_only(self):
        """Test that system settings are only accessible to admin users."""
        # Test with regular user
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/api/settings/system_settings/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Test with admin user
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/settings/system_settings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('system_name', response.data)
