'use client';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './NavBar';
import { useRouter } from 'next/navigation';
import ChatModal from './ChatModal'; // Import ChatModal

// Define the structure of the document
interface Document {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
}

const Documents: React.FC = () => {
  // State variables with appropriate types
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Number of items per page

  const router = useRouter(); // Initialize useRouter

  const handleNavigate = () => {
    // Navigate to "/page"
    router.push('/forms/ConfigureDocuments2');
  };

  // Fetch documents from localStorage
  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem('documents') || '[]') as Document[];
    setDocuments(storedDocuments);
  }, []);

  const handleViewDocument = (id: number) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setSelectedDocument(document);
      setShowModal(true);
    }
  };

  const handleDeleteDocument = (id: number) => {
    const updatedDocuments = documents.filter((document) => document.id !== id);
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  };

  const filteredDocuments = documents.filter(document =>
    document.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastDocument = currentPage * itemsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);
  
  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="mb-5">
              <input
                type="text"
                className="form-control shadow-lg rounded-pill py-3 px-5 border-0"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  maxWidth: '600px',
                  margin: '0 auto',
                  fontSize: '18px',  // Larger font for better readability
                }}
              />
            </div>
            <h2 className="text-primary text-center mb-5" style={{ fontSize: '36px' }}>
              Document List
            </h2>
            <div className="table-responsive">
              <table
                className="table table-bordered table-hover table-striped shadow-lg rounded-lg text-center"
                style={{
                  fontSize: '18px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <thead className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white">
                  <tr>
                    <th style={{ fontSize: '20px' }}>ID</th>
                    <th style={{ fontSize: '20px' }}>Name</th>
                    <th style={{ fontSize: '20px' }}>Description</th>
                    <th style={{ fontSize: '20px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocuments.map((document) => (
                    <tr key={document.id} className="align-middle">
                      <td style={{ fontSize: '18px' }}>{document.id}</td>
                      <td style={{ fontSize: '18px' }}>{document.name}</td>
                      <td style={{ fontSize: '18px' }}>{document.date}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-lg me-2 shadow-lg"
                          onClick={() => {
                            window.location.href = "https://document-edit.vercel.app/page";
                          }}
                          style={{
                            fontSize: '18px', // Larger button text
                            padding: '12px 24px', // Larger padding
                          }}
                        >
                          Preview
                        </button>
                        <button
                          className="btn btn-outline-danger btn-lg me-2 shadow-lg"
                          onClick={() => handleDeleteDocument(document.id)}
                          style={{
                            fontSize: '18px', // Larger button text
                            padding: '12px 24px', // Larger padding
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline-success btn-lg me-2 shadow-lg"
                          onClick={handleNavigate}
                          style={{
                            fontSize: '18px', // Larger button text
                            padding: '12px 24px', // Larger padding
                          }}
                        >
                          Configure
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-lg shadow-lg"
                          onClick={handleNavigate}
                          style={{
                            fontSize: '18px', // Larger button text
                            padding: '12px 24px', // Larger padding
                          }}
                        >
                          Duplicate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: Math.ceil(filteredDocuments.length / itemsPerPage) }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                        style={{
                          fontSize: '18px',
                          padding: '10px 20px',
                          borderRadius: '50px',
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <ChatModal />

      {showModal && selectedDocument && (
        <div
          className="modal"
          tabIndex={-1}
          role="dialog"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-3 shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title text-gradient" style={{ fontSize: '32px' }}>
                  {selectedDocument.name}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  style={{ fontSize: '30px' }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {selectedDocument.image && (
                  <img
                    src={selectedDocument.image}
                    alt="Document"
                    className="img-fluid rounded-3 shadow-xl"
                    style={{
                      maxHeight: '400px', // Control max height for large images
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Documents;
