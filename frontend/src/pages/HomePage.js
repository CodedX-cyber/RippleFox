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
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  FlashOn as FlashIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,
  Engineering as EngineeringIcon,
  SettingsSuggest as SettingsSuggestIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <FlashIcon color="primary" sx={{ fontSize: 60 }} />,
    title: 'Lightning Fast',
    description: 'Experience blazing fast performance with our optimized platform.',
  },
  {
    icon: <SecurityIcon color="primary" sx={{ fontSize: 60 }} />,
    title: 'Secure',
    description: 'Enterprise-grade security to protect your data and operations.',
  },
  {
    icon: <SpeedIcon color="primary" sx={{ fontSize: 60 }} />,
    title: 'Efficient',
    description: 'Streamlined processes for maximum productivity and efficiency.',
  },
];

const benefits = [
  '24/7 Customer Support',
  '99.9% Uptime Guarantee',
  'Scalable Solutions',
  'User-friendly Interface',
  'Regular Updates',
  'Data Analytics',
];

const coreValues = [
  'Honesty & Ethics',
  'Customer Focus',
  'Innovation',
  'Accountability',
  'Excellence',
  'Team Work',
];

const services = [
  {
    title: 'SaaS Product Strategy',
    icon: <SettingsSuggestIcon fontSize="large" color="secondary" />,
    bullets: [
      'Roadmap refinement & discovery workshops',
      'Platform architecture & scalability planning',
      'User experience blueprints',
      'Roadmap coaching for internal teams',
    ],
  },
  {
    title: 'Project Leadership & Consulting',
    icon: <FlashIcon fontSize="large" color="secondary" />,
    bullets: [
      'Agile delivery & product management',
      'Technical advisory for CTOs/VPs',
      'Change management & enablement',
      'Performance reviews and mentoring',
    ],
  },
  {
    title: 'Web, Mobile & ERP Engineering',
    icon: <EngineeringIcon fontSize="large" color="secondary" />,
    bullets: [
      'Custom web & mobile app development',
      'ERP implementation & integrations',
      'API-first ecosystems & automation',
      'Maintenance, support, and scaling',
    ],
  },
];

const statHighlights = [
  {
    title: 'Product Velocity',
    description: 'We compress discovery, design, and delivery so your SaaS roadmap launches reliably.',
  },
  {
    title: 'Trusted Advisors',
    description: 'Fractional CTO/PM leadership keeps every initiative aligned to business outcomes.',
  },
  {
    title: 'ERP Ready',
    description: 'We align off-the-shelf suites or bespoke stacks with your people and processes.',
  },
];

const metrics = [
  { label: 'Engineers on the ground', value: '100+' },
  { label: 'Portfolios delivered', value: '5+' },
  { label: 'Satisfied clients', value: '8+' },
];

const partnerLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/IHS_Inc._logo.svg/2560px-IHS_Inc._logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Omnicom_logo.svg/2560px-Omnicom_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Huawei.svg/1200px-Huawei.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/ABLOY_logo.svg/2560px-ABLOY_logo.svg.png',
];

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  const RIPPLE_BRIGHT = 'rgb(0, 165, 223)';
  const RIPPLE_MID = 'rgb(0, 130, 190)';
  const RIPPLE_DARK = 'rgb(0, 100, 155)';

  const heroGradient = `
    radial-gradient(circle at center, ${RIPPLE_BRIGHT} 0%, ${RIPPLE_MID} 40%, transparent 70%),
    linear-gradient(135deg, ${RIPPLE_DARK} 0%, ${RIPPLE_MID} 45%, ${RIPPLE_BRIGHT} 100%)
  `;

  const headingColor = isDark ? '#ffffff' : theme.palette.text.primary;
  const contactSectionBackground = isDark ? alpha(theme.palette.primary.dark, 0.7) : '#f5f8ff';

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, md: 20 },
          pb: { xs: 8, md: 12 },
          background: heroGradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.15)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
               <Typography variant="h6" sx={{ mb: 3, fontWeight: 350, color: isDark ? '#ffffff' : '#ffffff' }}>
                SaaS products, project leadership, and technical guidance crafted to accelerate your digital initiatives.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    backgroundColor: RIPPLE_BRIGHT,
                    '&:hover': { backgroundColor: RIPPLE_MID },
                    boxShadow: '0 4px 14px rgba(0, 165, 223, 0.4)',
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/features"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: RIPPLE_BRIGHT, background: 'rgba(255,255,255,0.1)' },
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
                  '&:hover': { transform: 'translateY(-8px)' },
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
              <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, color: headingColor }}>
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
                  boxShadow: theme.shadows[8],
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 10, md: 14 },
          backgroundColor: RIPPLE_DARK,
          color: '#ffffff',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 8,
              color: '#ffffff',
            }}
          >
            Our Core Values
          </Typography>

          <Box
            sx={{
              position: 'relative',
              maxWidth: 900,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* Top row - 3 hexagons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 3, md: 5 },
                transform: 'translateX(-20px)',
              }}
            >
              {coreValues.slice(0, 3).map((value) => (
                <Box
                  key={value}
                  sx={{
                    width: { xs: 130, md: 160 },
                    height: { xs: 150, md: 185 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    border: `1px solid rgba(255,255,255,0.18)`,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px) rotate(3deg)',
                      boxShadow: `0 12px 32px ${RIPPLE_BRIGHT}40`,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', md: '1.1rem' },
                      px: 2,
                      color: '#ffffff',
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Bottom row - 3 hexagons + larger RIPPLE FOX */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 3, md: 5 },
                flexWrap: 'wrap',
                position: 'relative',
              }}
            >
              {coreValues.slice(3).map((value) => (
                <Box
                  key={value}
                  sx={{
                    width: { xs: 130, md: 160 },
                    height: { xs: 150, md: 185 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    border: `1px solid rgba(255,255,255,0.18)`,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px) rotate(-3deg)',
                      boxShadow: `0 12px 32px ${RIPPLE_BRIGHT}40`,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', md: '1.1rem' },
                      px: 2,
                      color: '#ffffff',
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}

              {/* Larger RIPPLE FOX hexagon */}
              <Box
                sx={{
                  width: { xs: 160, md: 200 },
                  height: { xs: 185, md: 230 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  backgroundColor: RIPPLE_BRIGHT,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  boxShadow: `0 12px 40px ${RIPPLE_BRIGHT}60`,
                  position: { xs: 'relative', md: 'absolute' },
                  right: { md: -40 },
                  top: { md: '50%' },
                  transform: { md: 'translateY(-50%) scale(1.15)' },
                  zIndex: 2,
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: { md: 'translateY(-50%) scale(1.3) rotate(-5deg)' },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    letterSpacing: '1px',
                    color: '#ffffff',
                    textShadow: '0 3px 12px rgba(0,0,0,0.6)',
                    px: 3,
                  }}
                >
                  RIPPLE FOX
                </Typography>
              </Box>
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
            sx={{ fontWeight: 700, mb: 6, color: headingColor }}
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
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                >
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, color: headingColor }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">{feature.description}</Typography>
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
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }}>
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
                      <Typography sx={{ color: 'text.secondary' }}>{benefit}</Typography>
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
                    zIndex: 1,
                  },
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
                    zIndex: 0,
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* What we do / Services Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 10, md: 14 },
          background: heroGradient,
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#ffffff',
            }}
          >
            What we do
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 720,
              mx: 'auto',
              mb: 8,
              fontSize: { xs: '1rem', md: '1.125rem' },
            }}
          >
            Ripple Fox builds tailored solutions by deeply understanding each client's needs and translating them into reliable infrastructure outcomes.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.title}>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(5, 7, 14, 0.75)',
                    border: `1px solid ${RIPPLE_BRIGHT}40`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(0, 165, 223, 0.25)',
                      borderColor: RIPPLE_BRIGHT,
                    },
                  }}
                >
                  <Stack
                    spacing={3}
                    sx={{
                      p: 4,
                      flexGrow: 1,
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      {React.cloneElement(service.icon, {
                        sx: { fontSize: 40, color: RIPPLE_BRIGHT },
                      })}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#ffffff',
                        }}
                      >
                        {service.title}
                      </Typography>
                    </Stack>

                    <Divider sx={{ width: '60%', borderColor: 'rgba(255,255,255,0.18)' }} />

                    <Stack spacing={1.8} sx={{ width: '100%', alignItems: 'flex-start' }}>
                      {service.bullets.map((bullet) => (
                        <Stack
                          key={bullet}
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                          sx={{ width: '100%' }}
                        >
                          <CheckIcon
                            sx={{
                              fontSize: 20,
                              color: RIPPLE_BRIGHT,
                              mt: '3px',
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255,255,255,0.88)',
                              textAlign: 'left',
                              lineHeight: 1.6,
                            }}
                          >
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
      <Box
        component="section"
        sx={{
          backgroundColor: RIPPLE_DARK,
          color: '#ffffff',
          py: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ fontWeight: 700, mb: 4, color: '#ffffff' }}
          >
            Why Ripple Fox?
          </Typography>

          <Typography
            align="center"
            sx={{ mb: 6, maxWidth: 720, mx: 'auto', color: 'rgba(255,255,255,0.85)' }}
          >
            Business developers, engineers, and analysts collaborate to deliver dependable infrastructure with agility and integrity.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {statHighlights.map((highlight) => (
              <Grid item xs={12} md={4} key={highlight.title}>
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 5,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 32px rgba(0, 165, 223, 0.18)',
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}
                  >
                    {highlight.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}
                  >
                    {highlight.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mt: 8 }}>
            {metrics.map((metric) => (
              <Grid item xs={12} md={4} key={metric.label}>
                <Box
                  sx={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: RIPPLE_BRIGHT, mb: 1 }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}
                  >
                    {metric.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mt: 8, mb: 4, color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem' }}
          >
            Trusted by 10+ businesses
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            {partnerLogos.map((logo, index) => (
              <Box
                key={index}
                component="img"
                src={logo}
                alt="partner"
                sx={{ height: 48, opacity: 0.7, filter: 'grayscale(100%) brightness(1.8)' }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box component="section" sx={{ position: 'relative', backgroundColor: contactSectionBackground, pb: 0 }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 10, md: 12 }, pb: { xs: 12, md: 16 } }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2, color: headingColor }}>
            Want to work with us?
          </Typography>
          <Typography align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Share your business needs and one of our delivery specialists will get back to you shortly.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Left column - Contact Info */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: theme.shadows[4],
                  py: 4,
                  px: 3,
                  background: theme.palette.primary.dark,
                  color: '#fff',
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                  Contact Us
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <strong>Address:</strong> 123 Business Avenue, Tech City, 10001
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <strong>Email:</strong> info@ripplefox.co
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <strong>Phone:</strong> +234 904 431 9888
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Right column - Contact Form (white text) */}
            <Grid item xs={12} md={5}>
              <Paper
                sx={{
                  borderRadius: 4,
                  boxShadow: theme.shadows[4],
                  py: 5,
                  px: 4,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  backdropFilter: isDark ? 'blur(10px)' : 'none',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)',
                  color: isDark ? '#ffffff' : '#000000',
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: isDark ? '#ffffff' : '#111111' }}>
                  CONTACT US
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ style: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
                    InputProps={{
                      style: { color: isDark ? '#ffffff' : '#000000' },
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: RIPPLE_BRIGHT,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ style: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
                    InputProps={{
                      style: { color: isDark ? '#ffffff' : '#000000' },
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: RIPPLE_BRIGHT,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ style: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
                    InputProps={{
                      style: { color: isDark ? '#ffffff' : '#000000' },
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: RIPPLE_BRIGHT,
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ style: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
                    InputProps={{
                      style: { color: isDark ? '#ffffff' : '#000000' },
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: RIPPLE_BRIGHT,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                    InputLabelProps={{ style: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
                    InputProps={{
                      style: { color: isDark ? '#ffffff' : '#000000' },
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: RIPPLE_BRIGHT,
                        },
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      py: 1.5,
                      backgroundColor: RIPPLE_BRIGHT,
                      color: '#ffffff',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: `0 4px 14px ${RIPPLE_BRIGHT}40`,
                      '&:hover': {
                        backgroundColor: RIPPLE_MID,
                        boxShadow: `0 6px 20px ${RIPPLE_BRIGHT}60`,
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Bottom wave */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 160,
            background: 'linear-gradient(180deg, #0f3c8b, #05070e)',
            borderTopLeftRadius: '50% 20%',
            borderTopRightRadius: '50% 20%',
          }}
        />
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: `linear-gradient(135deg, ${RIPPLE_DARK} 0%, ${RIPPLE_MID} 50%, ${RIPPLE_BRIGHT} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#ffffff' }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, maxWidth: 700, mx: 'auto', color: '#ffffff' }}>
            Join thousands of businesses that trust Ripple Fox for their digital transformation journey.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
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
                boxShadow: '0 12px 24px 0 rgba(0, 0, 0, 0.25)',
              },
              transition: 'all 0.3s ease-in-out',
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