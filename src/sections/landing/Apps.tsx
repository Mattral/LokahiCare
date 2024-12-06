'use client';

import { useState } from 'react';

// MATERIAL - UI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// PROJECT IMPORTS
import FadeInWhenVisible from './Animation';

// THIRD - PARTY
import Slider from 'react-slick';

// ASSETS
const featureAIIntegration = '/images/feature-ai-integration.png'; // Add your own image
const featureVerifiedProfessionals = '/images/feature-verified-professionals.png'; // Add your own image
const featureAccessibleSecure = '/images/landing/feature-accessible-secure.png'; // Add your own image
const featureTailoredCare = '/images/feature-tailored-care.png'; // Add your own image

const Technologies = [
  {
    image: featureAIIntegration,
    title: 'Advanced AI Integration',
    description:
      'Cutting-edge AI technology enhances every aspect of your healthcare experience. From personalized recommendations to instant chatbot assistance, we bring innovation to healthcare.',
  },
  {
    image: featureVerifiedProfessionals,
    title: 'Verified Professionals',
    description:
      'Connect only with licensed and vetted healthcare experts. Your health is in safe, trustworthy hands.',
  },
  {
    image: featureAccessibleSecure,
    title: 'Accessible and Secure',
    description:
      'LōkahiCare is available 24/7, making healthcare accessible from anywhere in the world. Your data is protected with state-of-the-art security measures and compliance with privacy regulations like HIPAA.',
  },
  {
    image: featureTailoredCare,
    title: 'Tailored for You',
    description:
      'Enjoy personalized care plans, symptom tracking, and health reminders designed to meet your unique needs. Multilingual support ensures inclusivity for users from diverse backgrounds.',
  },
];

// ==============================|| LANDING - AppsPage ||============================== //

const AppsPage = () => {
  const theme = useTheme();

  const [state, setState] = useState(0);

  function handleChange(value: number) {
    setState(value);
  }

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box sx={{ bgcolor: 'primary.main' }}>
      <Container>
        <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ pt: { md: 10, xs: 2.5 }, pb: { md: 10, xs: 2.5 } }}>
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', marginBottom: 3 }}>
              <Grid item xs={12}>
                <Typography variant="h2" color="white">
                  Why Choose LōkahiCare?
                </Typography>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography color="white">
                  Discover the key reasons why LōkahiCare is the right choice for your healthcare needs:
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Grid container spacing={2.5} alignItems="center">
                  {Technologies.map((tech, index) => (
                    <Grid item xs={12} key={index}>
                      <FadeInWhenVisible>
                        <Button
                          onClick={() => {
                            handleChange(index);
                          }}
                          sx={{
                            padding: 4,
                            borderRadius: 1.5,
                            background: theme.palette.secondary.lighter + 20,
                            boxShadow: theme.customShadows.z1,
                          }}
                          variant="light"
                        >
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Typography variant="h4" color="white">
                                {tech.title}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography color="white">{tech.description}</Typography>
                            </Grid>
                          </Grid>
                        </Button>
                      </FadeInWhenVisible>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Slider {...settings}>
                  {Technologies.map((tech, index) => (
                    <Box key={index + state} sx={{ width: '100%', textAlign: 'center' }}>
                      <CardMedia component="img" image={tech.image} sx={{ width: '100%' }} />
                    </Box>
                  ))}
                </Slider>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AppsPage;
