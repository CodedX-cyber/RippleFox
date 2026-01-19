// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Utility function to get contrast text color based on background
export const getContrastText = (backgroundColor, mode) => {
  const darkBackgrounds = ['primary.main', '#4a6cf7', 'primary.dark', 'error.main', 'success.main', 'warning.main'];
  const lightBackgrounds = ['background.default', 'background.paper'];
  
  if (darkBackgrounds.includes(backgroundColor)) {
    return '#ffffff';
  }
  
  if (lightBackgrounds.includes(backgroundColor)) {
    return mode === 'dark' ? '#f1f5f9' : '#0f172a';
  }
  
  return mode === 'dark' ? '#f1f5f9' : '#1e293b';
};

// Main theme creator function
export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#4a6cf7',
      light: 'rgba(74, 108, 247, 0.1)',
      dark: '#3451d9',
    },
    secondary: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#f8fafc',
      paper: mode === 'dark' ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
      secondary: mode === 'dark' ? '#cbd5e1' : '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: mode === 'dark' ? '#f1f5f9' : '#0f172a',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      color: mode === 'dark' ? '#f1f5f9' : '#1e293b',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      color: mode === 'dark' ? '#f1f5f9' : '#1e293b',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      color: mode === 'dark' ? '#e2e8f0' : '#334155',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      color: mode === 'dark' ? '#e2e8f0' : '#334155',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      color: mode === 'dark' ? '#cbd5e1' : '#475569',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: mode === 'dark' ? '#475569 #1e293b' : '#cbd5e1 #f8fafc',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'dark' 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

// Custom hook to get adaptive heading color based on background
export const useAdaptiveHeadingColor = (backgroundColor) => {
  const theme = useTheme();
  return getContrastText(backgroundColor, theme.palette.mode);
};

// Example usage component
export const AdaptiveTypography = ({ variant = 'h2', backgroundColor = 'background.paper', children, sx = {}, ...props }) => {
  const theme = useTheme();
  const color = getContrastText(backgroundColor, theme.palette.mode);
  
  return (
    <Typography
      variant={variant}
      sx={{
        color,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default getTheme;