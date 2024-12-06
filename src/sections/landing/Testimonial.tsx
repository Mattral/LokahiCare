'use client';

// MATERIAL - UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// THIRD - PARTY
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

// PROJECT IMPORTS
import FadeInWhenVisible from './Animation';
import MainCard from 'components/MainCard';

// ASSETS
import Avatar from 'components/@extended/Avatar';
const Avatar1 = '/assets/images/users/avatar-6.png'; // Example image, replace with relevant ones for services
const Avatar2 = '/assets/images/users/avatar-1.png'; // Example image, replace with relevant ones for services
const Avatar3 = '/assets/images/users/avatar-2.png'; // Example image, replace with relevant ones for services
const Avatar4 = '/assets/images/users/avatar-3.png'; // Example image, replace with relevant ones for services

// ================================|| SERVICES ITEMS ||================================ //
const ServiceItem = ({ service }: { service: { image: string; title: string; description: string } }) => (
  <MainCard sx={{ width: { xs: '300px', md: '420px' }, cursor: 'pointer', my: 0.2, mx: 1.5 }}>
    <Stack direction="row" alignItems="flex-start" spacing={2}>
      <Avatar alt="Service Icon" size="lg" src={service.image}></Avatar>
      <Stack>
        <Typography variant="h5">{service.title}</Typography>
        <Typography>{service.description}</Typography>
      </Stack>
    </Stack>
  </MainCard>
);

// ==============================|| LANDING - ServicesPage ||============================== //
const ServicesPage = () => {
  const services = [
    {
      image: Avatar1, // Replace with relevant icon or image for Video Consultations
      title: 'Video Consultations',
      description:
        'Schedule appointments with verified healthcare professionals across various specialties. Experience secure, high-quality video calls with easy file and message sharing for better communication.',
    },
    {
      image: Avatar2, // Replace with relevant icon or image for AI-Powered Chatbots
      title: 'AI-Powered Chatbots',
      description:
        'Get instant answers to common health-related queries. Access mental health support through our AI-powered therapist chatbot. Use symptom checkers to understand potential conditions and get guidance on the next steps.',
    },
    {
      image: Avatar3, // Replace with relevant icon or image for Disease Detection
      title: 'Disease Detection and Model Training',
      description:
        'Upload medical images for AI-driven analysis and disease detection. Train AI models directly on the platform by providing specific classifications like "Healthy" and "Disease." Empower healthcare professionals to create more accurate diagnostic tools.',
    },
    {
      image: Avatar4, // Replace with relevant icon or image for Collaborative Whiteboards
      title: 'Collaborative Whiteboards',
      description:
        'Use interactive flowcharts during video consultations for clear visual explanations. Collaborate with professionals to better understand complex health conditions or treatment plans.',
    },
  ];

  return (
    <>
      <Box sx={{ mt: { md: 15, xs: 2.5 } }}>
        <Container>
          <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2,
                }}
              >
                <Typography variant="h2">
                  Our{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    Services
                  </Box>
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4,
                }}
              >
                <Typography>
                  Explore our easy-to-use services designed to meet all your healthcare needs:
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ mb: { md: 10, xs: 2.5 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FadeInWhenVisible>
              <Marquee pauseOnHover gradient={false}>
                {services.map((service, index) => (
                  <ServiceItem key={index} service={service} />
                ))}
              </Marquee>
            </FadeInWhenVisible>
          </Grid>
          <Grid item xs={12}>
            <FadeInWhenVisible>
              <Marquee pauseOnHover direction="right" gradient={false}>
                {services.map((service, index) => (
                  <ServiceItem key={index} service={service} />
                ))}
              </Marquee>
            </FadeInWhenVisible>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ServicesPage;
