"""
Management command to verify environment configuration.
"""
from django.core.management.base import BaseCommand
from core.env_utils import get_env_variable, get_boolean_env, get_int_env, get_list_env

class Command(BaseCommand):
    help = 'Verify that all required environment variables are properly configured'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Checking environment configuration...\n'))
        
        # Test required variables
        self.check_required('SECRET_KEY')
        self.check_required('JWT_SECRET_KEY')
        
        # Test database configuration
        self.check_database_config()
        
        # Test optional variables with defaults
        self.check_optional('DEBUG', 'bool', get_boolean_env('DEBUG', False))
        self.check_optional('EMAIL_PORT', 'int', get_int_env('EMAIL_PORT', 587))
        self.check_optional('ALLOWED_HOSTS', 'list', get_list_env('ALLOWED_HOSTS', ['localhost', '127.0.0.1']))
        
        self.stdout.write(self.style.SUCCESS('\nEnvironment configuration check completed!'))
    
    def check_required(self, var_name):
        """Check if a required environment variable is set."""
        try:
            value = get_env_variable(var_name)
            self.stdout.write(
                self.style.SUCCESS(f'✓ {var_name}: ' + ('*' * 8 + value[-4:] if value else 'Not set'))
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ {var_name}: {str(e)}'))
    
    def check_optional(self, var_name, var_type, value):
        """Check an optional environment variable with default value."""
        self.stdout.write(
            self.style.SUCCESS(f'✓ {var_name} ({var_type}): {value}')
        )
    
    def check_database_config(self):
        """Check database configuration."""
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                self.stdout.write(self.style.SUCCESS('✓ Database: Connection successful'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Database: Connection failed - {str(e)}'))
