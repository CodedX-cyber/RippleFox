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
  Grid,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  FormControl,
  FormControlLabel,
  Checkbox,
  useTheme,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Login as LoginIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

const LoginPage = () => {
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
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    // Show welcome animation after component mounts
    const timer = setTimeout(() => setShowWelcome(true), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, location, isLoading]);

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setServerError('');
      
      try {
        const { rememberMe, email, password } = values;
        const result = await login(email, password);
        
        if (!result.success) {
          if (result.errors) {
            // Handle field-specific errors
            Object.entries(result.errors).forEach(([field, messages]) => {
              setFieldError(field.toLowerCase(), Array.isArray(messages) ? messages[0] : messages);
            });
          } else if (result.error) {
            setServerError(result.error);
          }
        } else if (result?.mfaRequired) {
          navigate('/mfa-verify', { 
            state: { 
              email: result.email,
              tempToken: result.tempToken,
              from: location.state?.from 
            } 
          });
          return;
        } else if (rememberMe) {
          // Handle remember me functionality if needed
          localStorage.setItem('rememberMe', 'true');
        }
      } catch (error) {
        console.error('Login error:', error);
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
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
          opacity: 0.8,
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
      <Fade in={showWelcome} timeout={500}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Sign in to your account
          </Typography>
          
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              backgroundColor: cardBackground,
              border: cardBorder,
              backdropFilter: 'blur(12px)',
              boxShadow: theme.palette.mode === 'dark' ? '0 15px 40px rgba(0,0,0,0.6)' : '0 15px 40px rgba(0,0,0,0.15)',
            }}
          >
            {serverError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {serverError}
              </Alert>
            )}
            
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText error>{formik.errors.password}</FormHelperText>
                )}
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      color="primary"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Remember me"
                />
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={formik.isSubmitting}
                startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{ mt: 2, mb: 2, py: 1.5, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', '&:hover': { background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)' } }}
              >
                {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{ mb: 1, '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.04)' } }}
                    onClick={() => window.location.href = '/api/v1/auth/google/'}
                  >
                    Continue with Google
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register" variant="body2">
                    Sign up
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

export default LoginPage;
