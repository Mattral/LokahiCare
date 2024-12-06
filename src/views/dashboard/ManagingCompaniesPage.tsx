// ManagingCompaniesPage.tsx

'use client'; // Client-side component

import { FC } from 'react';
import useManagingCompanies from './useManagingCompanies'; // Import the custom hook

const ManagingCompaniesPage: FC = () => {
  const { companies, isLoading, error, refetch } = useManagingCompanies();

  return (
    <div>
      <h1>Managing Companies</h1>

      {/* Button to re-fetch data */}
      <button onClick={refetch}>Re-fetch Data</button>

      {/* Loading state */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p> // Display error message
      ) : (
        <>
          <h2>Companies List:</h2>
          <ul>
            {companies.length > 0 ? (
              companies.map((company) => (
                <li key={company.mc_code}>
                  <strong>{company.mc_name}</strong> ({company.mc_code}) - {company.mc_status}
                  {/* Display the mc_logo if available */}
                  {company.mc_logo ? (
                    <div>
                      <img src={company.mc_logo} alt={`${company.mc_name} Logo`} width={100} />
                    </div>
                  ) : (
                    <p>No logo available</p> // Placeholder if no logo exists
                  )}
                </li>
              ))
            ) : (
              <p>No companies found.</p> // Display message if no companies are found
            )}
          </ul>

          {/* Displaying the companies as JSON for reuse elsewhere */}
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(companies, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default ManagingCompaniesPage;
