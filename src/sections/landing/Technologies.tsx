'use client';

// NEXT
import Link from 'next/link';

// MATERIAL - UI
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Links from '@mui/material/Link';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// MATERIAL-UI ICONS
import VideoCallIcon from '@mui/icons-material/VideoCall';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HealingIcon from '@mui/icons-material/Healing';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

// THIRD-PARTY
import { motion } from 'framer-motion';

// PROJECT IMPORTS
import FadeInWhenVisible from './Animation';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

// ASSETS
import { DocumentDownload, ExportSquare } from 'iconsax-react';

// Services Data
const services = [
  {
    icon: <VideoCallIcon sx={{ fontSize: 60, transition: '0.3s', '&:hover': { transform: 'scale(1.1)', color: '#4CAF50' } }} />, // Video call icon
    title: 'Video Consultations',
    description:
      'Users can schedule and attend video appointments with verified healthcare professionals across different specialties. The platform offers easy file and message sharing before and during consultations.',
  },
  {
    icon: <HealthAndSafetyIcon sx={{ fontSize: 60, transition: '0.3s', '&:hover': { transform: 'scale(1.1)', color: '#FF5722' } }} />, // Health and safety icon
    title: 'AI-Powered Chatbots',
    description:
      'AI-driven chatbots provide instant answers to common health-related questions. The platform includes a mental health chatbot for therapy and emotional support, as well as symptom checkers to guide users.',
  },
  {
    icon: <HealingIcon sx={{ fontSize: 60, transition: '0.3s', '&:hover': { transform: 'scale(1.1)', color: '#03A9F4' } }} />, // Diagnostic icon
    title: 'Disease Detection & Model Training',
    description:
      'Users can upload medical images for AI-powered disease detection. Healthcare professionals can also train AI models on the platform to improve diagnostics and continuously enhance the models.',
  },
  {
    icon: <QuestionAnswerIcon sx={{ fontSize: 60, transition: '0.3s', '&:hover': { transform: 'scale(1.1)', color: '#9C27B0' } }} />, // Chat icon
    title: 'Collaborative Whiteboards',
    description:
      'Interactive flowcharts or whiteboards can be used during video consultations to visually explain health conditions, treatment plans, and medical concepts, making complex ideas easier to understand.',
  },
];

// ==============================|| LANDING - ServicesPage ||============================== //

const ServicesPage = () => {
  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}>
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ textAlign: 'center', marginBottom: 3 }}>
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
                <Typography variant="h2">Our Healthcare Services</Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12}>
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
                <Typography variant="h5">Explore our comprehensive healthcare solutions designed for you.</Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3} alignItems="center">
            {services.map((service, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <FadeInWhenVisible>
                  <MainCard>
                    <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                      <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Badge badgeContent="NEW" color="error" variant="dot">
                            {service.icon}
                          </Badge>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {service.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>{service.description}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2} justifyContent="flex-start">
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="large"
                              startIcon={<ExportSquare />}
                              component={Link}
                              href="#"
                              target="_blank"
                              sx={{
                                fontWeight: 500,
                                bgcolor: 'secondary.light',
                                color: 'secondary.darker',
                                '&:hover': { color: 'secondary.lighter' },
                              }}
                            >
                              Details
                            </Button>
                          </Grid>
                          <Grid item>
                            <Links component={Link} href="#">
                              <IconButton
                                size="large"
                                shape="rounded"
                                color="secondary"
                                sx={{
                                  bgcolor: 'secondary.lighter',
                                  color: 'secondary.darker',
                                  '&:hover': { color: 'secondary.lighter', bgcolor: 'secondary.darker' },
                                }}
                              >
                                <DocumentDownload />
                              </IconButton>
                            </Links>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </FadeInWhenVisible>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServicesPage;
