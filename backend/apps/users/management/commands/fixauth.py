from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import connection

class Command(BaseCommand):
    help = 'Fix authentication issues for a user'

    def handle(self, *args, **options):
        User = get_user_model()
        email = 'kingalale@gmail.com'
        password = ''

        try:
            # Check database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                self.stdout.write(self.style.SUCCESS('Database connection successful'))

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'is_active': True,
                    'is_staff': False,
                    'is_superuser': False
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created user: {email}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Found existing user: {email}'))

            # Reset password
            user.set_password(password)
            user.is_active = True
            user.save()
            self.stdout.write(self.style.SUCCESS('Password has been reset'))

            # Verify user in database
            user = User.objects.get(email=email)
            self.stdout.write(f"User details:")
            self.stdout.write(f"- ID: {user.id}")
            self.stdout.write(f"- Email: {user.email}")
            self.stdout.write(f"- Active: {user.is_active}")
            self.stdout.write(f"- Staff: {user.is_staff}")
            self.stdout.write(f"- Superuser: {user.is_superuser}")
            self.stdout.write(f"- Last login: {user.last_login}")

            # Test authentication
            from django.contrib.auth import authenticate
            auth_user = authenticate(email=email, password=password)
            if auth_user:
                self.stdout.write(self.style.SUCCESS('Authentication SUCCESSFUL!'))
            else:
                self.stdout.write(self.style.ERROR('Authentication FAILED!'))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error: {str(e)}'))
            import traceback
            self.stderr.write(traceback.format_exc())
