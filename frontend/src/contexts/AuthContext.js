import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

// WebSocket configuration
const WS_CONFIG = {
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  PING_INTERVAL: 30000,
};

// Create the auth context
export const AuthContext = createContext();

// Auth provider component
// Custom hook to use the auth context with error checking
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ws, setWs] = useState(null);
  const [wsReady, setWsReady] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Set auth token in api headers and local storage
  const setAuthToken = useCallback((token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('accessToken', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('accessToken');
    }
  }, []);
  
  // Initialize WebSocket connection
  const initWebSocket = useCallback(() => {
    if (!token || ws) return;

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/ws/auth/`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket Connected');
      setWsReady(true);
      setReconnectAttempts(0);
      // Authenticate with the server
      socket.send(JSON.stringify({ type: 'auth', token }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket Message:', data);
      
      if (data.type === 'auth_success') {
        console.log('WebSocket authenticated successfully');
      } else if (data.type === 'session_update') {
        // Handle session updates from server
        setUser(prev => ({ ...prev, ...data.user }));
      }
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
      setWsReady(false);
      
      // Attempt to reconnect
      if (reconnectAttempts < WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
        console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${WS_CONFIG.MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          initWebSocket();
        }, WS_CONFIG.RECONNECT_INTERVAL);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    setWs(socket);

    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
        setWs(null);
      }
    };
  }, [token, reconnectAttempts, ws]);

  // Load user on initial render and token change
  useEffect(() => {
    const loadUser = async () => {
      // Don't try to load user if we don't have a token
      if (!token) {
        setIsLoading(false);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      try {
        const res = await api.get('/auth/me/');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        // If there's an error (including 401), clear any existing auth data
        if (err.response?.status === 401) {
          setToken(null);
          setAuthToken(null);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('accessToken');
        } else {
          console.error('Error loading user:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    
    return () => {
      // Cleanup WebSocket on unmount
      if (ws) {
        ws.close();
      }
    };
  }, [token, setAuthToken, initWebSocket, ws]);

  // Register user
  const register = async (formData) => {
    try {
      console.log('Sending registration request with data:', formData);
      const response = await api.post('/auth/register/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Auto-login after registration
      try {
        const loginResponse = await api.post('/auth/login/', {
          email: formData.email,
          password: formData.password,
        });
        
        setToken(loginResponse.data.access);
        setAuthToken(loginResponse.data.access);
        setUser(loginResponse.data.user);
        setIsAuthenticated(true);
        
        // Initialize WebSocket after successful registration
        initWebSocket();
        
        // Redirect to the intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        
        toast.success('Registration successful!');
        return { success: true };
      } catch (loginErr) {
        console.error('Auto-login after registration failed:', loginErr);
        // Still return success since registration was successful
        return { success: true };
      }
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        config: err.config,
      });
      
      let errorMessage = 'Registration failed';
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.data) {
          errorMessage = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
            .join('\n');
        } else {
          errorMessage = `Server responded with status ${err.response.status}`;
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        errors: err.response?.data || {}
      };
    }
  };

  // Login with MFA verification
  const loginWithMFA = async (tokens) => {
    try {
      const { access, refresh, user: userData } = tokens;
      
      // Set tokens and user data
      setToken(access);
      setUser(userData);
      setAuthToken(access);
      setIsAuthenticated(true);
      
      // Store tokens in local storage
      localStorage.setItem('accessToken', access);
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
      
      // Initialize WebSocket connection
      initWebSocket();
      
      // Redirect to dashboard or intended page
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('MFA verification error:', error);
      const errorMessage = error.response?.data?.detail || 'MFA verification failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login user with MFA support
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', { email, password: '***' });
      const response = await api.post('/auth/login/', { email, password });
      
      // If we get here, login was successful
      const { access, refresh, user } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', access);
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
      
      // Update auth state
      setToken(access);
      setUser(user);
      setAuthToken(access);
      setIsAuthenticated(true);
      
      // Initialize WebSocket connection
      initWebSocket();
      
      // Set default auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        // Handle different HTTP status codes
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data.detail || 'Invalid email or password';
            // If there are field-specific errors, include them
            if (error.response.data.errors) {
              return { 
                success: false, 
                errors: error.response.data.errors,
                error: errorMessage
              };
            }
            break;
          case 401:
            errorMessage = 'Invalid credentials';
            break;
          case 403:
            errorMessage = 'Account is not active';
            break;
          case 404:
            errorMessage = 'User not found';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data.detail || 'An error occurred during login';
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = useCallback(async () => {
    try {
      // Close WebSocket connection
      if (ws) {
        ws.close();
        setWs(null);
      }
      
      // Call logout API if needed
      try {
        await api.post('/auth/logout/');
      } catch (err) {
        console.warn('Logout API call failed, but continuing with local logout', err);
      }
      
      // Clear auth state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
      
      // Clear any stored data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Navigate to login page
      navigate('/login', { replace: true });
      
      toast.success('You have been logged out');
    } catch (err) {
      console.error('Logout error', err);
      toast.error('Error logging out');
      throw err;
    }
  }, [navigate, ws, setAuthToken]);

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const response = await api.put('/auth/profile/', formData);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      
      // Notify WebSocket of profile update
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'profile_update',
          user: updatedUser
        }));
      }
      
      toast.success('Profile updated successfully');
      return { 
        success: true,
        user: updatedUser
      };
    } catch (err) {
      console.error('Update profile error', err);
      const errorMessage = err.response?.data?.detail || 'Failed to update profile';
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        errors: err.response?.data || {}
      };
    }
  };

  // Change password
  const changePassword = async (formData) => {
    try {
      await api.post('/auth/password/change/', formData);
      
      // Notify user to log in again with new password
      toast.success('Password changed successfully. Please log in again.');
      
      // Logout the user after password change
      await logout();
      
      return { success: true };
    } catch (err) {
      console.error('Change password error', err);
      const errorMessage = err.response?.data?.detail || 'Failed to change password';
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        errors: err.response?.data || {}
      };
    }
  };
  
  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      await api.post('/auth/password/reset/', { email });
      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } catch (err) {
      console.error('Password reset request error', err);
      // Don't reveal if email exists for security
      toast.success('If an account exists with this email, you will receive password reset instructions');
      return { success: true };
    }
  };
  
  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      await api.post('/auth/password/reset/confirm/', {
        token,
        new_password: newPassword
      });
      
      toast.success('Password reset successfully. You can now log in with your new password.');
      return { success: true };
    } catch (err) {
      console.error('Password reset error', err);
      const errorMessage = err.response?.data?.detail || 'Failed to reset password';
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };
  
  // Check if user has specific permission/role
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };
  
  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };
  
  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    if (!user || !user.permissions) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  // Verify email
  const verifyEmail = async (uidb64, token) => {
    try {
      await api.post(`/auth/verify-email/${uidb64}/${token}/`);
      toast.success('Email verified successfully');
      return { success: true };
    } catch (err) {
      console.error('Email verification error', err);
      const errorMessage = err.response?.data?.message || 'Failed to verify email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Context value
  const value = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    wsReady,
    
    // Core authentication methods
    register,
    login,
    logout,
    // refreshToken,
    
    // User management
    updateProfile,
    changePassword,
    
    // Password recovery
    requestPasswordReset,
    resetPassword,
    
    // Email verification
    verifyEmail,
    
    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Additional utilities
    setAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
