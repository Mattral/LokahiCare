"use client";

import SimpleLayout from 'layout/SimpleLayout';
import FooterBlock from 'sections/landing/FB';
import { useState } from 'react';

type DocumentType = {
  name: string;
  level: 'Primary' | 'Secondary';
  points: number;
};

const Landing = () => {
  const [minDocs, setMinDocs] = useState<number | ''>('');
  const [minPoints, setMinPoints] = useState<number | ''>('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [documentPoints, setDocumentPoints] = useState<Record<string, number>>({});
  const [documentLevel, setDocumentLevel] = useState<Record<string, 'Primary' | 'Secondary'>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const totalPages = Math.ceil(documents.length / rowsPerPage);
  const currentData = documents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const documentOptions = [
    "Green Card",
    "National ID Card",
    "Passport",
    "Driving License",
    "Employment Certificate",
    "Bachelor",
    "Diploma"
  ];

  const handleApply = () => {
    setIsModalOpen(true);
  };

  const handleModalApply = () => {
    const newDocuments = selectedDocs.map((doc) => ({
      name: doc,
      level: documentLevel[doc] || 'Secondary',
      points: documentPoints[doc] || 0,
    }));
    setDocuments(newDocuments);
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (name: string) => {
    setDocuments(documents.filter((doc) => doc.name !== name));
  };

  const handleChangePoint = (name: string) => {
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
  // Optionally, reset any temporary changes made to doc.points here if needed
};


  const handlePointUpdate = (name: string, points: number) => {
    setDocuments(
      documents.map((doc) => (doc.name === name ? { ...doc, points } : doc))
    );
    setEditingDoc(null);
  };

  const handleChangeType = (name: string, level: 'Primary' | 'Secondary') => {
    setDocuments(
      documents.map((doc) => doc.name === name ? { ...doc, level } : doc)
    );
  };

  const buttonClasses = "px-6 py-2 rounded-lg transition focus:outline-none";
  const applyButtonStyles = `${buttonClasses} w-full bg-blue-500 text-white hover:bg-blue-600`;

  return (
    <SimpleLayout>
      {/* Header and Action Buttons */}
      <div className="flex flex-col items-center bg-blue-200 p-6 my-8 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-center mb-4">Configuration Settings</h2>
        <div className="flex gap-4 mb-6">
          <button className={`${buttonClasses} bg-green-500 text-white hover:bg-green-600`}>Save</button>
          <button className={`${buttonClasses} bg-blue-500 text-white hover:bg-blue-600`}>Deploy</button>
          <button className={`${buttonClasses} bg-gray-500 text-white hover:bg-gray-600`}>Cancel</button>
        </div>
      </div>

      {/* Compact Configuration Inputs */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-full max-w-lg mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col min-w-[250px]">
            <label htmlFor="min-docs" className="font-medium">
              1. Minimum Required Primary Documents
              <i
                className="ml-1 cursor-pointer text-gray-500"
                title="Primary mean one must provide this as a must-do, while secondary means optional."
              >
                ?
              </i>
              </label>
            <input
              id="min-docs"
              type="number"
              value={minDocs}
              onChange={(e) => setMinDocs(Number(e.target.value))}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col min-w-[250px]">
            <label htmlFor="min-points" className="font-medium">
              2. Minimum Required Points for all the Documents
              <i
                className="ml-1 cursor-pointer text-gray-500"
                title="You will score each document types and your customer must provide enough documents for this score to met"
              >
                ?
              </i>
              </label>
            <input
              id="min-points"
              type="number"
              value={minPoints}
              onChange={(e) => setMinPoints(Number(e.target.value))}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Document Selection Dropdown */}
        <label htmlFor="doc-select" className="block mb-2 font-medium">Select Document Type</label>
        <select
          id="doc-select"
          onChange={(e) => {
            const doc = e.target.value;
            if (doc && !selectedDocs.includes(doc)) {
              setSelectedDocs([...selectedDocs, doc]);
            }
          }}
          className="border p-2 rounded mb-2 w-full focus:ring-2 focus:ring-blue-500 max-h-40 overflow-y-auto"
        >
          <option value="">Choose a document</option>
          {documentOptions
            .filter((option) => !selectedDocs.includes(option))
            .map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
        </select>

        {/* Selected Documents with Apply Button */}
        <div className="mb-4">
          <div className="flex gap-2 flex-wrap mb-2">
            {selectedDocs.map((doc) => (
              <span
                key={doc}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => setSelectedDocs(selectedDocs.filter((d) => d !== doc))}
              >
                {doc} ✕
              </span>
            ))}
          </div>
          <button onClick={handleApply} className={applyButtonStyles}>
            Apply
          </button>
        </div>
      </div>

      {/* Modal for Document Level and Points Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Document Settings</h3>
            {selectedDocs.map((doc) => (
              <div key={doc} className="mb-4">
                <h4 className="font-medium">{doc}</h4>
                <div className="flex items-center gap-4 mb-2">
                  <label className="font-medium">Level:</label>
                  <button
                    onClick={() => setDocumentLevel({ ...documentLevel, [doc]: 'Primary' })}
                    className={`px-4 py-1 rounded-l-lg ${documentLevel[doc] === 'Primary' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    Primary
                  </button>
                  <button
                    onClick={() => setDocumentLevel({ ...documentLevel, [doc]: 'Secondary' })}
                    className={`px-4 py-1 rounded-r-lg ${documentLevel[doc] === 'Secondary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Secondary
                  </button>
                </div>
                <label className="font-medium block">Points:</label>
                <input
                  type="number"
                  value={documentPoints[doc] || ''}
                  onChange={(e) => setDocumentPoints({ ...documentPoints, [doc]: Number(e.target.value) })}
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={handleModalCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleModalApply} className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Table of Document Configurations with Pagination */}
      <div className="bg-white p-6 rounded-lg shadow-lg mx-auto w-full max-w-6xl">
        <h3 className="font-semibold text-2xl mb-6 text-center text-gray-800">Configuration Summary</h3>
        <table className="w-full text-center border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-gray-700 font-medium">
              <th className="border-b p-4">Document Name</th>
              <th className="border-b p-4">Document Level</th>
              <th className="border-b p-4">Points</th>
              <th className="border-b p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((doc) => (
              <tr key={doc.name} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="border-b p-4 text-gray-700 font-medium">{doc.name}</td>
                <td className="border-b p-4">
                  <select
                    value={doc.level}
                    onChange={(e) => handleChangeType(doc.name, e.target.value as 'Primary' | 'Secondary')}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </td>
                <td className="border-b p-4">
                  {editingDoc === doc.name ? (
                    <input
                      type="number"
                      value={doc.points}
                      onChange={(e) => handlePointUpdate(doc.name, Number(e.target.value))}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-600">{doc.points}</span>
                  )}
                </td>
                <td className="border-b p-4 space-x-2">
                  {editingDoc === doc.name ? (
                    <>
                      <button
                        onClick={() => handleChangePoint(doc.name)}
                        className="px-4 py-2 rounded font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors duration-150"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleCancelEdit(doc.name)}
                        className="px-4 py-2 rounded font-semibold bg-gray-400 hover:bg-gray-500 text-white transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleChangePoint(doc.name)}
                      className="px-4 py-2 rounded font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-150"
                    >
                      Change Points
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc.name)}
                    className="px-4 py-2 rounded font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:bg-gray-200"
          >
            Prev
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      <FooterBlock />
    </SimpleLayout>
  );
};

export default Landing;
