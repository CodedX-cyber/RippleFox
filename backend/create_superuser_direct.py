import os
import django
import sys

def create_superuser():
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    
    # Create superuser
    try:
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser(
                email='admin@example.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            print("Superuser created successfully!")
            print("Email: admin@example.com")
            print("Password: admin123")
        else:
            print("Superuser already exists.")
    except Exception as e:
        print(f"Error creating superuser: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    create_superuser()
