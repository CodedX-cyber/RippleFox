import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const PRIMARY_COLOR = '#1d9cff';
const SECONDARY_COLOR = '#050608';
const ACCENT_COLOR = '#10a7ff';

export const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light theme
                primary: {
                  main: PRIMARY_COLOR,
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: SECONDARY_COLOR,
                  contrastText: '#ffffff',
                },
                action: {
                  active: ACCENT_COLOR,
                },
                background: {
                  default: '#f8f9fa',
                  paper: '#ffffff',
                },
              }
            : {
                // Dark theme
                primary: {
                  main: ACCENT_COLOR,
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: SECONDARY_COLOR,
                  contrastText: '#ffffff',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#ffffff',
                  secondary: 'rgba(255, 255, 255, 0.7)',
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700, fontSize: '2.5rem' },
          h2: { fontWeight: 600, fontSize: '2rem' },
          h3: { fontWeight: 600 },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                color: mode === 'dark' ? '#ffffff' : 'inherit',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
