"use client";

import { useRef } from 'react';

// import ContactUs from 'sections/landing/ContactUs';<ContactUs />
import SimpleLayout from 'layout/SimpleLayout';

import FooterBlock from 'sections/landing/FB';

import FormsWizardPage from 'views/forms-tables/forms/FormsWizard'

const Landing = () => {

  return (
    <SimpleLayout>
      <FormsWizardPage/>

      <FooterBlock />
    </SimpleLayout>
  );
};

export default Landing;

