"use client";
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
        <div className="text-center my-10 px-4">
            {/* Premium Styled Text */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold leading-snug text-gray-800 transition-all duration-500 hover:text-blue-600">
                    Unlock the full potential of data analysis with <span className="text-indigo-600 font-bold">effortless precision.</span> <br />
                    <span className="text-lg font-light text-gray-500">
                        Experience intuitive insights and seamless processing.
                    </span>
                </h2>
                <h3 className="text-xl font-medium leading-relaxed text-gray-700 mt-4">
                    This sophisticated platform is dedicated to processing the valuable datasets provided by our esteemed sponsor, <strong className="text-indigo-600">Milliman MedInsight</strong>. <br />
                    By proceeding, I provide my full consent to the complete deletion of all data following the conclusion of this event.
                </h3>
            </div>

            {/* Fallback link to the direct app if iframe doesn't load */}
            {!iframeLoaded && (
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-red-600">
                        We regret to inform you that the embedded content could not be loaded.
                    </h2>
                    <p className="text-lg font-light text-gray-600 mt-4">
                        You may still access the application directly by clicking the link below:
                    </p>
                    <a href="https://lokahi-care-analyst.streamlit.app/?embedded=true" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-lg font-medium mt-4">
                        Access the LokahiCare Application
                    </a>
                </div>
            )}

            <AiChatbot />

            {/* Embed the Streamlit app using an iframe */}
            <iframe
                src="https://lokahi-care-analyst.streamlit.app/?embedded=true"
                width="100%"
                height="800px"
                frameBorder="0"
                className="rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                onLoad={handleIframeLoad}  // Trigger onLoad event when iframe is successfully loaded
                onError={handleIframeError}  // Trigger onError event when iframe fails to load
            ></iframe>
        </div>
    );
};

export default EmbedPage;
