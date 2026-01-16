import React, { useState } from 'react';
import { 
  Box, Container, Typography, Paper, Avatar, 
  Tabs, Tab, Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import SecuritySettings from './SecuritySettings';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              sx={{ width: 80, height: 80 }}
              alt={user?.username || 'User'}
              src={user?.avatar}
            />
            <Box>
              <Typography variant="h6">
                {user?.username || 'User'}
              </Typography>
              <Typography color="textSecondary">
                {user?.email || 'No email provided'}
              </Typography>
            </Box>
          </Box>
          
          <Divider />
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            variant="fullWidth"
          >
            <Tab label="Profile" />
            <Tab label="Security" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>Profile Information</Typography>
            <Typography>Name: {user?.first_name} {user?.last_name}</Typography>
            <Typography>Username: {user?.username}</Typography>
            <Typography>Member since: {new Date(user?.date_joined).toLocaleDateString()}</Typography>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <SecuritySettings />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
