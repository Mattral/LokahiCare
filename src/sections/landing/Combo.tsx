'use client';

import { useState } from 'react';

// MATERIAL - UI
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { LinearProgress } from '@mui/material';
import { Divider } from '@mui/material';

// THIRD-PARTY
import { Chart } from 'react-google-charts';
import { motion } from 'framer-motion';

// PROJECT IMPORTS
import MainCard from 'components/MainCard';
import { ArrowUpward, Laptop, CloudQueue, Psychology } from '@mui/icons-material';

// ==============================|| MARKET ANALYSIS PAGE ||============================== //

const MarketAnalysis = () => {
  return (
    <Container>
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 10, mb: 10 }}
      >
        {/* Title Section */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: '3rem',
              }}
            >
              LokahiCare: Market Analysis
            </Typography>
            <Typography
              align="center"
              sx={{
                fontSize: '1.25rem',
                color: 'text.secondary',
                mt: 2,
                fontWeight: '500',
              }}
            >
              Discover the untapped opportunities and growth in AI-powered healthcare.
            </Typography>
          </motion.div>
        </Grid>

        {/* Global Digital Health Growth */}
        <Grid item xs={12} md={6}>
          <MainCard sx={{ padding: 3, boxShadow: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              Global Digital Health Growth
            </Typography>
            <Chart
              chartType="LineChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ['Year', 'Market Size ($ Billion)'],
                ['2022', 216.7],
                ['2023', 300],
                ['2025', 800],
                ['2030', 1500],
              ]}
              options={{
                title: 'Projected Growth of Global Digital Health Market (2022-2030)',
                curveType: 'function',
                hAxis: { title: 'Year' },
                vAxis: { title: 'Market Size ($ Billion)' },
                colors: ['#1E88E5'],
                backgroundColor: '#f5f5f5',
                fontSize: 12,
              }}
              height="400px"
              width="100%"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <ArrowUpward sx={{ color: 'green', marginRight: 1, fontSize: '2rem' }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                <strong>LokahiCare aligns with a market expected to grow nearly 7x in 8 years.</strong>
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        {/* Telemedicine Market Expansion */}
        <Grid item xs={12} md={6}>
          <MainCard sx={{ padding: 3, boxShadow: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              Telemedicine Market Expansion
            </Typography>
            <Chart
              chartType="LineChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ['Year', 'Market Size ($ Billion)'],
                ['2022', 67],
                ['2023', 90],
                ['2025', 250],
                ['2030', 396],
              ]}
              options={{
                title: 'Telemedicine Market Expansion (2022-2030)',
                curveType: 'function',
                hAxis: { title: 'Year' },
                vAxis: { title: 'Market Size ($ Billion)' },
                colors: ['#43A047'],
                backgroundColor: '#f5f5f5',
                fontSize: 12,
              }}
              height="400px"
              width="100%"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <ArrowUpward sx={{ color: 'green', marginRight: 1, fontSize: '2rem' }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                <strong>LokahiCare can capture a share of this 500% growth.</strong>
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        {/* AI in Healthcare Surge */}
        <Grid item xs={12} md={6}>
          <MainCard sx={{ padding: 3, boxShadow: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              AI in Healthcare Surge
            </Typography>
            <Chart
              chartType="LineChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ['Year', 'Market Size ($ Billion)'],
                ['2022', 15.4],
                ['2023', 20],
                ['2025', 50],
                ['2030', 100],
              ]}
              options={{
                title: 'AI in Healthcare Market Surge (2022-2030)',
                curveType: 'function',
                hAxis: { title: 'Year' },
                vAxis: { title: 'Market Size ($ Billion)' },
                colors: ['#FB8C00'],
                backgroundColor: '#f5f5f5',
                fontSize: 12,
              }}
              height="400px"
              width="100%"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <ArrowUpward sx={{ color: 'green', marginRight: 1, fontSize: '2rem' }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                <strong>LokahiCare’s AI-powered features tap into this market growing more than 6x.</strong>
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        {/* Emerging Markets Penetration */}
        <Grid item xs={12} md={6}>
          <MainCard sx={{ padding: 3, boxShadow: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              Emerging Markets Penetration
            </Typography>
            <Chart
              chartType="BarChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ['Region', 'Market Share (%)'],
                ['Asia', 30],
                ['Africa', 29],
                ['North America', 20],
                ['Europe', 21],
              ]}
              options={{
                title: 'Digital Health Penetration by Region (2022)',
                hAxis: { title: 'Region' },
                vAxis: { title: 'Market Share (%)' },
                colors: ['#8E24AA'],
                backgroundColor: '#f5f5f5',
                fontSize: 12,
              }}
              height="400px"
              width="100%"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Laptop sx={{ color: 'blue', marginRight: 1, fontSize: '2rem' }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                <strong>LokahiCare caters to over 50% of global emerging healthcare demand.</strong>
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        {/* Feature Expansion Potential */}
        <Grid item xs={12} md={6}>
          <MainCard sx={{ padding: 3, boxShadow: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              Feature Expansion Potential
            </Typography>
            <Chart
              chartType="ColumnChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ['Feature', '2023', '2030'],
                ['Wearables Integration', 27, 88],
                ['Predictive Analytics', 20, 35],
                ['Real-time Monitoring', 15, 25],
              ]}
              options={{
                title: 'Growth of Key Healthcare Features (2023-2030)',
                isStacked: true,
                hAxis: { title: 'Feature' },
                vAxis: { title: 'Market Share (%)' },
                colors: ['#1E88E5', '#FB8C00', '#43A047'],
                backgroundColor: '#f5f5f5',
                fontSize: 12,
              }}
              height="400px"
              width="100%"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CloudQueue sx={{ color: 'purple', marginRight: 1, fontSize: '2rem' }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                <strong>LokahiCare enables these growing needs with future-ready features.</strong>
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        {/* Partnership Success Rates */}
        <Grid item xs={12} md={6}>
          <MainCard sx={{ padding: 3, boxShadow: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              Partnership Success Rates
            </Typography>
            <Chart
              chartType="PieChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ['Sector', 'Percentage'],
                ['Hospitals', 70],
                ['NGOs', 15],
                ['Private Clinics', 15],
              ]}
              options={{
                title: 'Partnership Success Rates (2023)',
                slices: { 0: { offset: 0.1 }, 1: { offset: 0.1 }, 2: { offset: 0.1 }},
                colors: ['#43A047', '#FB8C00', '#1E88E5'],
                backgroundColor: '#f5f5f5',
                fontSize: 12,
              }}
              height="400px"
              width="100%"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Psychology sx={{ color: 'orange', marginRight: 1, fontSize: '2rem' }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                <strong>LokahiCare’s collaborative approach adapts well across healthcare ecosystems.</strong>
              </Typography>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MarketAnalysis;
