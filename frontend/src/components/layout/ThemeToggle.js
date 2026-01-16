import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();

  return (
    <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton onClick={toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
