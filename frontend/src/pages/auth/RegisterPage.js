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
  useTheme,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';

const RegisterPage = () => {
  const theme = useTheme();
  const heroBackground =
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(7,12,22,1) 100%)'
      : '#ffffff';
  const cardBackground =
    theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.7)' : 'rgba(255, 255, 255, 0.65)';
  const cardBorder = theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.7)';
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
  const { register, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    // Show form with animation after component mounts
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, location]);

  // Form validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(30, 'First name must be less than 30 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .max(30, 'Last name must be less than 30 characters')
      .required('Last name is required'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
      .required('Required'),
  });

  // Form submission handler
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      marketingEmails: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setError('');
      setLoading(true);
      
      try {
        const { firstName, lastName, email, password, marketingEmails } = values;
        const result = await register({ 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          password,
          marketing_consent: marketingEmails,
        });
        
        if (!result.success) {
          setError(result.error || 'Registration failed. Please try again.');
          if (result.field) {
            setFieldError(result.field, result.message);
          }
        } else {
          // Redirect to email verification page
          navigate('/verify-email', { 
            state: { email },
            replace: true 
          });
        }
      } catch (err) {
        console.error('Registration error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Handle social login
  const handleSocialLogin = (provider) => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/auth/o/${provider}/?redirect_uri=${window.location.origin}/oauth/redirect/`;
  };

  // Toggle password visibility
  const handleClickShowPassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        mt: 4,
        mb: 8,
        background: heroBackground,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
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
            Create an Account
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4, maxWidth: '80%' }}>
            Join Ripple Fox and unlock access to all our services and features.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box 
            component="form" 
            onSubmit={formik.handleSubmit} 
            sx={{ mt: 1, width: '100%' }}
            noValidate
          >
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
                    sx={{ backgroundColor: inputBackground, color: theme.palette.text.primary }}
                  />
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
                    sx={{ backgroundColor: inputBackground, color: theme.palette.text.primary }}
                  />
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
                sx={{ backgroundColor: inputBackground, color: theme.palette.text.primary }}
              />
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
                      onClick={() => handleClickShowPassword('password')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                sx={{ backgroundColor: inputBackground, color: theme.palette.text.primary }}
              />
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
                      onClick={() => handleClickShowPassword('confirmPassword')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
                sx={{ backgroundColor: inputBackground, color: theme.palette.text.primary }}
              />
            </FormControl>
            
            <FormControlLabel
              control={
                <Checkbox 
                  name="termsAccepted" 
                  color="primary" 
                  checked={formik.values.termsAccepted}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the <Link href="/terms" target="_blank" rel="noopener">Terms of Service</Link> and{' '}
                  <Link href="/privacy" target="_blank" rel="noopener">Privacy Policy</Link>
                </Typography>
              }
              sx={{ mt: 2, display: 'flex', alignItems: 'flex-start' }}
            />
            {formik.touched.termsAccepted && formik.errors.termsAccepted && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: -1, mb: 1 }}>
                {formik.errors.termsAccepted}
              </Typography>
            )}
            
            <FormControlLabel
              control={
                <Checkbox 
                  name="marketingEmails" 
                  color="primary" 
                  checked={formik.values.marketingEmails}
                  onChange={formik.handleChange}
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  I want to receive marketing promotions and updates via email
                </Typography>
              }
              sx={{ mt: 1, display: 'flex', alignItems: 'flex-start' }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !formik.isValid || formik.isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 'none',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                  boxShadow: '0 4px 12px rgba(74, 108, 247, 0.3)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Account'
              )}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OR SIGN UP WITH
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <IconButton
                onClick={() => handleSocialLogin('google')}
                sx={{
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                  },
                }}
              >
                <GoogleIcon sx={{ color: '#DB4437' }} />
              </IconButton>
              
              <IconButton
                onClick={() => handleSocialLogin('github')}
                sx={{
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>
              
              <IconButton
                onClick={() => handleSocialLogin('twitter')}
                sx={{
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: 'rgba(29, 161, 242, 0.04)',
                  },
                }}
              >
                <TwitterIcon sx={{ color: '#1DA1F2' }} />
              </IconButton>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
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
