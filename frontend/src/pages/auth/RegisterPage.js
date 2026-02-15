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
const RIPPLE_MID = 'rgb(0, 130, 190)';

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
    ? 'linear-gradient(to bottom, #0f172a 0%, #02040a 100%)'
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
      {/* Stronger top → bottom ripple animation */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Core glow – stronger */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(RIPPLE_BRIGHT, 0.9)} 12%, transparent 70%)`,
            boxShadow: `
              0 0 160px 90px ${alpha(RIPPLE_BRIGHT, 0.75)},
              0 0 280px 160px ${alpha(RIPPLE_BRIGHT, 0.55)},
              0 0 480px 240px ${alpha(RIPPLE_BRIGHT, 0.35)}
            `,
            animation: 'corePulseStrong 6.5s infinite ease-in-out',
          }}
        />

        {/* Main ripple ring – stronger & faster */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.08)',
            width: '1100px',
            height: '1100px',
            borderRadius: '50%',
            border: `5px solid ${alpha(RIPPLE_BRIGHT, 0.75)}`,
            opacity: 0,
            animation: 'mainRippleStrong 9s infinite ease-out',
          }}
        />

        {/* Additional rings – more visible */}
        {[1, 2, 3].map((delay) => (
          <Box
            key={delay}
            sx={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(0.08)',
              width: `${1100 + delay * 320}px`,
              height: `${1100 + delay * 320}px`,
              borderRadius: '50%',
              border: `4px solid ${alpha(RIPPLE_BRIGHT, 0.6 - delay * 0.18)}`,
              opacity: 0,
              animation: `secondaryRippleStrong ${10 + delay * 2.2}s infinite ease-out`,
              animationDelay: `${delay * 1.6}s`,
            }}
          />
        ))}

        {/* Strong downward beam */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '100%',
            background: `linear-gradient(to bottom, transparent 8%, ${alpha(RIPPLE_BRIGHT, 0.55)} 40%, transparent 100%)`,
            opacity: 0.92,
            animation: 'beamPulseStrong 8s infinite ease-in-out',
          }}
        />

        {/* Darker vignette edges */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 20%, transparent 20%, rgba(0,0,0,0.82) 100%)',
            opacity: isDark ? 0.78 : 0.45,
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