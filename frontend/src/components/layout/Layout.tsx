import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  Stars as FeaturesIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

declare const process: { env: { PUBLIC_URL?: string } };

const SIDEBAR_WIDTH = 72;
const SIDEBAR_EXPANDED_WIDTH = 260;

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  divider?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);

  const isAuthenticated = Boolean(user);
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenu = (event: React.MouseEvent) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string | undefined) => {
    if (path) {
      navigate(path);
      if (isMobile) setMobileOpen(false);
    }
  };

  const isActive = (path: string | undefined) => {
    if (!path) return false;
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };

  const menuItems: MenuItem[] = isAuthenticated
    ? [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'My Profile', icon: <AccountIcon />, path: '/profile' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        { text: 'Logout', icon: <LogoutIcon />, action: handleLogout, divider: true },
      ]
    : [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Features', icon: <FeaturesIcon />, path: '/features' },
        { text: 'About', icon: <InfoIcon />, path: '/about' },
        { text: 'Contact', icon: <ContactIcon />, path: '/contact' },
        { text: 'Login', icon: <AccountIcon />, path: '/login', divider: true },
        { text: 'Register', icon: <AccountIcon />, path: '/register' },
      ];

  const publicUrl = process.env.PUBLIC_URL || '';
  const logoSrc =
    theme.palette.mode === 'dark'
      ? `${publicUrl}/ripplefox dark.png`
      : `${publicUrl}/ripple fox light.png`;

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: 2,
          py: 1.5,
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pr: 2,
            }}
          >
            Ripple Fox
          </Typography>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          size="small"
          sx={{
            ml: collapsed ? 0 : 'auto',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem
              button
              onClick={() => item.path ? handleNavigate(item.path) : item.action?.()}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  borderLeft: '4px solid #4a6cf7',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(74, 108, 247, 0.15)',
                },
                '&:hover': { backgroundColor: 'action.hover' },
                mb: 0.5,
                px: 3,
                py: 1.5,
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 'auto' : 40,
                  color: 'inherit',
                  mr: collapsed ? 0 : 2,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              )}
            </ListItem>
            {item.divider && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${collapsed ? SIDEBAR_WIDTH : SIDEBAR_EXPANDED_WIDTH}px)` },
          ml: { md: `${collapsed ? SIDEBAR_WIDTH : SIDEBAR_EXPANDED_WIDTH}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.05)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'none' },
                }}
              >
                RIPPLE FOX
              </Typography>

              {/* Desktop Public Links */}
              {!isAuthenticated && (
                <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 6, gap: 2 }}>
                  {['/', '/features', '/about', '/contact'].map((path) => (
                    <Button
                      key={path}
                      component={RouterLink}
                      to={path}
                      sx={{
                        color: isActive(path) ? 'primary.main' : 'text.secondary',
                        fontWeight: isActive(path) ? 600 : 400,
                        textTransform: 'none',
                      }}
                    >
                      {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ThemeToggle />

              {isAuthenticated ? (
                <Tooltip title="Account">
                  <IconButton onClick={handleMenu}>
                    <Avatar
                      alt={user?.first_name ? String(user.first_name) : 'User'}
                      src={user?.profile_picture || undefined}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </Box>

            {/* Account Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                <ListItemIcon><AccountIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: collapsed ? SIDEBAR_WIDTH : SIDEBAR_EXPANDED_WIDTH }, flexShrink: 0 }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: collapsed ? SIDEBAR_WIDTH : SIDEBAR_EXPANDED_WIDTH,
              borderRight: 'none',
              boxShadow: '2px 0 10px 0 rgba(0, 0, 0, 0.05)',
              overflowX: 'hidden',
              transition: 'width 0.2s',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'background.default',
          width: { md: `calc(100% - ${collapsed ? SIDEBAR_WIDTH : SIDEBAR_EXPANDED_WIDTH}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;