import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Business, People, EmojiEvents, Public } from '@mui/icons-material';

const stats = [
  { icon: <Business fontSize="large" color="primary" />, number: '15+', label: 'Years in Business' },
  { icon: <People fontSize="large" color="primary" />, number: '500+', label: 'Employees' },
  { icon: <EmojiEvents fontSize="large" color="primary" />, number: '50+', label: 'Awards Won' },
  { icon: <Public fontSize="large" color="primary" />, number: '20+', label: 'Countries Served' },
];

const team = [
  {
    name: 'Naomi King-Alale',
    role: 'COO',
    avatar: 'N',
    bio: 'Operations specialist ensuring seamless business processes.'
  },
  {
    name: 'Israel King-Alale',
    role: 'CTO',
    avatar: 'I',
    bio: 'Technology expert driving innovation and digital transformation.'
  },
  {
    name: 'Sharon King-Alale',
    role: 'Executive Business Partner',
    avatar: 'S',
    bio: 'Executive Business Partner providing strategic support and leadership.'
  },
  {
    name: 'Sarah Johnson',
    role: 'CFO',
    avatar: 'SJ',
    bio: 'Financial strategist with a track record of sustainable growth..'
  },
];

const AboutPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const heroGradient = isDark
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.5)} 60%, rgba(2,6,23,0.85) 100%)`
    : `linear-gradient(135deg, rgba(5,9,24,0.85) 0%, ${alpha(theme.palette.primary.main, 0.5)} 60%, rgba(2,6,23,0.75) 100%)`;
  const statsSectionBg = isDark ? alpha(theme.palette.primary.main, 0.12) : '#f8fafc';
  const statsCardBg = isDark ? theme.palette.background.paper : '#ffffff';
  const textSecondary = theme.palette.text.secondary;
  const headingColor = isDark ? '#ffffff' : theme.palette.text.primary;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: 420,
          color: 'white',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: heroGradient,
            zIndex: 1,
          },
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
            zIndex: 0,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 2,
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 4 }}>

          </Box>
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            About Ripple Fox
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Pioneering excellence and innovation across multiple industries since 2008
          </Typography>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={8} sx={{ backgroundColor: statsSectionBg }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index} textAlign="center" sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Box mb={1}>
                  {stat.icon}
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: statsCardBg,
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    mb: 1,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stat.number}
                  </Typography>
                  <Typography variant="subtitle1" color={textSecondary}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Story */}
      <Box py={8} bgcolor="background.paper">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }}>
                Our Story
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Founded in 2025, Ripple Fox began as a small startup with a vision to revolutionize the energy sector. 
                Through innovation and strategic expansion, we've grown into a diversified global enterprise with operations 
                spanning multiple industries including technology, energy, IT consulting, project management and financial services.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Our commitment to excellence, sustainability, and customer satisfaction has been the driving force behind our success. 
                We continue to push boundaries and set new standards in every industry we operate in.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Our Office"
                  sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Team */}
      <Box py={8}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }} align="center">
            Our Leadership Team
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" mb={6} maxWidth="800px" mx="auto">
            Meet the dedicated professionals who lead our company with vision and expertise
          </Typography>
          
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%', transition: 'transform 0.3s, boxShadow 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' } }}>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Avatar 
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        bgcolor: 'primary.main',
                        fontSize: '2.5rem',
                        mb: 2
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography color="primary" fontWeight="medium" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
      <Box py={8} bgcolor="background.paper">
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }}>
                Our Mission
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                To empower businesses and communities through innovative solutions that drive sustainable growth and create lasting value.
              </Typography>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }}>
                Our Vision
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                To be the global leader in diversified business solutions, setting the standard for excellence, innovation, and social responsibility.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: headingColor }}>
                Our Values
              </Typography>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 1, color: headingColor }}>Integrity</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We conduct our business with the highest ethical standards and transparency.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 1, color: headingColor }}>Innovation</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We embrace creativity and forward-thinking to solve complex challenges.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 1, color: headingColor }}>Excellence</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We are committed to delivering superior quality in everything we do.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 1, color: headingColor }}>Sustainability</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We prioritize environmental responsibility and sustainable business practices.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
