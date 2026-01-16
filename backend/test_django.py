import os
import sys
from pathlib import Path
import django
from django.conf import settings

# Set up Django environment
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    # Initialize Django
    django.setup()
    
    # Test database connection
    from django.db import connection
    connection.ensure_connection()
    print("✅ Successfully connected to the database!")
    
    # Test environment variables
    print("\nEnvironment variables:")
    print(f"DEBUG: {settings.DEBUG}")
    print(f"SECRET_KEY: {'*' * len(settings.SECRET_KEY) if settings.SECRET_KEY else 'NOT SET'}")
    print(f"ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    print("\nMake sure you have run the following commands:")
    print("1. python manage.py migrate")
    print("2. python manage.py createsuperuser")
    print("\nIf you're still having issues, please share the full error message.")
