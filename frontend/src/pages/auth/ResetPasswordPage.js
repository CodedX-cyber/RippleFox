import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Divider,
  Alert,
  CircularProgress,
  Fade,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';

const ResetPasswordPage = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'form', 'success', 'error'
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your new password'),
  });

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!uidb64 || !token) {
        setStatus('error');
        setError('Invalid password reset link');
        return;
      }

      try {
        // In a real app, you might want to verify the token with your backend
        // const { verifyPasswordResetToken } = useAuth();
        // const isValid = await verifyPasswordResetToken(uidb64, token);
        // if (!isValid) {
        //   throw new Error('Invalid or expired password reset link');
        // }
        setStatus('form');
      } catch (err) {
        console.error('Token verification error:', err);
        setStatus('error');
        setError('The password reset link is invalid or has expired. Please request a new one.');
      }
    };

    verifyToken();
  }, [uidb64, token]);

  // Form submission handler
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setStatus('loading');
      setError('');
      
      try {
        const { resetPassword } = useAuth();
        const result = await resetPassword(uidb64, token, values.newPassword);
        
        if (result.success) {
          setStatus('success');
          // Auto redirect to login after 5 seconds
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                message: 'Password reset successful! You can now log in with your new password.',
                severity: 'success'
              } 
            });
          }, 5000);
        } else {
          setStatus('error');
          setError(result.error || 'Failed to reset password. Please try again.');
        }
      } catch (err) {
        console.error('Password reset error:', err);
        setStatus('error');
        setError('An unexpected error occurred. Please try again.');
      }
    },
  });

  // Toggle password visibility
  const handleClickShowPassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleMouseDownPassword = (event) => event.preventDefault();

  // Render the appropriate content based on status
  const renderContent = () => {
    if (status === 'verifying') {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" color="textSecondary">
            Verifying your password reset link...
          </Typography>
        </Box>
      );
    }

    if (status === 'error') {
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
            <LockIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Invalid Link
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {error || 'The password reset link is invalid or has expired.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/forgot-password"
            sx={{ mt: 2, borderRadius: 2, px: 4, py: 1 }}
          >
            Request New Link
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/login"
            sx={{ mt: 2, ml: 2, borderRadius: 2, px: 4, py: 1 }}
          >
            Back to Login
          </Button>
        </Box>
      );
    }

    if (status === 'success') {
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
            <CheckCircleIcon sx={{ fontSize: 40, color: 'success.contrastText' }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Password Reset!
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Your password has been successfully reset. You can now log in with your new password.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
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
    }

    // Default form
    return (
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              backgroundColor: 'primary.light',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <LockIcon sx={{ fontSize: 30, color: 'primary.contrastText' }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Reset Password
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: '80%', mx: 'auto' }}>
            Please enter your new password below.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            autoComplete="new-password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword('password')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => handleClickShowPassword('confirmPassword')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting || status === 'loading'}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(74, 108, 247, 0.3)',
              },
            }}
          >
            {status === 'loading' ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Reset Password'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/login"
              startIcon={<ArrowBackIcon />}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Box>
    );
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

export default ResetPasswordPage;
