import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { 
  Box, Button, Typography, Paper, TextField, 
  Grid, Divider, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { CheckCircle, ContentCopy, Refresh } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const MFASetup = () => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [mfaData, setMfaData] = useState({ qrCode: '', secret: '', backupCodes: [] });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const setupMFA = async () => {
      try {
        const { data } = await api.get('/api/users/mfa/setup/');
        setMfaData({
          qrCode: `data:image/png;base64,${data.qr_code}`,
          secret: data.mfa_secret,
          backupCodes: data.backup_codes || [],
        });
      } catch (err) {
        console.error('MFA setup error:', err);
        enqueueSnackbar('Failed to set up MFA', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    setupMFA();
  }, [enqueueSnackbar]);

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      setError('Enter a 6-digit code');
      return;
    }

    try {
      setVerifying(true);
      await api.post('/api/users/mfa/verify/', { token });
      await refreshUser();
      enqueueSnackbar('MFA enabled successfully!', { variant: 'success' });
      navigate('/profile/security');
    } catch (err) {
      setError('Invalid code. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied!', { variant: 'success' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" my={4}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Set Up 2FA</Typography>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>1. Scan QR Code</Typography>
          <Box textAlign="center" my={3}>
            <img 
              src={mfaData.qrCode} 
              alt="MFA QR Code" 
              style={{ width: 200, height: 200 }} 
            />
          </Box>
          
          <Typography variant="h6" gutterBottom>2. Enter Secret Key</Typography>
          <Box display="flex" alignItems="center" mb={3}>
            <TextField
              fullWidth
              value={mfaData.secret}
              InputProps={{ readOnly: true }}
            />
            <Tooltip title="Copy">
              <IconButton onClick={() => handleCopy(mfaData.secret)}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="h6" gutterBottom>3. Verify Code</Typography>
          <Box display="flex" alignItems="center" mb={3}>
            <TextField
              label="6-digit code"
              value={token}
              onChange={(e) => {
                setToken(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              error={!!error}
              helperText={error}
              sx={{ width: 200, mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={verifying || token.length !== 6}
              startIcon={verifying ? <CircularProgress size={20} /> : <CheckCircle />}
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MFASetup;
