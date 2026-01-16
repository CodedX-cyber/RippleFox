import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  Paper,
  Stack,
  TextField,
  Divider,
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
  CheckCircle as CheckIcon,
  Engineering as EngineeringIcon,
  SettingsSuggest as SettingsSuggestIcon
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

const coreValues = [
  'Honesty & Ethics',
  'Customer Focus',
  'Innovation',
  'Accountability',
  'Excellence',
  'Team Work'
];

const services = [
  {
    title: 'SaaS Product Strategy',
    icon: <SettingsSuggestIcon fontSize="large" color="secondary" />, 
    bullets: [
      'Roadmap refinement & discovery workshops',
      'Platform architecture & scalability planning',
      'User experience blueprints',
      'Roadmap coaching for internal teams'
    ]
  },
  {
    title: 'Project Leadership & Consulting',
    icon: <FlashIcon fontSize="large" color="secondary" />, 
    bullets: [
      'Agile delivery & product management',
      'Technical advisory for CTOs/VPs',
      'Change management & enablement',
      'Performance reviews and mentoring'
    ]
  },
  {
    title: 'Web, Mobile & ERP Engineering',
    icon: <EngineeringIcon fontSize="large" color="secondary" />, 
    bullets: [
      'Custom web & mobile app development',
      'ERP implementation & integrations',
      'API-first ecosystems & automation',
      'Maintenance, support, and scaling'
    ]
  }
];

const statHighlights = [
  {
    title: 'Product Velocity',
    description: 'We compress discovery, design, and delivery so your SaaS roadmap launches reliably.'
  },
  {
    title: 'Trusted Advisors',
    description: 'Fractional CTO/PM leadership keeps every initiative aligned to business outcomes.'
  },
  {
    title: 'ERP Ready',
    description: 'We align off-the-shelf suites or bespoke stacks with your people and processes.'
  }
];

const metrics = [
  { label: 'Engineers on the ground', value: '100+' },
  { label: 'Portfolios delivered', value: '5+' },
  { label: 'Satisfied clients', value: '8+' }
];

const partnerLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/IHS_Inc._logo.svg/2560px-IHS_Inc._logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Omnicom_logo.svg/2560px-Omnicom_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Huawei.svg/1200px-Huawei.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/ABLOY_logo.svg/2560px-ABLOY_logo.svg.png'
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
                SaaS products, project leadership, and technical guidance crafted to accelerate your digital initiatives.
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

      {/* About Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                About Us
              </Typography>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                Infrastructure engineering services.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Ripple Fox creates SaaS platforms, orchestrates high-impact projects, and consults on digital transformation so teams can deliver faster.
                From product vision to ERP deployment, our experts guide every phase with clarity and accountability.
              </Typography>
              <Button
                component={Link}
                to="/about"
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 4, textTransform: 'none', fontWeight: 600 }}
              >
                Learn more
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                alt="Infrastructure"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: theme.shadows[8]
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
      <Box component="section" sx={{ py: 10, backgroundColor: '#f6f9ff' }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" align="center" sx={{ fontWeight: 700, mb: 6 }}>
            Our Core Values
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {coreValues.map((value) => (
              <Box
                key={value}
                sx={{
                  width: 160,
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#0d1d3a',
                  backgroundColor: '#fff',
                  border: '1px solid #dfe7f5',
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)'
                }}
              >
                <Typography sx={{ px: 1 }}>{value}</Typography>
              </Box>
            ))}
            <Box
              sx={{
                width: 160,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontWeight: 700,
                color: '#fff',
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
                mt: { xs: 4, md: 0 }
              }}
            >
              <Typography sx={{ px: 1 }}>RIPPLE FOX</Typography>
            </Box>
          </Box>
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

      {/* Services Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 10, md: 14 },
          backgroundColor: '#070b1a',
          color: '#fff'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
            What we do
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 6, maxWidth: 640, mx: 'auto', opacity: 0.8 }}>
            Siatech Africa builds tailored solutions by deeply understanding each client’s needs and translating them into reliable infrastructure outcomes.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {services.map((service) => (
              <Grid item xs={12} md={4} key={service.title}>
                <Card
                  sx={{
                    minHeight: 360,
                    backgroundColor: '#0b1230',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 3,
                    px: 4,
                    py: 4,
                    boxShadow: 'none'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {service.icon}
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {service.title}
                      </Typography>
                    </Stack>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                    <Stack spacing={1.2}>
                      {service.bullets.map((bullet) => (
                        <Stack key={bullet} direction="row" spacing={1} alignItems="flex-start">
                          <CheckIcon sx={{ fontSize: 18, color: '#2fb1ff', mt: 0.5 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                            {bullet}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats & Trust Section */}
      <Box component="section" sx={{ backgroundColor: '#05070e', color: '#fff', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" sx={{ fontWeight: 700, mb: 4 }}>
            Why RippleFox Africa?
          </Typography>
          <Typography align="center" sx={{ mb: 6, maxWidth: 720, mx: 'auto', color: 'rgba(255,255,255,0.8)' }}>
            Business developers, engineers, and analysts collaborate to deliver dependable infrastructure with agility and integrity.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {statHighlights.map((highlight) => (
              <Grid item xs={12} md={4} key={highlight.title}>
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 4,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {highlight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {highlight.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3} sx={{ mt: 6 }}>
            {metrics.map((metric) => (
              <Grid item xs={12} md={4} key={metric.label}>
                <Box
                  sx={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.04)'
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {metric.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="subtitle1" align="center" sx={{ mt: 6, mb: 3, color: 'rgba(255,255,255,0.7)' }}>
            Trusted by 10+ businesses
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            {partnerLogos.map((logo) => (
              <Box key={logo} component="img" src={logo} alt="partner" sx={{ height: 40, opacity: 0.85 }} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          backgroundColor: '#f5f8ff',
          pb: 0
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 10, md: 12 }, pb: { xs: 12, md: 16 } }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2 }}>
            Want to work with us?
          </Typography>
          <Typography align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Share your business needs and one of our delivery specialists will get back to you shortly.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[4], py: 4, px: 3, background: theme.palette.primary.dark, color: '#fff' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  GET IN TOUCH
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2">
                    <strong>Address:</strong> 3 Bole Onasanya Crescent, Ogudu Lagos
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> enquiry@siatechafrica.com
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> +234 811 227 0000
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ borderRadius: 4, boxShadow: theme.shadows[4], py: 4, px: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  CONTACT US
                </Typography>
                <Stack spacing={2}>
                  <TextField fullWidth label="First Name" variant="outlined" size="small" />
                  <TextField fullWidth label="Last Name" variant="outlined" size="small" />
                  <TextField fullWidth label="Email" variant="outlined" size="small" />
                  <TextField fullWidth label="Phone" variant="outlined" size="small" />
                  <TextField fullWidth label="Message" variant="outlined" size="small" multiline rows={3} />
                  <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>Send</Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 160,
            background: 'linear-gradient(180deg, #0f3c8b, #05070e)',
            borderTopLeftRadius: '50% 20%',
            borderTopRightRadius: '50% 20%'
          }}
        />
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
