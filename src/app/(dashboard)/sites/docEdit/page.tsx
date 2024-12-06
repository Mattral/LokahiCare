"use client"; // This makes the component a Client Component

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardDefault from 'views/dashboard/siteDocEdit'; // Import the previous component

// Define the type for the configuration object
interface Config {
  headerText?: string;
  footerText?: string;
  // Add other fields as needed
}

const EditPage = () => {
  const { title } = useParams(); // Get dynamic route parameter
  
  const [config, setConfig] = useState<Config | null>(null); // Initialize with null
  const [loading, setLoading] = useState(true);

  // Fetch the site's configuration when the page loads
  useEffect(() => {
    if (title) {
      fetch(`/api/sites/${title}`)
        .then(response => response.json())
        .then(data => {
          setConfig(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching configuration:', error);
          setConfig({ headerText: '', footerText: '' }); // Updated to avoid default values in the UI
          setLoading(false);
        });
    } else {
      setConfig({ headerText: '', footerText: '' });
      setLoading(false);
    }
  }, [title]);

  if (loading) return <div>Loading...</div>;

  return (

      <DashboardDefault />

  );
};

export default EditPage;

//src/app/(dashboard)/sites/editVOI/docEdit/page.tsx