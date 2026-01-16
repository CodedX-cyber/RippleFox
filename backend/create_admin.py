import os
import sys

def main():
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    import django
    django.setup()
    
    from django.contrib.auth import get_user_model
    
    # Create superuser
    User = get_user_model()
    
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

if __name__ == "__main__":
    main()
