"""
Management command to set up user roles and permissions.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import transaction

from apps.users.permissions import (
    ROLE_CEO, ROLE_CTO, ROLE_CFO, ROLE_HR, 
    ROLE_IT_ADMIN, ROLE_IT_SUPPORT, ROLE_MANAGER, 
    ROLE_STAFF, ROLE_ADMIN_STAFF,
    create_groups
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Sets up default user roles and permissions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-email',
            type=str,
            help='Email of the admin user to assign CEO role',
            default='admin@ripplefox.co'
        )

    @transaction.atomic
    def handle(self, *args, **options):
        admin_email = options['admin_email']
        
        self.stdout.write('Creating role groups and permissions...')
        groups = create_groups()
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(groups)} role groups'))
        
        # Assign CEO role to admin user
        try:
            admin_user = User.objects.get(email=admin_email)
            ceo_group = Group.objects.get(name=ROLE_CEO.upper())
            admin_user.groups.add(ceo_group)
            self.stdout.write(self.style.SUCCESS(f'Assigned {ROLE_CEO.upper()} role to {admin_email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING(f'Admin user with email {admin_email} not found. No role assigned.'))
        except Group.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'CEO group not found. Something went wrong with group creation.'))
        
        self.stdout.write(self.style.SUCCESS('Role setup completed successfully!'))
