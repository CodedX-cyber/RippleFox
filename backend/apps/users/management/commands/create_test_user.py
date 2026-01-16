from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a test user with the specified email and password'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address for the test user')
        parser.add_argument('password', type=str, help='Password for the test user')

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists'))
            return
            
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name='Test',
            last_name='User',
            is_active=True
        )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created user {email}'))
