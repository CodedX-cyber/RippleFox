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

import { alpha } from '@mui/material/styles';

// Ripple brand colors
const RIPPLE_BRIGHT = 'rgb(0, 165, 223)';
const RIPPLE_MID   = 'rgb(0, 130, 190)';
const RIPPLE_DARK  = 'rgb(0, 100, 155)';

// Validation schema (unchanged)
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
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isDark = theme.palette.mode === 'dark';

  // Adaptive styles
  const heroBackground = isDark
    ? 'linear-gradient(135deg, rgba(15,23,42,0.99) 0%, rgba(7,12,22,1) 100%)'
    : '#f8fafc';

  const cardBackground = isDark ? 'rgba(15,23,42,0.94)' : 'rgba(255,255,255,0.96)';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(0,0,0,0.06)';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, location, isLoading]);

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

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

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
      {/* Realistic Ripple Water Effect – positioned exactly as in your image */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%', // ripple originates low and expands upward
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

        {/* Upward light beam / caustic glow – matches the vertical blue light in image */}
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

        {/* Very subtle overall vignette to darken edges */}
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

      {/* Form Content – completely unchanged from your original */}
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Fade in={showForm} timeout={800}>
          <Paper
            elevation={isDark ? 14 : 10}
            sx={{
              p: { xs: 3, sm: 5, md: 6 },
              width: '100%',
              maxWidth: 480,
              borderRadius: 4,
              backgroundColor: cardBackground,
              border: cardBorder,
              backdropFilter: 'blur(16px)',
              boxShadow: isDark
                ? '0 30px 80px rgba(0,0,0,0.8)'
                : '0 30px 80px rgba(0,165,223,0.25)',
            }}
          >
            {/* Avatar / Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, ${RIPPLE_BRIGHT}, ${RIPPLE_MID})`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                mx: 'auto',
                boxShadow: `0 12px 36px ${alpha(RIPPLE_BRIGHT, 0.5)}`,
              }}
            >
              <PersonIcon sx={{ fontSize: 44, color: '#ffffff' }} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 800,
                textAlign: 'center',
                background: `linear-gradient(90deg, ${RIPPLE_BRIGHT}, ${RIPPLE_MID})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create an Account
            </Typography>

            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4, px: 2 }}
            >
              Join Ripple Fox and unlock access to all our services and features.
            </Typography>

            {serverError && (
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {serverError}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ width: '100%' }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>First Name *</InputLabel>
                    <OutlinedInput
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      startAdornment={<InputAdornment position="start"><PersonIcon /></InputAdornment>}
                      label="First Name *"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <FormHelperText error>{formik.errors.firstName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Last Name *</InputLabel>
                    <OutlinedInput
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      startAdornment={<InputAdornment position="start"><PersonIcon /></InputAdornment>}
                      label="Last Name *"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <FormHelperText error>{formik.errors.lastName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Email Address *</InputLabel>
                    <OutlinedInput
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      startAdornment={<InputAdornment position="start"><EmailIcon /></InputAdornment>}
                      label="Email Address *"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <FormHelperText error>{formik.errors.email}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Password *</InputLabel>
                    <OutlinedInput
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      startAdornment={<InputAdornment position="start"><LockIcon /></InputAdornment>}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password *"
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <FormHelperText error>{formik.errors.password}</FormHelperText>
                    ) : (
                      <FormHelperText sx={{ color: 'text.secondary' }}>
                        At least 8 characters with uppercase, lowercase, number, and special character
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Confirm Password *</InputLabel>
                    <OutlinedInput
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                      startAdornment={<InputAdornment position="start"><LockIcon /></InputAdornment>}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password *"
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <FormHelperText error>{formik.errors.confirmPassword}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="terms"
                        checked={formik.values.terms}
                        onChange={formik.handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link href="/terms" target="_blank" underline="hover">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" target="_blank" underline="hover">
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                  {formik.touched.terms && formik.errors.terms && (
                    <FormHelperText error sx={{ ml: 0 }}>{formik.errors.terms}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label={
                      <Typography variant="body2">
                        I want to receive marketing promotions and updates via email
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={formik.isSubmitting || !formik.isValid}
                sx={{
                  mt: 3,
                  py: 1.6,
                  background: `linear-gradient(45deg, ${RIPPLE_BRIGHT} 30%, ${RIPPLE_MID} 90%)`,
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: `0 8px 24px ${alpha(RIPPLE_BRIGHT, 0.45)}`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${RIPPLE_MID} 30%, ${RIPPLE_BRIGHT} 90%)`,
                    boxShadow: `0 12px 32px ${alpha(RIPPLE_BRIGHT, 0.55)}`,
                  },
                }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Divider sx={{ my: 4, color: 'text.secondary' }}>OR SIGN UP WITH</Divider>

              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <IconButton
                    sx={{
                      bgcolor: '#DB4437',
                      color: '#fff',
                      '&:hover': { bgcolor: '#c1351f' },
                    }}
                    onClick={() => window.location.href = '/api/v1/auth/google/'}
                  >
                    <GoogleIcon />
                  </IconButton>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{ color: RIPPLE_BRIGHT, fontWeight: 600 }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default RegisterPage;