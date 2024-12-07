'use client';
import React, { useState } from 'react';
import AiChatbot from 'components/aiChat';

const EmbedPage = () => {
  const [iframeLoaded, setIframeLoaded] = useState(true); // State to track iframe load status

  // Function to handle iframe onLoad event
  const handleIframeLoad = () => {
    setIframeLoaded(true); // Set iframeLoaded to true when the iframe successfully loads
  };

  // Function to handle iframe onError event
  const handleIframeError = () => {
    setIframeLoaded(false); // Set iframeLoaded to false if the iframe fails to load
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      {/* Fallback link to the direct app if iframe doesn't load */}
      {!iframeLoaded && (
        <div>
          <h2>Sorry, the embedded content failed to load.</h2>
          <p>
            You can view the app directly by clicking the link below:
          </p>
          <a href="https://transfer-learning-web.vercel.app/" target="_blank" rel="noopener noreferrer">
            Go to LokahiCare App
          </a>
        </div>
      )}
      <AiChatbot/>
      {/* Embed the Streamlit app using an iframe */}
      <iframe 
        src="https://transfer-learning-web.vercel.app/"
        width="100%" 
        height="800px" 
        style={{ border: 'none', borderRadius: '8px' }}
        onLoad={handleIframeLoad}  // Trigger onLoad event when iframe is successfully loaded
        onError={handleIframeError}  // Trigger onError event when iframe fails to load
      ></iframe>
    </div>
  );
};

export default EmbedPage;


/*
// PROJECT IMPORTS
import Home from 'views/dashboard/Transfer';

// ==============================|| PRICING ||============================== //

const Dashboard = () => {

    return <Home />;
  };

export default Dashboard;
*/