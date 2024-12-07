"use client";

import SimpleLayout from 'layout/SimpleLayout';
import FooterBlock from 'sections/landing/FB';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from "next/navigation"
import Alert from 'themes/overrides/Alert';

type DocumentType = {
  idoc_code?: string;
  idoc_name: string;
  level: 'Primary' | 'Secondary';
  points: number;
};

const Landing = () => {
  const [minDocs, setMinDocs] = useState<number | ''>('');
  const [minPoints, setMinPoints] = useState<number | ''>('');
  const [selectedDocs, setSelectedDocs] = useState<DocumentType[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [documentPoints, setDocumentPoints] = useState<Record<string, number>>({});
  const [documentLevel, setDocumentLevel] = useState<Record<string, 'Primary' | 'Secondary'>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);

  const [isModal2Open, setIsModal2Open] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const totalPages = Math.ceil(documents.length / rowsPerPage);
  //const currentData = documents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const [newDocument, setNewDocument] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [refreshDocuments, setRefreshDocuments] = useState<boolean>(false); // New state for triggering re-fetch

  const itemsPerPage = 4; // Adjust based on your needs
  const currentData = selectedDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const router = useRouter();

  const handleAddDocument = () => {
    setShowModal(true); // Show modal instead of prompt
  };

  const handleEditClick = () => {
    router.push('/sites/docEdit');
  };


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



  // Define the API call function _________ API integration of add doc

  const handleConfirmAdd = async () => {


    try {

      const { primaryData } = authData.data;
      const authorizationToken = primaryData?.authorization; // Authorization token from primaryData

      // Make the API call using fetch or axios
      const response = await fetch('https://hion-documents/create', {
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


  const handleApply = () => {
    setIsModalOpen(true);
  };

  const handleModalApply = () => {
    // Process the selected documents with their updated details
    const processedDocs = selectedDocs.map((doc) => ({
      ...doc, // Spread the original doc to keep its idoc_name and idoc_code
      level: documentLevel[doc.idoc_name] || 'Primary', // Default to 'Primary' if not set
      points: documentPoints[doc.idoc_name] || 0, // Default to 0 points if not set
    }));

    // Log the processedDocs in a more readable format
    console.log('Applied Configuration:', processedDocs);
    //alert(JSON.stringify(processedDocs, null, 2)); // Display nicely formatted data in the alert

    // Update the selectedDocs with the newly processed documents
    setSelectedDocs(processedDocs);

    // Close modal after applying
    setIsModalOpen(false);
  };



  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (name: string) => {
    setDocuments(documents.filter((doc) => doc.idoc_name !== name));
  };

  const handleChangePoint = (e: React.FormEvent, name: string) => {
    e.preventDefault();  // Prevents form from submitting automatically

    if (editingDoc === name) {
      setEditingDoc(null);
    } else {
      setEditingDoc(name);
    }
  };


  // Define handleCancelEdit function to reset the editingDoc state
  const handleCancelEdit = (docName: string) => {
    // Reset editingDoc to cancel edit mode for the specific document
    setEditingDoc(null);
  };


  // -------------------------- SUBMIT and POP UP part ---------------------------------//

  const [storedJson, setStoredJson] = useState<any>(null); // Store the JSON data


  // Handle submit action (opens modal)
  const handleSubmit = () => {
    // Prepare the data with the appropriate structure for the API
    const docDetails = {
      idoc_codes: selectedDocs.map((doc) => doc.idoc_code), // Array of document codes
      vidoc_types: selectedDocs.map((doc) => doc.level === 'Primary' ? 'primary' : 'secondary'), // Array of document types
      vidoc_nbPoints: selectedDocs.map((doc) => doc.points), // Array of document points
      vidoc_isRequireds: selectedDocs.map(() => 0), // Array of isRequired (set to 0 for now, adjust as needed)
    };

    // Store the formatted JSON data in the state
    setStoredJson(docDetails);

    // Convert the array to a JSON string for debugging or confirmation
    const jsonString = JSON.stringify(docDetails, null, 2);

    // Show the JSON string in an alert for confirmation
    //alert(jsonString);

    // Show the confirmation modal when submit is clicked (assuming you have a modal)
    setIsModal2Open(true); // This should open the modal in your app
  };

  // Handle modal cancellation
  const handleCancelSubmit = () => {
    setIsModal2Open(false); // Close the modal if the user cancels
  };

  // Handle Confirm Submit (sending to API)
  const handleConfirmSubmit = async () => {
    if (!storedJson) {
      toast.error('No data to submit!');
      return;
    }

    // Prepare the data to send to the API (using the structured data from storedJson)
    const payload = {
      vlvl_minNbPoint: minPoints, // Use the fetched value for minimum points
      vlvl_minNbPrimaryDoc: minDocs, // Use the fetched value for minimum primary documents
      idoc_codes: storedJson.idoc_codes, // Array of document codes
      vidoc_types: storedJson.vidoc_types, // Array of document types (primary, secondary)
      vidoc_nbPoints: storedJson.vidoc_nbPoints, // Array of points
      vidoc_isRequireds: storedJson.vidoc_isRequireds, // Array of isRequired flags
    };

    try {
      // Make the API request
      const response = await axios.post(
        'httsystem-configs/create', //replace with or environment token
        payload,
        {
          headers: {
            Authorization: 'Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f', // Replace with sessionStored 
            'COMPANY-CODE': 'def-mc-admin',
            'FRONTEND-KEY': 'XXX',
            'TARGET-COMPANY-CODE': 'MC-H3HBRZU6ZK5744S',
          },
        }
      );

      // Success response - Show success toast
      const successMessage = response.data?.data?.primaryData?.msg || 'Point system successfully created!';
      toast.success(successMessage);
    } catch (error) {
      // Error handling: Show failure toast with error details
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.data?.primaryData?.msg || 'Failed to create point system.';
        toast.error(errorMessage);
        console.error('Axios Error:', error.response?.data);
      } else {
        toast.error('An unexpected error occurred.');
        console.error('Unexpected Error:', error);
      }
    }
  };

  // ------------------------------- END of SUBMIT update ----------------------------//


  // Todo- Remove
  const handlePointUpdate = (name: string, points: number) => {
    setDocuments(
      documents.map((doc) => (doc.idoc_name === name ? { ...doc, points } : doc))
    );
    setEditingDoc(null);
  };


  const buttonClasses = "px-6 py-2 rounded-lg transition focus:outline-none";
  const applyButtonStyles = `${buttonClasses} w-full bg-blue-500 text-white hover:bg-blue-600`;

  return (
    <SimpleLayout>
      <ToastContainer />

    {/* Divine Configuration Interface */}
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-10 rounded-3xl shadow-xl mb-12 w-full max-w-3xl mx-auto animate-fadeInSlow transform scale-105">

      {/* Celestial Header */}
      <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-8">
        Configuration of the Point System
      </h2>

      {/* Divine Input Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col min-w-[250px]">
          <label htmlFor="min-docs" className="font-semibold text-lg text-indigo-800">
            1. Minimum Required Primary Documents
            <i className="ml-2 cursor-pointer text-indigo-400 hover:text-indigo-600 transition-all duration-300 ease-in-out" title="Primary means one must provide this as a must-do, while secondary means optional.">?</i>
          </label>
          <input
            id="min-docs"
            type="number"
            value={minDocs}
            onChange={(e) => setMinDocs(Number(e.target.value))}
            className="bg-gradient-to-r from-indigo-100 to-blue-50 border-2 border-blue-300 p-3 rounded-lg w-full shadow-inner focus:ring-4 focus:ring-indigo-500 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out"
          />
        </div>
        <div className="flex flex-col min-w-[250px]">
          <label htmlFor="min-points" className="font-semibold text-lg text-indigo-800">
            2. Minimum Required Points for all the Documents
            <i className="ml-2 cursor-pointer text-indigo-400 hover:text-indigo-600 transition-all duration-300 ease-in-out" title="You will score each document type and your customer must provide enough documents for this score to be met">?</i>
          </label>
          <input
            id="min-points"
            type="number"
            value={minPoints}
            onChange={(e) => setMinPoints(Number(e.target.value))}
            className="bg-gradient-to-r from-indigo-100 to-blue-50 border-2 border-blue-300 p-3 rounded-lg w-full shadow-inner focus:ring-4 focus:ring-indigo-500 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      {/* Divine Document Selection Dropdown */}
      <label htmlFor="doc-select" className="block mb-4 font-semibold text-lg text-indigo-800">Select Document Type</label>
      <div className="flex items-center mb-6">
        <select
          onChange={(e) => {
            const docCode = e.target.value;
            const docName = e.target.options[e.target.selectedIndex].text;

            // Check if the document is already selected by its code
            if (docCode && !selectedDocs.some((doc) => doc.idoc_code === docCode)) {
              // Add the document with a valid level and points
              const newDoc: DocumentType = {
                idoc_name: docName,
                idoc_code: docCode,
                level: 'Primary',  // Set 'Primary' as the default, or adjust this as needed
                points: 0,         // Default points (adjust as needed)
              };

              // Update the selectedDocs state
              setSelectedDocs((prevDocs) => [...prevDocs, newDoc]);
            }
          }}
          className="bg-gradient-to-r from-indigo-100 to-blue-50 border-2 border-blue-300 p-3 rounded-l-lg w-full shadow-inner transition-all focus:ring-4 focus:ring-indigo-500 hover:shadow-xl"
        >
          <option value="">Choose a document</option>

        </select>

        {/* Add Document Button */}
        <button
          onClick={handleAddDocument}
          className="px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition-all"
        >
          Add
        </button>

        {/* Edit Button */}
        <button
          onClick={handleEditClick}
          className="px-6 py-3 rounded-md bg-gray-600 text-white font-semibold shadow-sm hover:bg-gray-700 transition-all ml-4"
        >
          Edit
        </button>

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
                  className="px-6 py-3 rounded-md bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 transition-all"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
            <ToastContainer />
          </div>
        )}

      </div>

      {/* Heavenly Selected Documents with Apply Button */}
      <div className="mb-6">
        <div className="flex gap-3 flex-wrap mb-4">
          {selectedDocs.map((doc) => (
            <span
              key={doc.idoc_code}
              title={`Code: ${doc.idoc_code}`} // Tooltip to display idoc_code
              className="bg-gradient-to-r from-blue-200 to-blue-400 px-4 py-2 rounded-full text-indigo-800 font-semibold shadow-md hover:scale-105 transform transition-all cursor-pointer"
              onClick={() =>
                setSelectedDocs(selectedDocs.filter((d) => d.idoc_code !== doc.idoc_code))
              }
            >
              {doc.idoc_name} ✕
            </span>
          ))}
        </div>
        <div className="flex justify-center">
        <button
          onClick={handleApply}
          className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-all"
        >
          Apply
        </button>
        </div>
      </div>
    </div>



      {/* Majestic Enhanced Modal for Document Level and Points Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50 transition-opacity duration-500 ease-out">
          <div className="bg-white p-8 rounded-xl shadow-xl w-[32rem] max-h-[85vh] overflow-y-auto border-2 border-gray-300 backdrop-blur-md">
            <h3 className="font-semibold text-3xl mb-6 text-gray-800 text-center">
              Document Settings
            </h3>

            {selectedDocs.map((doc) => (
              <div key={doc.idoc_code} className="mb-8">
                <h4
                  className="font-semibold text-lg text-gray-700 mb-4"
                  title={`Code: ${doc.idoc_code}`} // Tooltip showing `idoc_code`
                >
                  {doc.idoc_name}
                </h4>

                {/* Document Level Buttons */}
                <div className="flex items-center gap-6 mb-6">
                  <label className="text-gray-600 font-semibold">Level:</label>
                  <button
                    onClick={() =>
                      setDocumentLevel({ ...documentLevel, [doc.idoc_name]: 'Primary' })
                    }
                    className={`px-6 py-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${documentLevel[doc.idoc_name] === 'Primary'
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    Primary
                  </button>
                  <button
                    onClick={() =>
                      setDocumentLevel({ ...documentLevel, [doc.idoc_name]: 'Secondary' })
                    }
                    className={`px-6 py-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${documentLevel[doc.idoc_name] === 'Secondary'
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    Secondary
                  </button>
                </div>

                {/* Points Input */}
                <div>
                  <label className="font-semibold text-gray-600 block mb-2">Points:</label>
                  <input
                    type="number"
                    value={documentPoints[doc.idoc_name] || ''}
                    onChange={(e) =>
                      setDocumentPoints({
                        ...documentPoints,
                        [doc.idoc_name]: Number(e.target.value),
                      })
                    }
                    className="border border-gray-300 p-4 rounded-md w-full mt-2 text-gray-800 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter points"
                  />
                </div>
              </div>
            ))}

            {/* Modal Footer Buttons */}
            <div className="flex justify-end gap-6 mt-8">
              <button
                onClick={handleModalCancel}
                className="px-6 py-3 rounded-md bg-gray-200 text-gray-600 font-semibold shadow-sm hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleModalApply}
                className="px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional CSS Styles for Animation */}
      <style jsx>{`
        @keyframes pulse-slow {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>





      {/* Table of Document Configurations with Pagination */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl shadow-xl mx-auto w-full max-w-6xl">
        <h3 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Configuration Summary
        </h3>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

        {/* Responsive Table Container */}
        <div className="overflow-x-auto w-full rounded-xl border border-gray-300 shadow-md">
          <table className="min-w-full bg-white border-collapse rounded-lg shadow-sm">
            <thead className="bg-indigo-600 text-white text-lg">
              <tr>
                <th className="p-6 text-left">Document Name</th>
                <th className="p-6 text-left">Document Level</th>
                <th className="p-6 text-left">Points</th>
                <th className="p-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedDocs.map((doc) => (
                <tr
                  key={doc.idoc_code ?? doc.idoc_name}
                  className="transition-all duration-300 transform hover:bg-gray-100 hover:shadow-md"
                >
                  <td className="p-6 text-gray-700 font-medium">
                    <div className="flex items-center">
                      <span>{doc.idoc_name}</span>
                      <span className="text-sm text-gray-500 ml-2">{doc.idoc_code}</span>
                    </div>
                  </td>
                  <td className="p-6 text-gray-700">
                    <span className="font-semibold">{doc.level}</span>
                  </td>
                  <td className="p-6">
                    {editingDoc === doc.idoc_name ? (
                      <input
                        type="number"
                        value={doc.points}
                        onChange={(e) => handlePointUpdate(doc.idoc_name, Number(e.target.value))}
                        className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    ) : (
                      <span className="text-gray-700 font-semibold">{doc.points}</span>
                    )}
                  </td>
                  <td className="p-6 text-center">
                    {editingDoc === doc.idoc_name ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleChangePoint(e, doc.idoc_name)}
                          className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-all"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => handleCancelEdit(doc.idoc_name)}
                          className="px-6 py-3 rounded-md bg-gray-400 text-white font-semibold shadow-sm hover:bg-gray-500 transition-all ml-3"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleChangePoint(e, doc.idoc_name)}
                        className="px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition-all"
                      >
                        Change Points
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doc.idoc_name)}
                      className="px-6 py-3 rounded-md bg-red-500 text-white font-semibold shadow-sm hover:bg-red-600 transition-all ml-3"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-gray-300 text-white rounded-md font-semibold shadow-sm disabled:opacity-50 hover:bg-gray-400 transition-all"
          >
            Prev
          </button>

          <span className="text-xl font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold shadow-sm hover:bg-green-700 transition-all"
          >
            Submit
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-gray-300 text-white rounded-md font-semibold shadow-sm disabled:opacity-50 hover:bg-gray-400 transition-all"
          >
            Next
          </button>
        </div>

        {/* Confirmation Modal */}
        {isModal2Open && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h4 className="text-lg font-semibold mb-4">Are you sure?</h4>
              <p className="mb-6 text-gray-700">Please confirm if you want to submit this configuration.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCancelSubmit}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>





      {/* FIXED Header and Action Buttons To-Do to import the app name*/}
      <div className="relative flex flex-col items-center bg-[url('/images/nebula-background.png')] bg-cover bg-center p-10 my-8 rounded-3xl shadow-xl w-full overflow-hidden">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white mb-6 relative text-center">
          'Application' Setting
          <span className="absolute inset-0 bg-gradient-to-r from-white to-silver opacity-15 blur-md transform scale-105 animate-pulse" />
        </h2>

        <div className="flex gap-6 mb-6">
          <button className={`relative overflow-hidden px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-green-500 to-green-600 text-white`}>
            Save
          </button>

          <button className={`relative overflow-hidden px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-blue-500 to-blue-600 text-white`}>
            Deploy
          </button>

          <button className={`relative overflow-hidden px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-gray-500 to-gray-600 text-white`}>
            Cancel
          </button>
        </div>

        {/* Silver Particles */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
          <div className="silver-particle"></div>
          <div className="silver-particle"></div>
          <div className="silver-particle"></div>
          <div className="silver-particle"></div>
          <div className="silver-particle"></div>
        </div>
      </div>

      <style jsx>{`
  h2 {
    position: relative;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  h2::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(255, 0, 0, 0.1), rgba(0, 0, 255, 0.1));
    filter: blur(10px);
    z-index: -1;
    animation: smoothPulse 2.5s infinite ease-in-out;
  }

  @keyframes smoothPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.02);
      opacity: 0.5;
    }
  }

  /* Silver Particles */
  .silver-particle {
    position: absolute;
    top: -10%; /* Start above the container */
    width: 5px; /* Width of the particle */
    height: 5px; /* Height of the particle */
    border-radius: 50%; /* Make it circular */
    background: linear-gradient(to bottom, rgba(192, 192, 192, 1), rgba(192, 192, 192, 0));
    animation: fall linear infinite;
    z-index: 1; /* Ensure particles are above the background */
  }

  @keyframes fall {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh); /* Fall to the bottom of the viewport */
      opacity: 0;
    }
  }

  /* Randomize the particles */
  .silver-particle:nth-child(1) {
    left: 10%; 
    animation-duration: 3s;
    animation-delay: 0s;
  }

  .silver-particle:nth-child(2) {
    left: 30%;
    animation-duration: 4s;
    animation-delay: 0.5s;
  }

  .silver-particle:nth-child(3) {
    left: 50%;
    animation-duration: 2.5s;
    animation-delay: 1s;
  }

  .silver-particle:nth-child(4) {
    left: 70%;
    animation-duration: 3.5s;
    animation-delay: 1.5s;
  }

  .silver-particle:nth-child(5) {
    left: 90%;
    animation-duration: 4.5s;
    animation-delay: 2s;
  }
`}</style>


      <FooterBlock />
    </SimpleLayout>
  );
};

export default Landing;
