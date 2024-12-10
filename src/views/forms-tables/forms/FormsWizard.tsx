// MATERIAL - UI
import Grid from '@mui/material/Grid';

// PROJECT IMPORTS
///import BasicWizard from 'sections/forms/wizard/basic-wizard';
//import ValidationWizard from 'sections/forms/wizard/validation-wizard';
import MultiStepForm from 'sections/forms/wizard/Configure-wizard'
// ==============================|| FORMS WIZARD ||============================== //

const FormsWizardPage = () => (
  <Grid container spacing={2.5} justifyContent="center">
    <div className="mb-6">
      <h2 className="text-3xl font-semibold leading-snug text-gray-800 transition-all duration-500 hover:text-blue-600 text-center">
        Submit documents <span className="text-indigo-600 font-bold">to provide Medical Services</span> <br />
      </h2>
    </div>

    <Grid item xs={12} md={6} lg={7}>

      <MultiStepForm />
    </Grid>

  </Grid>
);

export default FormsWizardPage;
