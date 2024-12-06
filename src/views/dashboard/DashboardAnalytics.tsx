"use client";

//import Hero from 'sections/landing/Header';
//import Apps from 'sections/landing/Apps';
// import ContactUs from 'sections/landing/ContactUs';<ContactUs />
import SimpleLayout from 'layout/SimpleLayout';
import CreateWS from 'sections/landing/CreateWebServer';
import Pricing1Page from 'views/price/Pricing1';
//import CreateNewApp from 'sections/landing/CreateNewApp';
//import DashboardDomain from 'sections/landing/AppCards';

import DashboardDomain from 'sections/landing/AppCards';
import DashboardDomain2 from 'sections/landing/demo';
import DashboardDomain3 from 'sections/landing/Demo2';
const Landing = () => {
  return (
    <SimpleLayout>
      <div style={{ marginBottom: '20px' }}>
        <DashboardDomain />
        <DashboardDomain2/>
        <DashboardDomain3/>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <CreateWS />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Pricing1Page />
        
      </div>
    </SimpleLayout>
  );
};

export default Landing;