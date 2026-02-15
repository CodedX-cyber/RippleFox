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

import { alpha } from '@mui/material/styles';

// Ripple brand colors
const RIPPLE_BRIGHT = 'rgb(0, 165, 223)';

// Validation schema (unchanged)
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
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  const isDark = theme.palette.mode === 'dark';

  // Adaptive styles
  const heroBackground = isDark ? '#07121a' : '#f8fafc';

  const cardBackground = isDark ? 'rgba(15,23,42,0.94)' : 'rgba(255,255,255,0.96)';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(0,0,0,0.06)';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    const timer = setTimeout(() => setShowWelcome(true), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, location, isLoading]);

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
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        m: 0,
        p: 0,
        background: heroBackground,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Realistic Ripple Water Effect – same as Register page, low-centered at bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Main glowing ripple core (bright blue spot at bottom center) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(RIPPLE_BRIGHT, 0.65)} 10%, transparent 70%)`,
            boxShadow: `0 0 120px 60px ${alpha(RIPPLE_BRIGHT, 0.45)}, 0 0 200px 100px ${alpha(RIPPLE_BRIGHT, 0.25)}`,
            animation: 'corePulse 10s infinite ease-in-out',
            pointerEvents: 'none',
            '@keyframes corePulse': {
              '0%, 100%': { transform: 'translateX(-50%) scale(1)', opacity: 0.8 },
              '50%': { transform: 'translateX(-50%) scale(1.18)', opacity: 1 },
            },
          }}
        />

        {/* Primary ripple ring – large, slow expansion from bottom center */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '12%',
            left: '50%',
            transform: 'translate(-50%, 0) scale(0.15)',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            border: `3px solid ${alpha(RIPPLE_BRIGHT, 0.4)}`,
            opacity: 0,
            animation: 'mainRipple 16s infinite ease-out',
            pointerEvents: 'none',
            '@keyframes mainRipple': {
              '0%': {
                transform: 'translate(-50%, 0) scale(0.15)',
                opacity: 0,
              },
              '10%': { opacity: 0.7 },
              '50%': { opacity: 0.25 },
              '100%': {
                transform: 'translate(-50%, -70%) scale(3.8)',
                opacity: 0,
              },
            },
          }}
        />

        {/* Secondary / tertiary rings – fainter, delayed for depth */}
        {[1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              bottom: '12%',
              left: '50%',
              transform: 'translate(-50%, 0) scale(0.15)',
              width: `${800 + i * 200}px`,
              height: `${800 + i * 200}px`,
              borderRadius: '50%',
              border: `2px solid ${alpha(RIPPLE_BRIGHT, 0.25 - i * 0.1)}`,
              opacity: 0,
              animation: `secondaryRipple ${18 + i * 3}s infinite ease-out`,
              animationDelay: `${i * 3}s`,
              pointerEvents: 'none',
              '@keyframes secondaryRipple': {
                '0%': { transform: 'translate(-50%, 0) scale(0.15)', opacity: 0 },
                '15%': { opacity: 0.5 },
                '60%': { opacity: 0.1 },
                '100%': { transform: 'translate(-50%, -80%) scale(4.5)', opacity: 0 },
              },
            }}
          />
        ))}

        {/* Upward light beam / caustic glow */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '85%',
            background: `linear-gradient(to top, transparent 20%, ${alpha(RIPPLE_BRIGHT, 0.22)} 50%, transparent 100%)`,
            opacity: 0.75,
            animation: 'beamPulse 14s infinite ease-in-out',
            pointerEvents: 'none',
            '@keyframes beamPulse': {
              '0%, 100%': { opacity: 0.65 },
              '50%': { opacity: 1 },
            },
          }}
        />

        {/* Subtle vignette to darken edges */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 30%, transparent 30%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
            opacity: isDark ? 0.6 : 0.3,
          }}
        />
      </Box>

      {/* Form Content – completely unchanged */}
      <Container
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
        }}
      >
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
    </Box>
  );
};

export default LoginPage;