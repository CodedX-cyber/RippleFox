"""Add MFA fields to User model."""
from django.db import migrations, models
import pyotp


def generate_mfa_secret(apps, schema_editor):
    User = apps.get_model('users', 'User')
    for user in User.objects.all():
        user.mfa_secret = pyotp.random_base32()
        user.save(update_fields=['mfa_secret'])


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='mfa_enabled',
            field=models.BooleanField(
                default=False,
                help_text='Whether multi-factor authentication is enabled for this user.'
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='mfa_secret',
            field=models.CharField(
                max_length=32,
                null=True,
                blank=True,
                help_text='Secret key for generating MFA tokens.'
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='backup_codes',
            field=models.JSONField(
                default=list,
                blank=True,
                help_text='Emergency backup codes for MFA.'
            ),
        ),
        migrations.RunPython(
            generate_mfa_secret,
            reverse_code=migrations.RunPython.noop
        ),
    ]
