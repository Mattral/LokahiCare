// useManagingCompanies.ts

import { useState, useEffect } from 'react';

interface ManagingCompany {
  mc_code: string;
  mc_name: string;
  mc_status: string;
  mc_logo: string | null; // Include mc_logo as part of the data model
}

const useManagingCompanies = () => {
  const [companies, setCompanies] = useState<ManagingCompany[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManagingCompanies = async () => {
    const url = 'ack-office/core/apps';
    const headers = {
      'Authorization': 'Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f',
      'COMPANY-CODE': 'def-mc-admin',
      'FRONTEND-KEY': 'XXX',
      'PaginateResults': '1',
      'MaxResultsPerPage': '12',
      'X-Requested-With': 'XMLHttpRequest',
    };

    try {
      const response = await fetch(url, { method: 'GET', headers });
      const data = await response.json();

      if (response.ok && data?.data?.primaryData?._managingCompanies?.data) {
        const companiesData = data.data.primaryData._managingCompanies.data.map((company: any) => ({
          mc_code: company.mc_code,
          mc_name: company.mc_name,
          mc_status: company.mc_status,
          mc_logo: company.mc_logo || null, // Ensure mc_logo is included, even if null
        }));

        setCompanies(companiesData);
      } else {
        throw new Error('Data format is incorrect or no companies found.');
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching managing companies:', error);
      setError('Failed to fetch managing companies. Please try again later.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagingCompanies();
  }, []);

  return {
    companies,
    isLoading,
    error,
    refetch: fetchManagingCompanies, // Expose the refetch method
  };
};

export default useManagingCompanies;
