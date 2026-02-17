import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import { Business, People, EmojiEvents, Public } from '@mui/icons-material';

const RIPPLE_BRIGHT = 'rgb(0, 165, 223)';
const RIPPLE_MID = 'rgb(0, 130, 190)';
const RIPPLE_DARK = 'rgb(0, 100, 155)';

const stats = [
  { icon: <Business fontSize="large" sx={{ color: RIPPLE_BRIGHT }} />, number: '15+', label: 'Years in Business' },
  { icon: <People fontSize="large" sx={{ color: RIPPLE_BRIGHT }} />, number: '500+', label: 'Employees' },
  { icon: <EmojiEvents fontSize="large" sx={{ color: RIPPLE_BRIGHT }} />, number: '50+', label: 'Awards Won' },
  { icon: <Public fontSize="large" sx={{ color: RIPPLE_BRIGHT }} />, number: '20+', label: 'Countries Served' },
];

const team = [
  {
    name: 'Naomi King-Alale',
    role: 'COO',
    avatar: 'N',
    bio: 'Operations specialist ensuring seamless business processes.',
  },
  {
    name: 'Israel King-Alale',
    role: 'CTO',
    avatar: 'I',
    bio: 'CTO driving innovation in project management and digital delivery.',
  },
  {
    name: 'Sharon King-Alale',
    role: 'Executive Business Partner',
    avatar: 'S',
    bio: 'Executive Business Partner providing strategic support and leadership.',
  },
  {
    name: 'Sarah Johnson',
    role: 'CFO',
    avatar: 'SJ',
    bio: 'Financial strategist with a track record of sustainable growth.',
  },
];

const AboutPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Hero gradient using Ripple colors
  const heroGradient = `
    linear-gradient(135deg, ${RIPPLE_DARK} 0%, ${RIPPLE_MID} 50%, ${RIPPLE_BRIGHT} 100%)
  `;

  // Adaptive colors
  const statsSectionBg = isDark ? alpha(RIPPLE_DARK, 0.4) : alpha(RIPPLE_BRIGHT, 0.08);
  const statsCardBg = isDark ? alpha(RIPPLE_DARK, 0.6) : '#ffffff';
  const cardBorder = isDark ? `1px solid ${alpha(RIPPLE_BRIGHT, 0.3)}` : `1px solid ${alpha(RIPPLE_BRIGHT, 0.15)}`;
  const headingColor = isDark ? '#ffffff' : theme.palette.text.primary;

  return (
    <Box>
      {/* Hero Section - Ripple Gradient */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 380, md: 480 },
          color: 'white',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80"
          alt="Ripple Fox team loft building"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: heroGradient,
            opacity: 0.85,
            zIndex: 1,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 10, md: 14 }, textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.8rem', md: '4.5rem' },
              background: `linear-gradient(90deg, ${RIPPLE_BRIGHT}, ${RIPPLE_MID})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            About Ripple Fox
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            Pioneering excellence and innovation across multiple industries since 2008
          </Typography>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={{ xs: 8, md: 12 }} sx={{ backgroundColor: statsSectionBg }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box
                  textAlign="center"
                  sx={{
                    transition: 'transform 0.4s ease',
                    '&:hover': { transform: 'translateY(-12px)' },
                  }}
                >
                  <Box mb={2} sx={{ color: RIPPLE_BRIGHT }}>
                    {stat.icon}
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: statsCardBg,
                      px: 3,
                      py: 3,
                      borderRadius: 3,
                      border: cardBorder,
                      backdropFilter: isDark ? 'blur(8px)' : 'none',
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      fontWeight="bold"
                      sx={{ color: isDark ? RIPPLE_BRIGHT : theme.palette.primary.main }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="subtitle1" color={isDark ? 'rgba(255,255,255,0.85)' : 'text.secondary'}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Story */}
      <Box py={{ xs: 8, md: 12 }} bgcolor="background.paper">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 800, mb: 3, color: headingColor }}
              >
                Our Story
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.8 }}>
                Founded in 2025, Ripple Fox began as a small startup with a vision to revolutionize the energy sector. 
                Through relentless innovation and strategic expansion, we've grown into a diversified global enterprise 
                with operations spanning energy, IT consulting, project management, and financial services.
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Our commitment to excellence, sustainability, and customer success has been the cornerstone of our journey. 
                We continue to push boundaries, embrace project management best practices, and set new standards in every industry we serve.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={6} sx={{ overflow: 'hidden', borderRadius: 3 }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1350&q=80"
                  alt="Our Office"
                  sx={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Leadership Team */}
      <Box py={{ xs: 8, md: 12 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 800, mb: 2, color: headingColor }}
            align="center"
          >
            Our Leadership Team
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: 800, mx: 'auto' }}
          >
            Meet the dedicated professionals who lead our company with vision, integrity, and expertise
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.35s ease',
                    border: `1px solid ${alpha(RIPPLE_BRIGHT, 0.15)}`,
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: `0 16px 40px ${alpha(RIPPLE_BRIGHT, 0.25)}`,
                      borderColor: alpha(RIPPLE_BRIGHT, 0.4),
                    },
                  }}
                >
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: RIPPLE_BRIGHT,
                        fontSize: '2.8rem',
                        fontWeight: 900,
                        mb: 3,
                        boxShadow: `0 8px 24px ${alpha(RIPPLE_BRIGHT, 0.4)}`,
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: RIPPLE_BRIGHT, fontWeight: 600, mb: 2 }}
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {member.bio}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission & Values */}
      <Box py={{ xs: 8, md: 12 }} sx={{ backgroundColor: alpha(RIPPLE_DARK, 0.15) }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 800, mb: 3, color: headingColor }}
              >
                Our Mission
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5, lineHeight: 1.8, fontSize: '1.1rem' }}>
                To empower businesses and communities worldwide through innovative, sustainable, and high-impact solutions 
                that drive measurable growth and create enduring value.
              </Typography>

              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 800, mb: 3, color: headingColor }}
              >
                Our Vision
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.1rem' }}>
                To become the global benchmark for excellence in diversified business solutions, 
                leading with integrity, innovation, and unwavering commitment to positive change.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 800, mb: 4, color: headingColor }}
              >
                Our Core Values
              </Typography>

              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Integrity', 'Innovation', 'Excellence', 'Sustainability'].map((value) => (
                  <Box
                    component="li"
                    key={value}
                    sx={{
                      mb: 3,
                      pl: 4,
                      position: 'relative',
                      '&:before': {
                        content: '"•"',
                        position: 'absolute',
                        left: 0,
                        color: RIPPLE_BRIGHT,
                        fontSize: '2rem',
                        lineHeight: 1,
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: headingColor }}>
                      {value}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {value === 'Integrity' && 'We operate with uncompromising honesty, transparency, and ethical standards in everything we do.'}
                      {value === 'Innovation' && 'We embrace creativity, forward-thinking, and continuous improvement to solve tomorrow’s challenges today.'}
                      {value === 'Excellence' && 'We pursue the highest standards of quality, precision, and performance in every project and interaction.'}
                      {value === 'Sustainability' && 'We prioritize long-term environmental responsibility, social impact, and sustainable business practices.'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;