import React from 'react';
import { Container, Typography, TextField, Button, Grid, Box, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import { Email, Phone, LocationOn, AccessTime, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const ContactPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const heroBackground = isDark
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.65)} 60%, ${theme.palette.background.default} 100%)`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.25)} 0%, ${alpha(theme.palette.primary.light, 0.45)} 60%, ${theme.palette.background.paper} 100%)`;
  const cardBackground = isDark ? alpha(theme.palette.primary.dark, 0.6) : '#fff';
  const cardBorder = isDark ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`;
  const accordionBackground = isDark ? alpha(theme.palette.primary.dark, 0.2) : alpha(theme.palette.primary.light, 0.5);
  const mapWrapperBg = isDark ? alpha(theme.palette.primary.dark, 0.4) : alpha(theme.palette.primary.light, 0.35);
  const inputBackground = isDark ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.primary.light, 0.12);
  const infoBoxHover = alpha(theme.palette.primary.main, 0.15);
  const headingColor = isDark ? '#ffffff' : theme.palette.text.primary;
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <Box sx={{ py: 8, background: heroBackground, minHeight: '100vh', color: theme.palette.text.primary }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ color: headingColor }}>
              Contact Us
            </Typography>
            <Typography sx={{ color: 'text.secondary',  mb: 4  }}>
              Have questions or want to learn more about our services? Get in touch with our team today.
            </Typography>
            
            <Box sx={{ mt: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, borderRadius: 1, transition: 'all 0.3s', '&:hover': { backgroundColor: infoBoxHover, transform: 'translateX(5px)' } }}>
                <Email color="primary" sx={{ mr: 2 }} />
                <Typography sx={{ color: 'text.secondary' }}>info@ripplefox.co</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, borderRadius: 1, transition: 'all 0.3s', '&:hover': { backgroundColor: infoBoxHover, transform: 'translateX(5px)' } }}>
                <Phone color="primary" sx={{ mr: 2 }} />
                <Typography sx={{ color: 'text.secondary' }}>+234 904 431 9888</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, transition: 'all 0.3s', '&:hover': { backgroundColor: infoBoxHover, transform: 'translateX(5px)' } }}>
                <LocationOn color="primary" sx={{ mr: 2 }} />
                <Typography sx={{ color: 'text.secondary' }}>123 Business Avenue, Business City, 10001</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, transition: 'all 0.3s', '&:hover': { backgroundColor: infoBoxHover, transform: 'translateX(5px)' } }}>
                <AccessTime color="primary" sx={{ mr: 2 }} />
                <Typography sx={{ color: 'text.secondary' }}>Business Hours: Mon-Fri 9AM-6PM</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.8)' : '0 8px 32px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              backgroundColor: cardBackground,
              border: cardBorder,
            }}
          >
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      InputProps={{ sx: { backgroundColor: inputBackground, color: theme.palette.text.primary } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      InputProps={{ sx: { backgroundColor: inputBackground, color: theme.palette.text.primary } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      InputProps={{ sx: { backgroundColor: inputBackground, color: theme.palette.text.primary } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      InputProps={{ sx: { backgroundColor: inputBackground, color: theme.palette.text.primary } }}
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
                      InputProps={{ sx: { backgroundColor: inputBackground, color: theme.palette.text.primary } }}
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

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }} align="center">
            Our Location
          </Typography>
          <Box sx={{ height: 400, width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: mapWrapperBg }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.221990877551!2d-74.0036936845932!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2s123%20Business%20Ave%2C%20New%20York%2C%20NY%2010001%2C%20USA!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }} align="center">
            Frequently Asked Questions
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Accordion sx={{ backgroundColor: accordionBackground, borderRadius: 2, mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: 'text.secondary' }}>How can I contact you?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'text.secondary' }}>You can contact us via email at info@ripplefox.co or by phone at +234 904 431 9888.</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ backgroundColor: accordionBackground, borderRadius: 2, mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: 'text.secondary' }}>What are your business hours?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'text.secondary' }}>Our business hours are Monday to Friday, 9 AM to 6 PM.</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ backgroundColor: accordionBackground, borderRadius: 2, mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: 'text.secondary' }}>What services do you offer?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'text.secondary' }}>We offer a wide range of services including energy, IT consulting, project management, business strategy, and financial services.</Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
