import React, { useEffect, useState } from 'react';

// Helper function to format document names (inserting spaces where needed)
const formatDocumentNames = (name: string) => {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2'); // Adds space before capital letters
};

interface DocumentOptionsProps {
  refreshDocuments: boolean;
  selectedDocs: string[]; // Array of selected document names
}

interface DocumentOption {
  idoc_name: string;
  idoc_code: string;
}

const DocumentOptions: React.FC<DocumentOptionsProps> = ({ refreshDocuments, selectedDocs }) => {
  const [documentOptions, setDocumentOptions] = useState<DocumentOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------- AUTH KEY ------------------------//
  // State to hold user profile data
  const [authData, setAuthData] = useState<any | null>(null);

  useEffect(() => {
    // Retrieve auth data from localStorage
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      try {
        const parsedData = JSON.parse(storedAuthData);
        setAuthData(parsedData);
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    } else {
      console.error('No authentication data found in localStorage');
    }
  }, []);
  // --------------------- END AUTH KEY ---------------------//

  // Fetch document list from API
  useEffect(() => {
    if (authData && authData.data) {
      const { primaryData } = authData.data;
      const authorizationToken = primaryData?.authorization; // Authorization token from primaryData

      const fetchDocuments = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await fetch('https://lawonearth.co.uk/api/back-office/core/identification-documents', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authorizationToken}`,
              'COMPANY-CODE': 'def-mc-admin',
              'FRONTEND-KEY': 'XXX',
              'TARGET-COMPANY-CODE': 'MC-H3HBRZU6ZK5744S',
              'PaginateResults': '1',
              'MaxResultsPerPage': '12',
              'X-Requested-With': 'XMLHttpRequest',
            },
          });

          const data = await response.json();

          if (data.status === 'treatmentSuccess') {
            // Map both idoc_name and idoc_code to the document options
            const docs = data.data.primaryData._idocuments.data.map((doc: { idoc_name: string, idoc_code: string }) => ({
              idoc_name: formatDocumentNames(doc.idoc_name), // Format the name
              idoc_code: doc.idoc_code, // Keep the original idoc_code
            }));
            setDocumentOptions(docs);
          } else {
            setError('Failed to load documents.');
          }
        } catch (err) {
          setError('Error fetching documents.');
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }
  }, [refreshDocuments, authData]); // Re-fetch when refreshDocuments or authData changes

  if (loading) {
    return <option>Loading...</option>;
  }

  if (error) {
    return <option>{error}</option>;
  }

  return (
    <>
      {documentOptions
        .filter((option) => !selectedDocs.includes(option.idoc_name)) // Filter out already selected documents
        .map((option) => (
          <option key={option.idoc_code} value={option.idoc_code}>
            {option.idoc_name}
          </option>
        ))}
    </>
  );
};

export default DocumentOptions;
