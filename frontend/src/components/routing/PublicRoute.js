import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If route is restricted and user is authenticated, redirect to the previous location or home
    if (isAuthenticated && restricted) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
