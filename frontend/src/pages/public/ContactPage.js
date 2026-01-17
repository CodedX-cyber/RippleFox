import React from 'react';
import { Container, Typography, TextField, Button, Grid, Box, Paper } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              Have questions or want to learn more about our services? Get in touch with our team today.
            </Typography>
            
            <Box sx={{ mt: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, borderRadius: 1, transition: 'all 0.3s', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)', transform: 'translateX(5px)' } }}>
                <Email color="primary" sx={{ mr: 2 }} />
                <Typography>info@ripplefox.co</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, borderRadius: 1, transition: 'all 0.3s', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)', transform: 'translateX(5px)' } }}>
                <Phone color="primary" sx={{ mr: 2 }} />
                <Typography>+234 904 431 9888</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, transition: 'all 0.3s', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)', transform: 'translateX(5px)' } }}>
                <LocationOn color="primary" sx={{ mr: 2 }} />
                <Typography>123 Business Avenue, Tech City, 10001</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="First Name"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Subject"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', '&:hover': { background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)' } }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
