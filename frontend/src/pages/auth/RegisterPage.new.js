import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Fade,
  FormControlLabel,
  Checkbox,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  useTheme,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';

// Validation schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .max(30, 'First name must be less than 30 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .max(30, 'Last name must be less than 30 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

const RegisterPage = () => {
  const theme = useTheme();
  const heroBackground =
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(7,12,22,1) 100%)'
      : '#ffffff';
  const cardBackground =
    theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.7)' : 'rgba(255, 255, 255, 0.65)';
  const cardBorder =
    theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.7)';
  const gradientOverlay =
    theme.palette.mode === 'dark'
      ? 'linear-gradient(120deg, rgba(59,130,246,0.45), rgba(14,165,233,0.3), rgba(59,130,246,0.15))'
      : 'linear-gradient(120deg, rgba(59,130,246,0.30), rgba(14,165,233,0.20), rgba(59,130,246,0.10))';
  const accentStripe =
    theme.palette.mode === 'dark'
      ? 'linear-gradient(140deg, rgba(14,165,233,0.2), rgba(59,130,246,0.25), rgba(14,165,233,0.1))'
      : 'linear-gradient(140deg, rgba(59,130,246,0.25), rgba(14,165,233,0.18), rgba(59,130,246,0.08))';
  const inputBackground = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    // Show form with animation after component mounts
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, location, isLoading]);

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setServerError('');
      
      try {
        const { confirmPassword, terms, ...registrationData } = values;
        const result = await registerUser(registrationData);
        
        if (!result.success) {
          if (result.errors) {
            // Handle field-specific errors
            Object.entries(result.errors).forEach(([field, messages]) => {
              setFieldError(field.toLowerCase(), Array.isArray(messages) ? messages[0] : messages);
            });
          } else if (result.error) {
            setServerError(result.error);
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        background: heroBackground,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 0,
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes stripeFloat': {
          '0%': { transform: 'rotate(-7deg) translateX(-10%)' },
          '50%': { transform: 'rotate(-7deg) translateX(0%)' },
          '100%': { transform: 'rotate(-7deg) translateX(-10%)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: gradientOverlay,
          opacity: 0.75,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 14s ease infinite',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          left: '-5%',
          width: '110%',
          height: '70%',
          background: accentStripe,
          borderRadius: '220px',
          filter: 'blur(0.4px)',
          opacity: theme.palette.mode === 'dark' ? 0.4 : 0.6,
          animation: 'stripeFloat 20s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <Fade in={showForm} timeout={800}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              backgroundColor: cardBackground,
              border: cardBorder,
              backdropFilter: 'blur(12px)',
              boxShadow: theme.palette.mode === 'dark' ? '0 15px 40px rgba(0,0,0,0.6)' : '0 15px 40px rgba(0,0,0,0.15)',
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                backgroundColor: 'primary.light',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <PersonIcon color="primary" sx={{ fontSize: 30 }} />
            </Box>
            
            <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
              Create your account
            </Typography>
            
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4, maxWidth: '80%' }}>
              Join Ripple Fox and unlock access to our services.
            </Typography>
            
            {serverError && (
              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                {serverError}
              </Alert>
            )}
            
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel htmlFor="firstName">First Name</InputLabel>
                    <OutlinedInput
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      }
                      label="First Name"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <FormHelperText error>{formik.errors.firstName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel htmlFor="lastName">Last Name</InputLabel>
                    <OutlinedInput
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      }
                      label="Last Name"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <FormHelperText error>{formik.errors.lastName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  }
                  label="Email Address"
                />
                {formik.touched.email && formik.errors.email && (
                  <FormHelperText error>{formik.errors.email}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <FormHelperText error>{formik.errors.password}</FormHelperText>
                ) : (
                  <FormHelperText>
                    At least 8 characters with uppercase, lowercase, number, and special character
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <FormHelperText error>{formik.errors.confirmPassword}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                required
                error={formik.touched.terms && Boolean(formik.errors.terms)}
                sx={{ mt: 2, width: '100%' }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="terms"
                      color="primary"
                      checked={formik.values.terms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="/terms" target="_blank" rel="noopener noreferrer">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {formik.touched.terms && formik.errors.terms && (
                  <FormHelperText error>{formik.errors.terms}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={formik.isSubmitting}
                sx={{ mt: 2, mb: 3, py: 1.5, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', '&:hover': { background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)' } }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{ mb: 1 }}
                    onClick={() => window.location.href = '/api/v1/auth/google/'}
                  >
                    Continue with Google
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default RegisterPage;
