"use client";

//import Hero from 'sections/landing/Header';
//import Apps from 'sections/landing/Apps';
// import ContactUs from 'sections/landing/ContactUs';<ContactUs />
import SimpleLayout from 'layout/SimpleLayout';

import DashboardDomain3 from 'sections/landing/Demo2';
import AiChatbot from 'components/aiChat';
const Landing = () => {

  return (
    <SimpleLayout>
     
      
     <DashboardDomain3/>
     <AiChatbot/>

    </SimpleLayout>
  );
};

export default Landing;
