import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress,
  Fade,
  Divider,
  Alert,
  Link,
} from '@mui/material';
import { 
  MarkEmailRead as EmailVerifiedIcon, 
  Refresh as ResendIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const VerifyEmailPage = () => {
  const { uidb64, token } = useParams();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [loading, setLoading] = useState(!!uidb64 && !!token);
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'resent'
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  // Handle email verification on component mount if token and uidb64 are present
  useEffect(() => {
    const verifyToken = async () => {
      if (uidb64 && token) {
        try {
          const result = await verifyEmail(uidb64, token);
          if (result.success) {
            setStatus('success');
            // Auto redirect to login after 5 seconds
            const timer = setTimeout(() => {
              navigate('/login', { 
                state: { 
                  message: 'Email verified successfully! Please log in.',
                  severity: 'success'
                } 
              });
            }, 5000);
            return () => clearTimeout(timer);
          } else {
            setStatus('error');
            setError(result.error || 'Failed to verify email. The link may be invalid or expired.');
            setShowResend(true);
          }
        } catch (err) {
          console.error('Verification error:', err);
          setStatus('error');
          setError('An unexpected error occurred. Please try again.');
          setShowResend(true);
        } finally {
          setLoading(false);
        }
      } else {
        // If no token/uidb64 in URL, check for email in location state
        const emailFromState = new URLSearchParams(window.location.search).get('email');
        if (emailFromState) {
          setEmail(emailFromState);
          setShowResend(true);
        }
        setStatus('verification_needed');
        setLoading(false);
      }
    };

    verifyToken();
  }, [uidb64, token, verifyEmail, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (showResend && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showResend, countdown]);

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        setStatus('resent');
        setCountdown(30); // Reset countdown
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          if (status === 'resent') {
            setStatus('verification_needed');
          }
        }, 5000);
      } else {
        setError(result.error || 'Failed to resend verification email. Please try again.');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear any previous errors when user starts typing
    if (error) setError('');
  };

  // Handle form submission for manual email entry
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setShowResend(true);
    handleResendEmail();
  };

  // Render the appropriate content based on verification status
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" color="textSecondary">
            Verifying your email...
          </Typography>
        </Box>
      );
    }

    switch (status) {
      case 'success':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: 'success.light',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <EmailVerifiedIcon sx={{ fontSize: 40, color: 'success.contrastText' }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Email Verified!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Your email has been successfully verified. You can now log in to your account.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 3 }}>
              Redirecting to login page...
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mt: 2, borderRadius: 2, px: 4, py: 1 }}
            >
              Go to Login
            </Button>
          </Box>
        );

      case 'resent':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: 'success.light',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <EmailVerifiedIcon sx={{ fontSize: 40, color: 'success.contrastText' }} />
            </Box>
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Verification Email Sent!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              We've sent a new verification link to <strong>{email}</strong>.
              Please check your inbox and click the link to verify your email.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 3 }}>
              Didn't receive the email? Check your spam folder or try resending.
            </Typography>
          </Box>
        );

      case 'error':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <EmailVerifiedIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Verification Failed
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {error || 'The verification link is invalid or has expired.'}
            </Typography>
            {showResend && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResendEmail}
                disabled={loading || countdown > 0}
                startIcon={<ResendIcon />}
                sx={{ mt: 2, borderRadius: 2, px: 4, py: 1 }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
              </Button>
            )}
          </Box>
        );

      case 'verification_needed':
      default:
        return (
          <Box sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'primary.light',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <EmailVerifiedIcon sx={{ fontSize: 40, color: 'primary.contrastText' }} />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Verify Your Email
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                We've sent a verification link to your email address. Please check your inbox and click on the link to verify your account.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Didn't receive the email? Check your spam folder or request a new verification link below.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Enter your email to resend the verification link:
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {status === 'resent' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Verification email sent successfully!
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || (showResend && countdown > 0)}
                  startIcon={<ResendIcon />}
                  sx={{ flex: 1, borderRadius: 2, py: 1.5 }}
                >
                  {showResend && countdown > 0 
                    ? `Resend in ${countdown}s` 
                    : 'Resend Verification Email'}
                </Button>
              </Box>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  startIcon={<ArrowBackIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Fade in={true} timeout={800}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          {renderContent()}
          
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="textSecondary" align="center">
              Need help?{' '}
              <Link href="/contact" color="primary">
                Contact Support
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default VerifyEmailPage;
