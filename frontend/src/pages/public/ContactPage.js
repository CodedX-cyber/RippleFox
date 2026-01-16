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
    <Box sx={{ py: 8 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email color="primary" sx={{ mr: 2 }} />
                <Typography>info@ripplefox.co</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone color="primary" sx={{ mr: 2 }} />
                <Typography>+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn color="primary" sx={{ mr: 2 }} />
                <Typography>123 Business Avenue, Tech City, 10001</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
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
