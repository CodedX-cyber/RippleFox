import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MFAVerification from './components/auth/MFAVerification';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Public Pages
import FeaturesPage from './pages/public/FeaturesPage';
import ContactPage from './pages/public/ContactPage';
import AboutPage from './pages/public/AboutPage';

// Services
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              } />
              <Route path="/features" element={
                <PublicRoute>
                  <FeaturesPage />
                </PublicRoute>
              } />
              <Route path="/about" element={
                <PublicRoute>
                  <AboutPage />
                </PublicRoute>
              } />
              <Route path="/contact" element={
                <PublicRoute>
                  <ContactPage />
                </PublicRoute>
              } />
              
              {/* Authentication Routes */}
              <Route path="/login" element={
                <PublicRoute restricted={true}>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute restricted={true}>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/mfa-verify" element={
                <PublicRoute restricted={true}>
                  <MFAVerification />
                </PublicRoute>
              } />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              
              {/* 404 - Not Found */}
              <Route path="*" element={
                <PublicRoute>
                  <NotFoundPage />
                </PublicRoute>
              } />
            </Routes>
          </Layout>
        </AuthProvider>
      </SnackbarProvider>
    </React.Fragment>
  );
}

export default App;
