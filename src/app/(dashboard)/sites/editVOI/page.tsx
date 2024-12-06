"use client"; // This makes the component a Client Component

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardDefault from 'views/dashboard/DynamicVOI'; // Import the previous component
import Payment from 'views/dashboard/PaymentDashboard';
import ActivityDomainPage from "views/dashboard/ActivityDomain";
import ExpertiseDomainPage from 'views/dashboard/ExpertiseDomain';
//
// Define the type for the configuration object
interface Config {
  headerText?: string;
  footerText?: string;
  // Add other fields as needed
}

const EditPage = () => {
  const { title } = useParams(); // Get dynamic route parameter
  const [activeTab, setActiveTab] = useState('clientVoI');

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

    <div className="tabs-container mb-8">
      <div className="flex space-x-6 border-b-2 border-gray-300">
        <button
          className={`px-6 py-2 text-lg font-semibold ${activeTab === 'clientVoI' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('clientVoI')}
        >
          Client VoI
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold ${activeTab === 'advisorVoI' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('advisorVoI')}
        >
          Advisor VoI
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold ${activeTab === 'payments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold ${activeTab === 'ActivityDomain' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('ActivityDomain')}
        >
          Activity Domain
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold ${activeTab === 'ExpertiseDomain' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('ExpertiseDomain')}
        >
          Expertise Domain
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'clientVoI' && (
          <div>
            {/* Client VoI Content */}
            <DashboardDefault />
          </div>
        )}

        {activeTab === 'advisorVoI' && (
          <div>
            {/* Advisor VoI Content */}
            <h3 className="text-xl font-semibold text-gray-800">Advisor VoI Content</h3>
            <Payment />
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            {/* Payments Content */}
            <h3 className="text-xl font-semibold text-gray-800">Here you can configure your payment methods.</h3>
            <Payment />
          </div>
        )}

        {activeTab === 'ActivityDomain' && (
          <div>
            {/* Payments Content */}
            <ActivityDomainPage />
          </div>
        )}

        {activeTab === 'ExpertiseDomain' && (
          <div>
            {/* Payments Content */}
            <ExpertiseDomainPage />
          </div>
        )}

      </div>
    </div>
     

  );
};

export default EditPage;
