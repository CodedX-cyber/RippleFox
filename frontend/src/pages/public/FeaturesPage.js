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
  alpha,
} from '@mui/material';
import {
  FlashOn as FlashIcon,
  Language as NetworkIcon,
  AutoFixHigh as InnovationIcon,
  Security as SecurityIcon,
  SupportAgent as SupportIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

const RIPPLE_BRIGHT = 'rgb(0, 165, 223)';
const RIPPLE_MID = 'rgb(0, 130, 190)';
const RIPPLE_DARK = 'rgb(0, 100, 155)';

const features = [
  {
    title: 'Real-time Project Visibility',
    description:
      'Track project progress, timelines, and resource allocation across your entire portfolio with instant dashboard updates.',
    accent: RIPPLE_BRIGHT,
    icon: <FlashIcon fontSize="inherit" sx={{ color: RIPPLE_BRIGHT }} />,
    badge: 'Control',
  },
  {
    title: 'Team Collaboration Hub',
    description: 'Seamless communication and task coordination for distributed teams. Keep everyone aligned and productive.',
    accent: RIPPLE_MID,
    icon: <NetworkIcon fontSize="inherit" sx={{ color: RIPPLE_BRIGHT }} />,
    badge: 'Connect',
  },
  {
    title: 'Resource Optimization',
    description: 'Intelligent resource planning and capacity management to maximize team efficiency and project delivery.',
    accent: '#ff9b4d',
    icon: <InnovationIcon fontSize="inherit" sx={{ color: RIPPLE_BRIGHT }} />,
    badge: 'Efficiency',
  },
  {
    title: 'Risk Management',
    description: 'Early issue detection, automated alerts, and mitigation playbooks to keep projects on track.',
    accent: '#4caf50',
    icon: <SecurityIcon fontSize="inherit" sx={{ color: RIPPLE_BRIGHT }} />,
    badge: 'Prevention',
  },
  {
    title: 'Performance Reporting',
    description: 'Comprehensive analytics on project health, team velocity, and ROI to drive data-backed decisions.',
    accent: '#7c4dff',
    icon: <PublicIcon fontSize="inherit" sx={{ color: RIPPLE_BRIGHT }} />,
    badge: 'Insights',
  },
  {
    title: 'Expert Advisory',
    description: 'Access our project management consultants for strategy, best practices, and continuous improvement guidance.',
    accent: '#f50057',
    icon: <SupportIcon fontSize="inherit" sx={{ color: RIPPLE_BRIGHT }} />,
    badge: 'Growth',
  },
];

const statHighlights = [
  { label: 'Projects On Time', detail: '92% of our clients deliver projects on schedule.' },
  { label: '40% Faster Delivery', detail: 'Teams improve delivery speed with better planning and execution.' },
  { label: 'Expert Partnership', detail: 'Project management consultants embedded in your organization.' },
];

const FeaturesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const background = theme.palette.background.default;

  // Hero gradient using Ripple brand colors
  const heroGradient = `
    linear-gradient(135deg, ${RIPPLE_DARK} 0%, ${RIPPLE_MID} 45%, ${RIPPLE_BRIGHT} 100%)
  `;

  const cardBackground = isDark ? alpha(RIPPLE_DARK, 0.35) : '#ffffff';
  const cardBorder = isDark ? `1px solid ${alpha(RIPPLE_BRIGHT, 0.25)}` : `1px solid ${alpha(RIPPLE_BRIGHT, 0.15)}`;

  const headingColor = isDark ? '#ffffff' : theme.palette.text.primary;
  const cardTitleColor = isDark ? '#ffffff' : theme.palette.text.primary;

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
      {/* Ripple brand radial glows */}
      <Box
        sx={{
          position: 'absolute',
          top: -160,
          right: -140,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(RIPPLE_BRIGHT, 0.35)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -180,
          left: -120,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(RIPPLE_MID, 0.25)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        {/* Hero Banner */}
        <Box
          component="section"
          sx={{
            position: 'relative',
            borderRadius: 4,
            background: heroGradient,
            p: { xs: 5, md: 8 },
            mb: { xs: 6, md: 10 },
            boxShadow: '0 40px 80px -40px rgba(0,0,0,0.6)',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.3,
              background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent)',
            }}
          />
          <Chip
            label="FEATURES"
            size="small"
            sx={{
              mb: 3,
              fontWeight: 700,
              backgroundColor: alpha('#ffffff', 0.15),
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          />
          <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3 }}>
            Deliver Projects Better, Faster, and Smarter
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 680, mb: 5, lineHeight: 1.8, opacity: 0.95, color: isDark ? '#ffffff' : '#ffffff' }}>
            Ripple Fox combines intelligent project management tools with expert consulting to help your teams deliver exceptional results consistently. 
            We make project success achievable and repeatable.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#ffffff',
                color: RIPPLE_DARK,
                fontWeight: 700,
                px: 5,
                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
              }}
            >
              See Our Platform
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.7)',
                color: '#ffffff',
                '&:hover': { borderColor: '#ffffff', background: 'rgba(255,255,255,0.1)' },
              }}
            >
              Client Success Stories
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 10 } }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  background: cardBackground,
                  border: cardBorder,
                  transition: 'all 0.35s ease',
                  boxShadow: isDark ? '0 25px 80px rgba(0,0,0,0.45)' : '0 25px 80px rgba(13,14,21,0.08)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: isDark
                      ? `0 35px 100px ${alpha(RIPPLE_BRIGHT, 0.35)}`
                      : `0 35px 90px ${alpha(RIPPLE_BRIGHT, 0.2)}`,
                    borderColor: alpha(RIPPLE_BRIGHT, 0.5),
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: alpha(feature.accent || RIPPLE_BRIGHT, 0.18),
                        color: feature.accent || RIPPLE_BRIGHT,
                        fontSize: 36,
                        boxShadow: `inset 0 0 12px ${alpha('#000', 0.08)}`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Chip
                      label={feature.badge}
                      size="small"
                      sx={{
                        backgroundColor: alpha(RIPPLE_BRIGHT, 0.15),
                        color: RIPPLE_BRIGHT,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: cardTitleColor }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Final Highlight Section */}
        <Box
          component="section"
          sx={{
            background: isDark
              ? `linear-gradient(135deg, ${alpha(RIPPLE_DARK, 0.6)}, ${alpha(RIPPLE_MID, 0.4)})`
              : `linear-gradient(135deg, ${alpha(RIPPLE_BRIGHT, 0.12)}, ${alpha(RIPPLE_BRIGHT, 0.05)})`,
            borderRadius: 4,
            p: { xs: 4, md: 7 },
            boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,165,223,0.15)',
            backdropFilter: isDark ? 'blur(12px)' : 'none',
            border: `1px solid ${alpha(RIPPLE_BRIGHT, isDark ? 0.25 : 0.15)}`,
          }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, color: headingColor }}>
                Designed for Project Leaders Who Deliver Results
              </Typography>
              <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)', lineHeight: 1.8, mb: 4 }}>
                Ripple Fox brings project management and strategic advisory together. We combine powerful tools with expert guidance so your team can focus on what matters: delivering successful projects that drive business value.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: RIPPLE_BRIGHT,
                    color: '#fff',
                    fontWeight: 700,
                    px: 5,
                    boxShadow: `0 8px 24px ${alpha(RIPPLE_BRIGHT, 0.4)}`,
                    '&:hover': { backgroundColor: RIPPLE_MID },
                  }}
                >
                  Book a live tour
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: isDark ? 'rgba(255,255,255,0.5)' : RIPPLE_BRIGHT,
                    color: isDark ? '#ffffff' : RIPPLE_BRIGHT,
                    '&:hover': {
                      borderColor: RIPPLE_BRIGHT,
                      background: alpha(RIPPLE_BRIGHT, 0.08),
                    },
                  }}
                >
                  See customer examples
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {statHighlights.map((stat) => (
                  <Grid item xs={12} sm={4} key={stat.label}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          mb: 1,
                          color: RIPPLE_BRIGHT,
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)' }}>
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