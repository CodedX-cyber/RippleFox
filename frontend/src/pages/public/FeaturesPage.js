import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  useTheme,
} from '@mui/material';
import {
  FlashOn as FlashIcon,
  Language as NetworkIcon,
  AutoFixHigh as InnovationIcon,
  Security as SecurityIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import PublicIcon from '@mui/icons-material/Public';
import { alpha } from '@mui/material/styles';

const features = [
  {
    title: 'Advanced Analytics',
    description:
      'Pipeline wide intelligence, anomaly detection, and guided decisions so your team can act with conviction.',
    accent: '#10a7ff',
    icon: <FlashIcon fontSize="inherit" />,
    badge: 'Insight',
  },
  {
    title: 'Global Network',
    description: 'Coordinate with partners, clients, and vendors across the world without losing visibility.',
    accent: '#1d9cff',
    icon: <NetworkIcon fontSize="inherit" />,
    badge: 'Reach',
  },
  {
    title: 'Innovation',
    description: 'Prototype faster, validate smarter, and launch with the confidence of a well-tested stack.',
    accent: '#ff9b4d',
    icon: <InnovationIcon fontSize="inherit" />,
    badge: 'Momentum',
  },
  {
    title: 'Security',
    description: 'Zero trust fundamentals, encrypted transport, and compliance guardrails keep your data safe.',
    accent: '#4caf50',
    icon: <SecurityIcon fontSize="inherit" />,
    badge: 'Trust',
  },
  {
    title: 'Sustainability',
    description: 'Automated resource tracking and efficiency reports help you operate responsibly.',
    accent: '#7c4dff',
    icon: <PublicIcon fontSize="inherit" />,
    badge: 'Impact',
  },
  {
    title: '24/7 Support',
    description: 'Experts who anticipate issues before they become incidents and who guide you through recovery.',
    accent: '#f50057',
    icon: <SupportIcon fontSize="inherit" />,
    badge: 'Care',
  },
];

const statHighlights = [
  { label: '99.9% Uptime', detail: 'Platform reliability supported by proactive observability.' },
  { label: '4x Faster Launch', detail: 'Accelerated releases with automation and blueprinting.' },
  { label: 'Dedicated Crew', detail: 'Product, design, and security experts embedded in your team.' },
];

const FeaturesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const background = isDark ? '#050608' : '#f5f6fb';
  const cardBackground = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background,
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        color: isDark ? '#f5f5f5' : '#050608',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -160,
          right: -140,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,156,255,0.35) 0%, rgba(29,156,255,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -180,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,167,255,0.25) 0%, rgba(16,167,255,0) 60%)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth="lg">
        <Box
          component="section"
          sx={{
            position: 'relative',
            borderRadius: 4,
            background: isDark
              ? alpha('#050608', 0.8)
              : 'linear-gradient(135deg, rgba(29, 156, 255, 0.95), rgba(16, 167, 255, 0.85))',
            p: { xs: 4, md: 6 },
            mb: { xs: 6, md: 10 },
            boxShadow:
              '0 40px 60px -40px rgba(13, 14, 21, 0.8), 0 20px 40px -30px rgba(13, 14, 21, 0.8)',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.35,
              background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), rgba(255,255,255,0))',
            }}
          />
          <Chip label="FEATURES" color="primary" size="small" sx={{ mb: 3, fontWeight: 700 }} />
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 3, position: 'relative' }}>
            What Makes Ripple Fox Ready for the Next Era of SaaS?
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 620, position: 'relative', zIndex: 1, mb: 4, lineHeight: 1.7 }}
          >
            We blend strategic product leadership with bold engineering so every feature you ship feels inevitable, not accidental.
            Our systems flex between reliability, velocity, and delight.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Button variant="contained" size="large" sx={{ boxShadow: '0 12px 32px rgba(5,9,24,0.4)' }}>
              Explore the platform
            </Button>
            <Button variant="outlined" size="large" sx={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}>
              Download the deck
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 8 } }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  background: cardBackground,
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13,14,21,0.08)',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                  boxShadow: isDark
                    ? '0 25px 80px rgba(0,0,0,0.45)'
                    : '0 25px 80px rgba(13, 14, 21, 0.08)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: isDark
                      ? '0 35px 100px rgba(0,0,0,0.55)'
                      : '0 35px 90px rgba(13, 14, 21, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: alpha(feature.accent, 0.18),
                        color: feature.accent,
                        fontSize: 32,
                        boxShadow: `inset 0 0 12px ${alpha('#000', 0.08)}`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', position: 'relative' }}
                    >
                      {feature.badge}
                    </Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          component="section"
          sx={{
            background: isDark
              ? 'linear-gradient(115deg, rgba(255,255,255,0.05), rgba(255,255,255,0))'
              : 'linear-gradient(120deg, rgba(13,14,21,0.04), rgba(13,14,21,0))',
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Built for teams that move fast and care deeply.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Ripple Fox is the cockpit where strategy, product, and operations intersect. Every feature is
                prefaced by research, fast prototyping, and measurable outcomes.
              </Typography>
              <Box sx={{ mt: 3, display: { xs: 'block', sm: 'flex' }, gap: 2 }}>
                <Button variant="contained" color="primary" size="medium">
                  Book a live tour
                </Button>
                <Button variant="text" color="inherit" size="medium">
                  See customer examples
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {statHighlights.map((stat) => (
                  <Grid item xs={12} sm={4} key={stat.label}>
                    <Box sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {stat.detail}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesPage;
