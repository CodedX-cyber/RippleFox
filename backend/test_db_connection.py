import os
import django
import sys

print("=== Testing Database Connection ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    django.setup()
    print("Django setup complete")
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

# Test database connection
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT sqlite_version()")
        version = cursor.fetchone()
        print(f"SQLite version: {version[0] if version else 'Unknown'}")
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("\n=== Database Tables ===")
        for table in tables:
            print(f"- {table[0]}")
            
except Exception as e:
    print(f"Database error: {e}")
    sys.exit(1)

print("\n=== Database connection successful ===")
