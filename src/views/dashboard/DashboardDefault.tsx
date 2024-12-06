"use client";

import { useRef } from 'react';
import Hero from 'sections/landing/Header';
import Technologies from 'sections/landing/Technologies';
import Apps from 'sections/landing/Apps';

import SimpleLayout from 'layout/SimpleLayout';
import Pricing1Page from 'views/price/Pricing1';
import About from 'sections/landing/About';
import FooterBlock from 'sections/landing/FB';
import Header from 'layout/SimpleLayout/Header';// Adjust the import path as needed
import AiChatbot from 'components/aiChat';
import Testimonial from 'sections/landing/Testimonial';

const Landing = () => {
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const pricingRef = useRef(null);

  return (
    <SimpleLayout>

      <Header refs={{ aboutRef, servicesRef, pricingRef }} />
      <Hero />
      <Apps />
      <div ref={servicesRef}>
        <Technologies />
      </div>
      <div ref={pricingRef}>
        <Pricing1Page />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <AiChatbot />
      <Testimonial />

      <FooterBlock />
    </SimpleLayout>
  );
};

export default Landing;



