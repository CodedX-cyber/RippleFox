import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Typography, Switch, FormControlLabel, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Security, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const SecuritySettings = () => {
  const { user, refreshUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [mfaStatus, setMfaStatus] = useState({ enabled: user?.mfa_enabled || false, loading: false });
  const [mfaSetup, setMfaSetup] = useState({ open: false, code: '', verifying: false, error: '' });

  useEffect(() => {
    if (user?.mfa_enabled !== undefined) {
      setMfaStatus(prev => ({ ...prev, enabled: user.mfa_enabled }));
    }
  }, [user]);

  const toggleMFA = async (enabled) => {
    try {
      setMfaStatus(prev => ({ ...prev, loading: true }));
      if (enabled) {
        setMfaSetup({ open: true, code: '', verifying: false, error: '' });
      } else {
        await api.post('/api/users/mfa/disable/');
        await refreshUser();
        enqueueSnackbar('MFA disabled', { variant: 'success' });
      }
    } catch (error) {
      console.error('MFA toggle error:', error);
      enqueueSnackbar(`Failed to ${enabled ? 'enable' : 'disable'} MFA`, { variant: 'error' });
    } finally {
      setMfaStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const verifyMFA = async () => {
    if (!mfaSetup.code || mfaSetup.code.length !== 6) {
      setMfaSetup(prev => ({ ...prev, error: 'Enter a 6-digit code' }));
      return;
    }

    try {
      setMfaSetup(prev => ({ ...prev, verifying: true, error: '' }));
      await api.post('/api/users/mfa/verify/', { token: mfaSetup.code });
      await refreshUser();
      enqueueSnackbar('MFA enabled successfully!', { variant: 'success' });
      setMfaSetup(prev => ({ ...prev, open: false }));
    } catch (error) {
      setMfaSetup(prev => ({
        ...prev,
        error: 'Invalid code. Please try again.',
        verifying: false,
      }));
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <Security sx={{ verticalAlign: 'middle', mr: 1 }} />
        Security Settings
      </Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} p={3} bgcolor="background.paper" borderRadius={1}>
        <Box>
          <Typography variant="subtitle1">Two-Factor Authentication</Typography>
          <Typography variant="body2" color="textSecondary">
            {mfaStatus.enabled ? 'Enabled' : 'Add an extra layer of security'}
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={mfaStatus.enabled}
              onChange={(e) => toggleMFA(e.target.checked)}
              disabled={mfaStatus.loading}
            />
          }
          label={mfaStatus.enabled ? 'Enabled' : 'Disabled'}
        />
      </Box>

      <Dialog open={mfaSetup.open} onClose={() => setMfaSetup(prev => ({ ...prev, open: false }))}>
        <DialogTitle>Verify MFA Code</DialogTitle>
        <DialogContent>
          <Box my={2}>
            <Typography variant="body1" gutterBottom>
              Enter the 6-digit code from your authenticator app:
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <TextField
                label="Verification Code"
                value={mfaSetup.code}
                onChange={(e) => 
                  setMfaSetup(prev => ({
                    ...prev,
                    code: e.target.value.replace(/\D/g, '').slice(0, 6),
                    error: ''
                  }))
                }
                error={!!mfaSetup.error}
                helperText={mfaSetup.error}
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMfaSetup(prev => ({ ...prev, open: false }))}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={verifyMFA}
            disabled={mfaSetup.verifying || mfaSetup.code.length !== 6}
            startIcon={mfaSetup.verifying ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {mfaSetup.verifying ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecuritySettings;
