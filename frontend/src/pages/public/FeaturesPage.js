import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';

const features = [
  {
    title: 'Advanced Analytics',
    description: 'Get real-time insights and data-driven decision making with our advanced analytics platform.'
  },
  {
    title: 'Global Network',
    description: 'Connect with our global network of partners and clients across multiple industries.'
  },
  {
    title: 'Innovation',
    description: 'Stay ahead with cutting-edge technology and innovative solutions.'
  },
  {
    title: 'Security',
    description: 'Enterprise-grade security to protect your data and operations.'
  },
  {
    title: 'Sustainability',
    description: 'Commitment to sustainable and responsible business practices.'
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your business needs.'
  }
];

const FeaturesPage = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
          Our Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesPage;
