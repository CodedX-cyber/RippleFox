import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { 
  Box, Button, Typography, Paper, TextField, 
  CircularProgress, Link, Divider
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const MFAVerification = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usingBackupCode, setUsingBackupCode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { loginWithMFA } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from location state or redirect
  const email = location.state?.email;
  const tempToken = location.state?.tempToken;
  
  useEffect(() => {
    // Try to get email and tempToken from localStorage if not in location state
    const storedEmail = localStorage.getItem('mfaEmail');
    const storedToken = localStorage.getItem('mfaTempToken');
    
    if ((!email || !tempToken) && (!storedEmail || !storedToken)) {
      enqueueSnackbar('Invalid or expired verification request', { variant: 'error' });
      navigate('/login');
    }
  }, [email, tempToken, enqueueSnackbar, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!code || (usingBackupCode ? code.length < 8 : code.length !== 6)) {
      setError(usingBackupCode ? 'Enter a valid backup code' : 'Enter a 6-digit code');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Get email and token from state or localStorage
      const verifyEmail = email || localStorage.getItem('mfaEmail');
      const verifyToken = tempToken || localStorage.getItem('mfaTempToken');
      
      if (!verifyEmail || !verifyToken) {
        throw new Error('Session expired. Please login again.');
      }
      
      // Call the MFA verification endpoint
      const response = await api.post('/api/users/login/mfa/verify/', {
        email: verifyEmail,
        token: code,
        temp_token: verifyToken,
        is_backup: usingBackupCode
      });
      
      // Clear MFA-related items from localStorage
      localStorage.removeItem('mfaEmail');
      localStorage.removeItem('mfaTempToken');
      
      // Complete the login with the received tokens
      await loginWithMFA({
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user
      });
      
      // Redirect to the intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
      enqueueSnackbar('Login successful!', { variant: 'success' });
      
    } catch (err) {
      console.error('MFA verification error:', err);
      let errorMessage = 'Verification failed. Please try again.';
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = 'Invalid or expired verification code';
            break;
          case 401:
            errorMessage = 'Verification code is invalid';
            break;
          case 403:
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 404:
            errorMessage = 'Invalid verification request';
            break;
          case 429:
            errorMessage = 'Too many attempts. Please wait before trying again.';
            break;
          default:
            errorMessage = err.response.data?.detail || 'Verification failed';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      
      // Get email from state or localStorage
      const resendEmail = email || localStorage.getItem('mfaEmail');
      const resendToken = tempToken || localStorage.getItem('mfaTempToken');
      
      if (!resendEmail || !resendToken) {
        throw new Error('Session expired. Please login again.');
      }
      
      // Call the resend MFA code endpoint
      await api.post('/api/users/login/mfa/resend/', {
        email: resendEmail,
        temp_token: resendToken
      });
      
      enqueueSnackbar('A new verification code has been generated in your authenticator app', { 
        variant: 'success',
        autoHideDuration: 5000
      });
      
    } catch (err) {
      console.error('Error resending MFA code:', err);
      let errorMessage = 'Failed to resend verification code';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
      
      // If the error is related to an invalid session, redirect to login
      if (err.response?.status === 400 || err.response?.status === 404) {
        localStorage.removeItem('mfaEmail');
        localStorage.removeItem('mfaTempToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email || !tempToken) {
    return null; // Already handled in useEffect
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box textAlign="center" mb={3}>
          <LockIcon color="primary" sx={{ fontSize: 50 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Two-Factor Authentication
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {usingBackupCode
              ? 'Enter one of your backup codes'
              : 'Enter the 6-digit code from your authenticator app'}
          </Typography>
        </Box>

        <form onSubmit={handleVerify}>
          <TextField
            fullWidth
            label={usingBackupCode ? 'Backup Code' : 'Verification Code'}
            variant="outlined"
            value={code}
            onChange={(e) => {
              const value = usingBackupCode 
                ? e.target.value 
                : e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
              setError('');
            }}
            error={!!error}
            helperText={error}
            margin="normal"
            autoComplete="off"
            autoFocus
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={loading || !code}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>

          <Box textAlign="center" mt={2}>
            <Button
              onClick={() => setUsingBackupCode(!usingBackupCode)}
              color="primary"
              size="small"
            >
              {usingBackupCode 
                ? 'Use authenticator app instead' 
                : 'Use a backup code'}
            </Button>
            
            {!usingBackupCode && (
              <Button
                onClick={handleResendCode}
                color="primary"
                size="small"
                sx={{ display: 'block', width: '100%', mt: 1 }}
                disabled={loading}
              >
                Didn't receive a code?
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default MFAVerification;
