"use client";

import Hero from 'sections/landing/Header';
//import Apps from 'sections/landing/Apps';
// import ContactUs from 'sections/landing/ContactUs';<ContactUs />
import SimpleLayout from 'layout/SimpleLayout';

import AiChatbot from 'components/aiChat';
const Landing = () => {

  return (
    <SimpleLayout>
     
      <Hero/>
     <AiChatbot/>

    </SimpleLayout>
  );
};

export default Landing;
