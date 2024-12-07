"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { keyframes } from "styled-components";

// Define the type for the activity domain data
interface ActivityDomain {
  idDom: string;
  dom_code: string;
  dom_name: string;
  dom_type: string;
}

// Professional Color Palette and Gradients
const primaryGradient = "linear-gradient(135deg, #8e44ad 10%, #3498db 90%)"; // Purple to sky blue
const secondaryGradient = "linear-gradient(135deg, #9b59b6 10%, #2980b9 90%)"; // Soft purple and blue combo

// Fancy shimmer animation for loading state
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled components for a clean, professional UI
const Container = styled.div`
  margin-top: 3rem;
  padding: 0 20px;
  max-width: 1200px;
  margin: 3rem auto;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center; /* Vertically center the items */
  justify-content: center; /* Horizontally center the items */
  width: 100%; /* Ensure the flex container uses full width */
  gap: 1rem; /* Optional: Add space between the input and the button */
`;


const SearchInput = styled.input`
  flex-grow: 1; /* Ensures the input takes up available space */
  max-width: 400px; /* Reduced the max-width to make the input smaller */
  font-size: 14px; /* Reduced the font size for a more compact look */
  padding: 0.75rem 1rem; /* Reduced padding to make it smaller */
  border-radius: 20px; /* Slightly smaller border radius for a more compact look */
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 1rem; /* Added margin at the bottom to prevent overlap */

  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(100, 100, 255, 0.7);
  }

  ::placeholder {
    color: #aaa;
  }
`;


// Add Domain Button Styling
const AddDomainButton = styled.button`
    font-size: 16px;
    padding: 0.8rem 2rem;
    border-radius: 30px;
    background: ${secondaryGradient};
    color: white;
    border: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: ${primaryGradient};
      transform: scale(1.05);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    }

    &:focus {
      outline: none;
    }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 4rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  font-size: 16px;
  border-collapse: collapse;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: ${primaryGradient};
  color: white;
  font-size: 18px;
  border-radius: 8px;
  text-transform: uppercase;
  font-weight: 700;
  min-height: 100px;  // Set your desired minimum height here

  font-weight: 700;
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TableData = styled.td`
  padding: 1rem;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #555;
`;

const TableActions = styled.td`
  padding: 1rem;
  text-align: center;
  display: flex;
  justify-content: center;

  button {
    font-size: 16px;
    padding: 0.8rem 2rem;
    border-radius: 30px;
    background: ${secondaryGradient};
    color: white;
    border: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: ${primaryGradient};
      transform: scale(1.05);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    }

    &:focus {
      outline: none;
    }
  }
`;

// Shimmer effect for loading state
const Shimmer = styled.div`
  width: 100%;
  height: 100px;
  background: ${primaryGradient};
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 10px;
`;

// Modal Styling for Edit Form
const ModalBackground = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isVisible ? "block" : "none")};
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 1rem;
  color: #333;
`;

// Add new styles for the select dropdown
const ModalSelect = styled.select`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #fff;
  color: #333;
  appearance: none;  // Remove the default dropdown arrow
  -webkit-appearance: none;  // Safari fix
  -moz-appearance: none;  // Firefox fix
  
  // For custom styling, we need to add a custom arrow
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"%3E%3Cpath fill="none" stroke="gray" stroke-width="2" d="M12 6l-4 4-4-4"%3E%3C/path%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 1rem center;

  &:focus {
    outline: none;
    border-color: ${primaryGradient};
    box-shadow: 0 0 5px ${primaryGradient};
  }

  &:hover {
    border-color: ${primaryGradient};
  }
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${primaryGradient};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalButton = styled.button`
  font-size: 16px;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  background: ${primaryGradient};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }

  &:last-child {
    background: #ff6b6b;
  }

`;

const ActivityDomainPage = () => {
  const [domains, setDomains] = useState<ActivityDomain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editDomain, setEditDomain] = useState<ActivityDomain | null>(null);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [newDomain, setNewDomain] = useState<{ dom_name: string; dom_type: string }>({
    dom_name: "",
    dom_type: "",
  });

  // Function to fetch data from the API
  const fetchDomains = async () => {
    const url = ""; // API endpoint
    const headers = {
      "Authorization": "Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f", // Replace with your Bearer token
      "COMPANY-CODE": "def-mc-admin", // Replace with your company code
      "FRONTEND-KEY": "XXX", // Replace with your frontend key
      "X-Requested-With": "XMLHttpRequest",
    };

    try {
      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error("Error fetching data");
      }

      const data = await res.json();
      if (data.status === "treatmentSuccess") {
        setDomains(data.data.primaryData._domains.data);
        toast.success(data.data.primaryData.msg); // Show success toast
      } else {
        toast.error("Failed to load domains.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // Filter the domains based on search query
  const filteredDomains = domains.filter((domain) =>
    domain.dom_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit button click
  const handleEdit = (domain: ActivityDomain) => {
    setEditDomain(domain);
    setEditModalVisible(true);
  };

  // Handle add button click
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  // Handle the update API call
  const handleEditSubmit = async () => {
    // Ensure editDomain exists before proceeding
    if (!editDomain || !editDomain.dom_name || !editDomain.dom_type) {
      toast.error("Both domain name and domain type are required.");
      return;
    }
  
    const url = `${editDomain.dom_code}`;
    
    const headers = {
      "Authorization": "Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f", // Replace with your Bearer token
      "COMPANY-CODE": "def-mc-admin", // Replace with your company code
      "FRONTEND-KEY": "XXX", // Replace with your frontend key
      "X-Requested-With": "XMLHttpRequest",
      // Note: Do not add Content-Type header when sending FormData
    };
  
    // Create FormData object
    const formData = new FormData();
    formData.append("dom_name", editDomain.dom_name);  // Add dom_name field
    formData.append("dom_type", editDomain.dom_type);  // Add dom_type field
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: formData,  // Send FormData instead of JSON
      });
  
      const data = await res.json();
  
      if (data.status === "treatmentSuccess") {
        toast.success("Domain updated successfully.");
        setDomains((prev) =>
          prev.map((domain) =>
            domain.idDom === editDomain.idDom ? { ...domain, ...editDomain } : domain
          )
        );
        setEditModalVisible(false);
      } else {
        // Check if there are validation errors
        if (data.data.primaryData.errors) {
          // Collect all errors into a single string
          const errorMessages = Object.values(data.data.primaryData.errors)
            .flat() // Flatten the array of errors
            .join(", "); // Join them with commas
  
          // Display the combined error messages
          toast.error(errorMessages);
        } else {
          // Default message if no specific errors found
          const errorMessage = data.data.primaryData.msg || "Failed to update domain.";
          toast.error(errorMessage);
        }
      }
    } catch (error: unknown) {
      // Type guard to handle 'unknown' type error
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred while updating domain.");
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };
  
  

// Handle the create API call for a new domain
const handleAddSubmit = async () => {
    const url = "??";
    const headers = {
      "Authorization": "Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f", // Replace with your Bearer token
      "COMPANY-CODE": "def-mc-admin", // Replace with your company code
      "FRONTEND-KEY": "XXX", // Replace with your frontend key
      "X-Requested-With": "XMLHttpRequest",
    };
  
    // Prepare FormData
    const formData = new FormData();
    formData.append("dom_name", newDomain.dom_name); // Add dom_name field
    formData.append("dom_type", newDomain.dom_type); // Add dom_type field
  
    // Debugging: Check the FormData
    console.log(...formData); // Output FormData as key-value pairs
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: formData, // Send FormData instead of JSON
      });
  
      const data = await res.json();
  
      if (data.status === "treatmentSuccess") {
        toast.success("Domain added successfully.");
        setDomains((prev) => [...prev, data.data.primaryData]);
        setAddModalVisible(false);
      } else {
        // Extract and display all validation errors from the response
        if (data.status === "validationError" && data.data.primaryData.errors) {
          const errorMessages = Object.values(data.data.primaryData.errors)
            .flat()
            .join(" "); // Join all error messages in case there are multiple errors for a field
          toast.error(errorMessages || "Validation failed.");
        } else {
          toast.error("Failed to add domain.");
        }
      }
    } catch (error) {
      // Type guard to handle 'unknown' type error
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred while adding domain.");
      } else {
        // Handle cases where error is not an instance of Error (e.g., network failure without error message)
        toast.error("An unknown error occurred.");
      }
    }
  };
  
  

  // Close the modal for edit or cancel
  const handleCancel = () => {
    setEditModalVisible(false);
    setAddModalVisible(false);
  };

  return (
    <Container>
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-10">
            {/* Title */}
            <div className="mb-2" style={{ textAlign: 'center' }}>
                <Title>Activity Domains</Title>
                <a>Domains on which you are going to provide service on your app.</a>
                {/* Admin will configure this and ToDo: move this page to menu */}
            </div>
            {/* Search bar and Add Domain button */}
            <SearchContainer>                
                {/* Search bar */}
                <SearchInput
                    type="text"
                    placeholder="Search domains..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Add Domain button */}
                <AddDomainButton onClick={handleAdd}>
                    Add Domain
                </AddDomainButton>
            </SearchContainer>

            {/* Table */}
            <div className="table-responsive">
            {loading ? (
                <Shimmer />
            ) : (
                <Table>
                <TableHeader>
                    <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Actions</th>
                    </tr>
                </TableHeader>
                <tbody>
                    {filteredDomains.map((domain) => (
                    <TableRow key={domain.idDom}>
                        <TableData>{domain.dom_code}</TableData>
                        <TableData>{domain.dom_name}</TableData>
                        <TableData>{domain.dom_type}</TableData>
                        <TableActions>
                        <button onClick={() => handleEdit(domain)}>Edit</button>
                        </TableActions>
                    </TableRow>
                    ))}
                </tbody>
                </Table>
            )}
            </div>
        </div>
        </div>


      {/* Edit Modal */}
      {editModalVisible && (
        <ModalBackground isVisible={editModalVisible}>
            <ModalContent>
            <ModalTitle>Edit Domain</ModalTitle>

            {/* Input for Domain Name */}
            <ModalInput
                type="text"
                value={editDomain?.dom_name || ""}
                onChange={(e) =>
                setEditDomain((prev) =>
                    prev ? { ...prev, dom_name: e.target.value } : prev
                )
                }
                placeholder="Domain Name"
            />

            {/* Input for Domain Type */}
            {/* Domain Type Dropdown */}
            <ModalSelect
              value={newDomain.dom_type}
              onChange={(e) =>
                setNewDomain({ ...newDomain, dom_type: e.target.value })
              }
            >
              <option value="">Select Domain Type</option>
              <option value="business">Business</option>
              <option value="sport">Sport</option>
              <option value="legal">Legal</option>
            </ModalSelect>

            <ModalActions>
                <ModalButton onClick={handleEditSubmit}>Confirm</ModalButton>
                <ModalButton onClick={handleCancel}>Cancel</ModalButton>
            </ModalActions>
            </ModalContent>
        </ModalBackground>
        )}

      {addModalVisible && (
        <ModalBackground isVisible={addModalVisible}>
          <ModalContent>
            <ModalTitle>Add Domain</ModalTitle>

            {/* Domain Name Input */}
            <ModalInput
              type="text"
              value={newDomain.dom_name}
              onChange={(e) =>
                setNewDomain({ ...newDomain, dom_name: e.target.value })
              }
              placeholder="Domain Name"
            />

            {/* Domain Type Dropdown */}
            <ModalSelect
              value={newDomain.dom_type}
              onChange={(e) =>
                setNewDomain({ ...newDomain, dom_type: e.target.value })
              }
            >
              <option value="">Select Domain Type</option>
              <option value="business">Business</option>
              <option value="sport">Sport</option>
              <option value="legal">Legal</option>
            </ModalSelect>

            <ModalActions>
              <ModalButton onClick={handleAddSubmit}>Confirm</ModalButton>
              <ModalButton onClick={() => setAddModalVisible(false)}>Cancel</ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalBackground>
      )}



    </Container>
  );
};

export default ActivityDomainPage;
