import os
import sys
import django

def setup_django():
    """Set up Django environment."""
    # Add the project root to Python path
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(project_root)
    
    # Set up Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()

def run_migrations():
    """Run database migrations."""
    from django.core.management import call_command
    print("Running migrations...")
    call_command('migrate')

def create_superuser():
    """Create a superuser."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    email = 'admin@example.com'
    password = 'admin123'
    
    if not User.objects.filter(email=email).exists():
        print(f"Creating superuser: {email}")
        User.objects.create_superuser(
            email=email,
            password=password,
            first_name='Admin',
            last_name='User'
        )
        print(f"Superuser created with email: {email} and password: {password}")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    try:
        print("=== Setting up database ===")
        setup_django()
        run_migrations()
        create_superuser()
        print("\n=== Setup complete! ===")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
