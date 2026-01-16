import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  Paper,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  FlashOn as FlashIcon, 
  Security as SecurityIcon, 
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const features = [
  {
    icon: <FlashIcon color="primary" sx={{ fontSize: 60 }} />,
    title: 'Lightning Fast',
    description: 'Experience blazing fast performance with our optimized platform.'
  },
  {
    icon: <SecurityIcon color="primary" sx={{ fontSize: 60 }} />,
    title: 'Secure',
    description: 'Enterprise-grade security to protect your data and operations.'
  },
  {
    icon: <SpeedIcon color="primary" sx={{ fontSize: 60 }} />,
    title: 'Efficient',
    description: 'Streamlined processes for maximum productivity and efficiency.'
  }
];

const benefits = [
  '24/7 Customer Support',
  '99.9% Uptime Guarantee',
  'Scalable Solutions',
  'User-friendly Interface',
  'Regular Updates',
  'Data Analytics'
];

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          pt: { xs: 12, md: 20 },
          pb: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                gutterBottom
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Powering the Future of Business
              </Typography>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                component="p" 
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Innovative solutions for a digital world. Transform your business with our cutting-edge technology.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/features"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: alpha(theme.palette.primary.light, 0.1)
                    }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: { xs: 4, md: 0 } }}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Business Innovation"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: theme.shadows[10],
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Why Choose Ripple Fox?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                      backgroundColor: 'background.paper'
                    }
                  }}
                >
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ fontWeight: 700, mb: 3 }}
              >
                Everything You Need to Succeed
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Our platform provides all the tools and features you need to take your business to the next level.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <CheckIcon color="primary" sx={{ mr: 1.5 }} />
                      <Typography>{benefit}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button
                component={Link}
                to="/features"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 4, px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Explore Features
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={6} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0.2) 100%)',
                    zIndex: 1
                  }
                }}
              >
                <Box 
                  component="img"
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Business Dashboard"
                  sx={{ 
                    width: '100%',
                    display: 'block',
                    position: 'relative',
                    zIndex: 0
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 12, 
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Join thousands of businesses that trust Ripple Fox for their digital transformation journey.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              px: 6, 
              py: 1.5, 
              borderRadius: 2, 
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0 8px 20px 0 rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px 0 rgba(0, 0, 0, 0.25)'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
