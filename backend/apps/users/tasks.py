from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_email_task(self, subject, message, recipient_list, html_message=None, **kwargs):
    """
    Send an email asynchronously using Celery.
    
    Args:
        subject (str): Email subject
        message (str): Plain text message
        recipient_list (list): List of recipient email addresses
        html_message (str, optional): HTML version of the message
        **kwargs: Additional arguments for send_mail
    """
    try:
        if not html_message and '<html' in message:
            html_message = message
            message = strip_tags(html_message)
            
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            html_message=html_message,
            **kwargs
        )
        logger.info(f"Email sent to {', '.join(recipient_list)}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        # Retry after 5 minutes if it fails
        raise self.retry(exc=e, countdown=300)  # 5 minutes

@shared_task
def send_verification_email_task(user_id, verification_url):
    """
    Send an email verification email.
    
    Args:
        user_id (int): User ID
        verification_url (str): Verification URL
    """
    from .models import User
    
    try:
        user = User.objects.get(id=user_id)
        subject = 'Verify Your Email Address'
        
        context = {
            'user': user,
            'verification_url': verification_url,
            'support_email': settings.DEFAULT_FROM_EMAIL,
        }
        
        html_message = render_to_string('emails/verification_email.html', context)
        message = strip_tags(html_message)
        
        send_email_task.delay(
            subject=subject,
            message=message,
            recipient_list=[user.email],
            html_message=html_message
        )
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} does not exist")
    except Exception as e:
        logger.error(f"Error sending verification email: {str(e)}")
        raise
