'use client';

import React, { useState } from 'react';
import { Button } from '@material-tailwind/react'; // Assuming you have it configured
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false); // Track whether the help box is open or closed

  // Toggle the popup box visibility
  const toggleHelpModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Help Button (Sticky at Bottom Right) */}
      <button
        onClick={toggleHelpModal}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full cursor-pointer shadow-lg z-50 flex items-center justify-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
        style={{ fontSize: '1rem' }}
      >
        <span className="mr-2 font-medium text-lg">Help</span>
        <ArrowDropDownOutlinedIcon style={{ fontSize: '1.6rem' }} />
      </button>

      {/* Help Modal (Popup Box) */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 w-96 max-w-xs h-96 bg-white p-8 rounded-xl shadow-2xl z-50 overflow-y-auto transition-all transform duration-300 ease-in-out"
          style={{ fontSize: '0.875rem' }}
        >
          <div className="flex justify-between items-center mb-6">
            <p className="font-semibold text-xl text-gray-800">User Guide</p>
            <button
              onClick={toggleHelpModal}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>
          </div>

          {/* Content Section (Scrollable) */}
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              Welcome to the **Document Generator** tool! Here, you can create
              customized document templates that suit your business needs.
            </p>
            <p>
              <strong>Create Document Template</strong>: You can easily create a new document template by providing a title, description, and other details.
            </p>
            <p>
              <strong>View Template</strong>: Click **View** to preview how the document will appear to your users.
            </p>
            <p>
              <strong>Configure Document Flow</strong>: Add automation to your document generation process by clicking **Configure**.
            </p>
            <p>
              Finally, you can delete any document template you no longer need.
            </p>
            <p>
              This user guide will help you navigate the system, and ensure you’re able to create, preview, and manage document templates with ease.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpModal;
