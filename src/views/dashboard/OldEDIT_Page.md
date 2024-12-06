import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const fetchDocuments = async () => {
      const url = 'https://lawonearth.co.uk/api/back-office/core/identification-documents';
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
      
      const url = `${baseUrl}/api/back-office/core/identification-documents/update/${selectedDoc.idoc_code}`;
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
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Compare Documents</h1>

      <div className="overflow-x-auto bg-gradient-to-r from-indigo-50 via-blue-50 to-white p-6 rounded-xl shadow-lg">
        <table className="min-w-full table-auto bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Document Name</th>
              <th className="py-3 px-6 text-left">Document Code (IDOC)</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-left">Updated At</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.idoc_code} className="border-b hover:bg-indigo-50 transition-colors">
                <td className="py-3 px-6 text-gray-700">{doc.idoc_name}</td>
                <td className="py-3 px-6 text-gray-700 font-mono">{doc.idoc_code}</td>
                <td className="py-3 px-6 text-gray-500">{new Date(doc.idoc_createdAt).toLocaleString()}</td>
                <td className="py-3 px-6 text-gray-500">{new Date(doc.idoc_updatedAt).toLocaleString()}</td>
                <td className="py-3 px-6 text-gray-500">
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
