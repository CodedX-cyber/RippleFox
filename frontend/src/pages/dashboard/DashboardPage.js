import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const DashboardPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Welcome to your dashboard
        </Typography>
        <Typography>
          This is a placeholder for your dashboard content.
        </Typography>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
