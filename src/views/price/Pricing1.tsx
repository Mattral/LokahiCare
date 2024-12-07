'use client';

import { useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';

const initialPlans = [
  {
    active: false,
    title: 'Starter',
    description: 'For individual users who need basic access to consultations and health resources.',
    price: 0,
    permission: [0, 1, 2, 3, 4, 5]
  },
  {
    active: true,
    title: 'Standard',
    description: 'For healthcare professionals who need full access to all features, including AI tools and consultations.',
    price: 10,
    permission: [0, 1, 2, 3, 4, 5, 6, 7]
  },
];

const initialCommonTexts = [
  'Access to healthcare consultations',
  'Basic AI-powered health assistant',
  'Schedule and manage video calls',
  'File and message sharing before video calls',
  'AI-based disease detection from images',
  'Interactive whiteboard for visual aid',
  'Access to AI model training (Professional users)',
  'AI-powered therapist chatbot',
];

const Pricing1Page = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [timePeriod, setTimePeriod] = useState(true);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState(plans);
  const [commonTexts, setCommonTexts] = useState(initialCommonTexts);

  const handleClickOpen = () => {
    setFormValues(plans);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (index, field, value) => {
    if (field === 'commonText') {
      const updatedCommonTexts = [...commonTexts];
      updatedCommonTexts[index] = value;
      setCommonTexts(updatedCommonTexts);
    } else {
      const updatedPlans = [...formValues];
      updatedPlans[index] = { ...updatedPlans[index], [field]: value };
      setFormValues(updatedPlans);
    }
  };

  const handleSave = () => {
    setPlans(formValues);
    setOpen(false);
  };

  const priceStyle = {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 1.2,
    color: 'primary.main'
  };

  return (
    <Grid container spacing={3} sx={{ pt: 6 }}>
      {/* Header Section */}
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Access a range of tools to help you grow. Select the plan that best fits your needs.
        </Typography>
      </Grid>

      {/* Switch for Billing Period (Monthly/Yearly) */}
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
          <Typography variant="subtitle1" color={timePeriod ? 'textSecondary' : 'textPrimary'}>
            Billed Yearly
          </Typography>
          <Switch checked={timePeriod} onChange={() => setTimePeriod(!timePeriod)} inputProps={{ 'aria-label': 'billing period toggle' }} />
          <Typography variant="subtitle1" color={timePeriod ? 'textPrimary' : 'textSecondary'}>
            Billed Monthly
          </Typography>
        </Stack>
      </Grid>

      {/* Pricing Plans Grid */}
      <Grid item container spacing={3} xs={12} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MainCard sx={{ padding: 3, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
              {plan.active && (
                <Chip label="Popular" color="primary" sx={{ mb: 2 }} />
              )}
              <Typography variant="h5" sx={{ mb: 2 }}>
                {plan.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {plan.description}
              </Typography>

              {/* Price Display */}
              <Typography variant="h4" sx={priceStyle}>
                ${timePeriod ? plan.price : plan.price * 12}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {timePeriod ? 'Billed annually' : 'Billed monthly'}
              </Typography>

              <Button
                variant={plan.active ? 'contained' : 'outlined'}
                color={plan.active ? 'primary' : 'secondary'}
                fullWidth
                sx={{ mt: 2 }}
              >
                {plan.price === 0 ? 'Get Started' : 'Order Now'}
              </Button>

              {/* Features List */}
              <List sx={{ mt: 3, p: 0 }}>
                {plan.permission.map((perm, i) => (
                  <Fragment key={i}>
                    <ListItem sx={{ padding: '8px 0' }}>
                      <ListItemText
                        primary={commonTexts[i]}
                        sx={{ textAlign: 'left' }}
                      />
                    </ListItem>
                  </Fragment>
                ))}
              </List>
            </MainCard>
          </Grid>
        ))}
      </Grid>

      {/* Button to Edit Pricing Plans if needed */}
      <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
   
      </Grid>


    </Grid>
  );
};

export default Pricing1Page;
