'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ==============================|| ABOUT PANEL ||============================== //

const AboutPanel = () => {
  const title = 'About Lōkahi Care';

  const text = `LokahiCare combines the power of technology with the essence of compassionate care. Inspired by the Hawaiian principle of "Lōkahi" (harmony), our platform unites patients, healthcare professionals, and AI-driven solutions to create a balanced and equitable healthcare ecosystem. We strive to make quality care accessible to all, promoting better health outcomes worldwide.`;

  return (
    <Box
      sx={{
        p: 5,
        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(100,181,246,1) 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h2" align="center" mb={5} sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)', whiteSpace: 'pre-line' }}>
              {text}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                alt="Lokahi Care"
                src="/images/LokahiCare.png"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPanel;
