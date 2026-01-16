import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography component="h1" variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
