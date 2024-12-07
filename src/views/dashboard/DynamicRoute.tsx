"use client";

import { useRef } from 'react';

// import ContactUs from 'sections/landing/ContactUs';<ContactUs />
import SimpleLayout from 'layout/SimpleLayout';

import FooterBlock from 'sections/landing/FB';
import AiChatbot from 'components/aiChat';

import FormsWizardPage from 'views/forms-tables/forms/FormsWizard'

const Landing = () => {

  return (
    <SimpleLayout>
      <FormsWizardPage/>
      <AiChatbot/>
      <FooterBlock />
    </SimpleLayout>
  );
};

export default Landing;

