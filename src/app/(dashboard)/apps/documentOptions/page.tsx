'use client';
// PROJECT IMPORTS
import LocalStorageDashboard from 'views/dashboard/DocumentOptions';

// ==============================|| PRICING ||============================== //

const Dashboard = () => {
    // Dummy data for refreshDocuments and selectedDocs
    const refreshDocuments = true; // or false depending on your state logic
    const selectedDocs = []; // your selected documents list
  
    return <LocalStorageDashboard refreshDocuments={refreshDocuments} selectedDocs={selectedDocs} />;
  };

export default Dashboard;
