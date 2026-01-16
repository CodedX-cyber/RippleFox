import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
  });

  // Form submission handler
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setStatus('loading');
      setError('');
      
      try {
        const { forgotPassword } = useAuth();
        const result = await forgotPassword(values.email);
        
        if (result.success) {
          setStatus('success');
          setEmail(values.email);
        } else {
          setStatus('error');
          setError(result.error || 'Failed to send password reset email. Please try again.');
        }
      } catch (err) {
        console.error('Password reset error:', err);
        setStatus('error');
        setError('An unexpected error occurred. Please try again.');
      }
    },
  });

  // Handle back to login
  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Render the appropriate content based on status
  const renderContent = () => {
    if (status === 'loading') {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" color="textSecondary">
            Sending password reset link...
          </Typography>
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
            Check Your Email
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We've sent a password reset link to <strong>{email}</strong>.
            Please check your inbox and follow the instructions to reset your password.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Didn't receive the email? Check your spam folder or try resending.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setStatus('idle');
              formik.resetForm();
            }}
            sx={{ mt: 2, borderRadius: 2, px: 4, py: 1 }}
          >
            Back to Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleBackToLogin}
            sx={{ mt: 2, ml: 2, borderRadius: 2, px: 4, py: 1 }}
          >
            Back to Login
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
            <EmailIcon sx={{ fontSize: 30, color: 'primary.contrastText' }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Forgot Password?
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: '80%', mx: 'auto' }}>
            Enter your email address and we'll send you a link to reset your password.
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
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
            disabled={!formik.isValid || formik.isSubmitting}
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
              'Send Reset Link'
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

export default ForgotPasswordPage;
