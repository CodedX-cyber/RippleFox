"""Token generation for email verification and password reset."""

from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six
from django.utils.crypto import constant_time_compare
from django.utils.http import base36_to_int, int_to_base36

class TokenGenerator(PasswordResetTokenGenerator):
    """Strategy object used to generate and check tokens for user-related actions.
    
    This class extends Django's PasswordResetTokenGenerator to provide token generation
    and validation for various user-related actions like email verification and
    password reset.
    """
    
    def _make_hash_value(self, user, timestamp):
        """Hash the user's primary key, some user state, and a timestamp.
        
        Args:
            user: The user instance for which the token is being generated.
            timestamp: The timestamp for the token generation.
            
        Returns:
            str: A string containing the hashed values.
        """
        # Ensure the user has a last_login field
        login_timestamp = ''
        if user.last_login is not None:
            login_timestamp = user.last_login.replace(microsecond=0, tzinfo=None)
            
        return (
            six.text_type(user.pk) + user.password +
            six.text_type(login_timestamp) + six.text_type(timestamp)
        )
    
    def check_token(self, user, token):
        """Check that the token is valid for the given user.
        
        Args:
            user: The user instance to validate the token against.
            token: The token to validate.
            
        Returns:
            bool: True if the token is valid, False otherwise.
        """
        if not (user and token):
            return False
            
        # Parse the token
        try:
            ts_b36, _ = token.split("-")
        except ValueError:
            return False
            
        try:
            ts = base36_to_int(ts_b36)
        except ValueError:
            return False
            
        # Check that the timestamp/uid has not been tampered with
        if not constant_time_compare(
            self._make_token_with_timestamp(user, ts),
            token
        ):
            return False
            
        # Check the timestamp is within the timeout period
        if (self._num_seconds(self._now()) - ts) > self.timeout:
            return False
            
        return True

class AccountActivationTokenGenerator(TokenGenerator):
    """Token generator for email verification.
    
    This generator creates tokens that are valid for 7 days.
    """
    
    timeout = 60 * 60 * 24 * 7  # 7 days

class PasswordResetTokenGenerator(TokenGenerator):
    """Token generator for password reset.
    
    This generator creates tokens that are valid for 24 hours.
    """
    
    timeout = 60 * 60 * 24  # 24 hours

# Create token generator instances
account_activation_token = AccountActivationTokenGenerator()
password_reset_token = PasswordResetTokenGenerator()
