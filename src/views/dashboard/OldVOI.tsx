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
  const [isSelectionApplied, setIsSelectionApplied] = useState<boolean>(false);
  const [editingDocIndex, setEditingDocIndex] = useState<number | null>(null);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  
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
    const newDocuments = selectedDocs.map((doc) => ({
      name: doc,
      level: documentLevel[doc] || 'Secondary',
      points: documentPoints[doc] || 0,
    }));
    setDocuments(newDocuments);
    console.log(newDocuments); // Debugging line
    setIsSelectionApplied(true);
    setCurrentPage(1);
  };
  

  const handleUpdatePoints = (index: number) => {
    setEditingDocIndex(index);
    setIsEditingPoints(true);
  };

  const handleUpdateLevel = (index: number) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc, i) =>
        i === index ? { ...doc, level: doc.level === 'Primary' ? 'Secondary' : 'Primary' } : doc
      )
    );
  };

  const buttonClasses = "px-6 py-2 rounded-lg transition focus:outline-none";
  const applyButtonStyles = `${buttonClasses} w-full bg-blue-500 text-white hover:bg-blue-600`;

  return (
    <SimpleLayout>
      {/* Header and Action Buttons */}
      <div className="flex flex-col items-center bg-blue-200 p-6 my-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">Configuration Settings</h2>
        <div className="flex gap-4 mb-6">
          <button className={`${buttonClasses} bg-green-500 text-white hover:bg-green-600`}>Save</button>
          <button className={`${buttonClasses} bg-blue-500 text-white hover:bg-blue-600`}>Deploy</button>
          <button className={`${buttonClasses} bg-gray-500 text-white hover:bg-gray-600`}>Cancel</button>
        </div>
      </div>

      {/* Compact Configuration Inputs */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col min-w-[250px]">
            <label htmlFor="min-docs" className="font-medium">1. Minimum Required Primary Documents</label>
            <input
              id="min-docs"
              type="number"
              value={minDocs}
              onChange={(e) => setMinDocs(Number(e.target.value))}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col min-w-[250px]">
            <label htmlFor="min-points" className="font-medium">2. Minimum Required Points</label>
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
              setIsSelectionApplied(false);
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
        {!isSelectionApplied && (
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
        )}
      </div>

      {/* Document Level and Points Assignment */}
      {selectedDocs.map((doc) => (
        <div key={doc} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-4 mb-4 border-b pb-4">
            <h3 className="font-semibold flex-1">{doc}</h3>
            <div className="flex items-center flex-1">
              <label className="font-medium mr-2">Primary/Secondary</label>
              <div className="flex">
                <button
                  onClick={() => setDocumentLevel({ ...documentLevel, [doc]: 'Primary' })}
                  className={`px-4 py-1 rounded-l-lg transition ${documentLevel[doc] === 'Primary' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                  Primary
                </button>
                <button
                  onClick={() => setDocumentLevel({ ...documentLevel, [doc]: 'Secondary' })}
                  className={`px-4 py-1 rounded-r-lg transition ${documentLevel[doc] === 'Secondary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                  Secondary
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="font-medium block mb-1">Points</label>
              <input
                type="number"
                value={documentPoints[doc] || ''}
                onChange={(e) => setDocumentPoints({ ...documentPoints, [doc]: Number(e.target.value) })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Table of Document Configurations with Pagination */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4">Configuration Summary</h3>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Document Name</th>
              <th className="border p-2">Document Level</th>
              <th className="border p-2">Number of Points</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((doc, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{doc.name}</td>
                <td className="border p-2">{doc.level}</td>
                <td className="border p-2">{doc.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <FooterBlock />
    </SimpleLayout>
  );
};

export default Landing;


/* 
after document from dropdown is selected, 
and click on apply bottom (to be added),
there will be a pop up showing
the user choices,
(instead of new div that ask primary or secodary and points)
and after clicking apply again,
the table will be filled
*/

/*
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

  const handleChangePoint = (name: string, points: number) => {
    setDocuments(
      documents.map((doc) => doc.name === name ? { ...doc, points } : doc)
    );
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
      {/* Header and Action Buttons *}
      <div className="flex flex-col items-center bg-blue-200 p-6 my-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">Configuration Settings</h2>
        <div className="flex gap-4 mb-6">
          <button className={`${buttonClasses} bg-green-500 text-white hover:bg-green-600`}>Save</button>
          <button className={`${buttonClasses} bg-blue-500 text-white hover:bg-blue-600`}>Deploy</button>
          <button className={`${buttonClasses} bg-gray-500 text-white hover:bg-gray-600`}>Cancel</button>
        </div>
      </div>

      {/* Compact Configuration Inputs /}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col min-w-[250px]">
            <label htmlFor="min-docs" className="font-medium">1. Minimum Required Primary Documents</label>
            <input
              id="min-docs"
              type="number"
              value={minDocs}
              onChange={(e) => setMinDocs(Number(e.target.value))}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col min-w-[250px]">
            <label htmlFor="min-points" className="font-medium">2. Minimum Required Points</label>
            <input
              id="min-points"
              type="number"
              value={minPoints}
              onChange={(e) => setMinPoints(Number(e.target.value))}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Document Selection Dropdown }
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

        {/* Selected Documents with Apply Button}
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

      {/* Modal for Document Level and Points Assignment }
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

      {/* Table of Document Configurations with Pagination /}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4">Configuration Summary</h3>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Document Name</th>
              <th className="border p-2">Document Level</th>
              <th className="border p-2">Number of Points</th>
              <th className="border p-2">Menu</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((doc, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2">{doc.name}</td>
                <td className="border p-2">{doc.level}</td>
                <td className="border p-2">{doc.points}</td>
                <td className="border p-2">
                  <button onClick={() => handleDelete(doc.name)} className="bg-red-500 text-white px-2 py-1 rounded mr-2">Delete</button>
                  <button onClick={() => handleChangePoint(doc.name, doc.points + 1)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Change Point</button>
                  <button onClick={() => handleChangeType(doc.name, doc.level === 'Primary' ? 'Secondary' : 'Primary')} className="bg-green-500 text-white px-2 py-1 rounded">Change Type</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls /}
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded-l-lg ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-200">{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded-r-lg ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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
*/