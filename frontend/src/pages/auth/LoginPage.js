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
    <Container component="main" maxWidth="xs">
      <Fade in={showWelcome} timeout={500}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Sign in to your account
          </Typography>
          
          <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
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
                sx={{ mt: 2, mb: 2, py: 1.5 }}
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
                    sx={{ mb: 1 }}
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
