"use client";

//import Hero from 'sections/landing/Header';
import Apps from 'sections/landing/Apps';
// import ContactUs from 'sections/landing/ContactUs';<ContactUs />
import SimpleLayout from 'layout/SimpleLayout';

import CreateWS from 'sections/landing/CreateWebServer';


const Landing = () => {

  return (
    <SimpleLayout>
     
      
      <CreateWS/>
      <Apps />

  

    </SimpleLayout>
  );
};

export default Landing;

