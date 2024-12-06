import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Document {
  idoc_name: string;
  idoc_code: string;
  idoc_createdAt: string;
  idoc_updatedAt: string;
}

const CompareDocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [updatedDocName, setUpdatedDocName] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [refreshDocuments, setRefreshDocuments] = useState<boolean>(false); // New state for triggering re-fetch

  const handleAddDocument = () => {
    setShowModal(true); // Show modal instead of prompt
  };

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 5; // Set rows per page to 5

    //--------------------------- AUTH KEY ----------------------//

    // State to hold user profile data
    const [userData, setUserData] = useState<any | null>(null);

    // Fetching authorization data from localStorage
    const [authData, setAuthData] = useState<any | null>(null);

  useEffect(() => {
    // Retrieve auth data from localStorage
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      try {
        const parsedData = JSON.parse(storedAuthData);
        setAuthData(parsedData);
      } catch (error) {
        console.error("Failed to parse auth data:", error);
      }
    } else {
      console.error('No authentication data found in localStorage');
    }
  }, []);

  //-------------------- END OF AUTH KEY ______________________


  // -------------------------- API to add NEW DOC -----------------------

    // Define the API call function _________ API integration of add doc

    const handleConfirmAdd = async () => {

    
      try {
        
        const { primaryData } = authData.data;
        const authorizationToken = primaryData?.authorization; // Authorization token from primaryData
  
        // Make the API call using fetch or axios
        const response = await fetch('https://lawonearth.co.uk/api/back-office/core/identification-documents/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authorizationToken}`,
            'COMPANY-CODE': 'def-mc-admin',
            'FRONTEND-KEY': 'XXX',
            'TARGET-COMPANY-CODE': 'MC-H3HBRZU6ZK5744S',
          },
          body: new URLSearchParams({
            idoc_name: docName, // Send docName as part of the request payload
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.status === 'treatmentSuccess') {
          // If the request is successful
          const documentName = data.data.primaryData._idocument.idoc_name;
          toast.success(`Document "${documentName}" successfully created!`);
          setShowModal(false); // Close the modal after success
          setDocName(''); // Clear the input field
          
          // Trigger the refresh by setting refreshDocuments to true
          setRefreshDocuments(prev => !prev); // Toggle to re-trigger the effect
  
        } else if (data.status === 'validationError') {
          // Handle validation errors from the API
          const errorMessages = data.data.primaryData.errors.idoc_name || data.data.secondaryData.firstError;
          toast.error(`Error: ${errorMessages.join(', ')}`);
        } else {
          // Handle any other error response (e.g., unexpected API error)
          toast.error('Failed to create the document. Please try again.');
        }
      } catch (error) {
        // Handle any network or unexpected errors
        toast.error('An error occurred. Please check your network and try again.');
      }
    };
  
  
    // end of handle add API integration:



  useEffect(() => {
    const fetchDocuments = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://lawonearth.co.uk';  // Provide a fallback if needed

      const url = `${baseUrl}/api/back-office/core/identification-documents`;
      const headers = {
        'Authorization': 'Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f',
        'COMPANY-CODE': 'def-mc-admin',
        'FRONTEND-KEY': 'XXX',
        'TARGET-COMPANY-CODE': 'MC-H3HBRZU6ZK5744S',
        'PaginateResults': '1',
        'MaxResultsPerPage': '12',
        'X-Requested-With': 'XMLHttpRequest',
      };

      try {
        const response = await fetch(url, { method: 'GET', headers });
        const data = await response.json();

        if (data.status === 'treatmentSuccess') {
          setDocuments(data.data.primaryData._idocuments.data);
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
  }, []);

    // Logic to paginate the documents
    const indexOfLastDoc = currentPage * rowsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - rowsPerPage;
    const currentDocs = documents.slice(indexOfFirstDoc, indexOfLastDoc);

      // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(documents.length / rowsPerPage);

  const handleEditClick = (doc: Document) => {
    setSelectedDoc(doc);
    setUpdatedDocName(doc.idoc_name);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedDocName(e.target.value);
  };

  const handleSubmit = async () => {
    if (selectedDoc) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://lawonearth.co.uk';  // Provide a fallback if needed

      const url= `${baseUrl}/api/back-office/core/identification-documents/update/${selectedDoc.idoc_code}`;
      const headers = {
        'Authorization': 'Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f',
        'COMPANY-CODE': 'def-mc-admin',
        'FRONTEND-KEY': 'XXX',
        'TARGET-COMPANY-CODE': 'MC-H3HBRZU6ZK5744S',
      };

      const formData = new FormData();
      formData.append('idoc_name', updatedDocName); // Append the updated document name

      try {
        // Make the POST request to update the document
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
        });

        const result = await response.json();

        // Check if update was successful
        if (result.status === 'treatmentSuccess') {
          // Update the local state to reflect changes
          setDocuments((prevDocs) =>
            prevDocs.map((doc) =>
              doc.idoc_code === selectedDoc.idoc_code
                ? { ...doc, idoc_name: updatedDocName }
                : doc
            )
          );
          handleModalClose(); // Close the modal after successful update
        } else {
          setError('Failed to update the document.');
        }
      } catch (error) {
        setError('Error updating the document.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">Documents</h1>

        {/* Add Document Button */}
        <button
          onClick={handleAddDocument}
          className="bg-gradient-to-r from-purple-500 to-blue-700 text-white rounded-lg px-5 py-3 font-semibold hover:scale-110 transform transition duration-300 ease-in-out shadow-lg ring-2 ring-indigo-300"
        >
          <span className="material-icons">Add</span>
          
        </button>
      </div>

        {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform scale-105 transition duration-300 ease-in-out relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 text-center">
              Add a New Template
            </h2>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Enter document name..."
              className="w-full p-3 rounded-lg border border-gray-300 shadow-inner focus:ring-4 focus:ring-indigo-500 transition-all transform hover:scale-105"
            />
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleConfirmAdd} // Call the API function on click
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-110 transition duration-300 ease-in-out ring-4 ring-green-300"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
          
        </div>
      )}

<div className="overflow-x-auto bg-gradient-to-r from-indigo-50 via-blue-50 to-white p-6 rounded-xl shadow-lg">
      <ToastContainer />
      <table className="w-3/4 mx-auto table-auto bg-white rounded-lg overflow-hidden shadow-md">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-3 px-6 text-center">Document Name</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDocs.map((doc) => (
            <tr key={doc.idoc_code} className="border-b hover:bg-indigo-50 transition-colors">
              <td className="py-3 px-6 text-center text-gray-700">{doc.idoc_name}</td>
              <td className="py-3 px-6 text-center text-gray-500">
                <button
                  onClick={() => handleEditClick(doc)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-l-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>


      {/* Modal Popup for Editing */}
      {isModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Document</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="idoc_name" className="block text-gray-700">Document Name</label>
                <input
                  type="text"
                  id="idoc_name"
                  value={updatedDocName}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter new document name"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareDocumentsPage;
