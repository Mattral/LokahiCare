import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  handleSave: () => void;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  formData: any;  // Assuming formData is managed by the parent component.
  designOptions: string[];
  stateOfOriginOptions: string[];
  domainOptions: string[];
  statesOfActivityOptions: string[];
  editMode: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}
import axios from "axios"

const Modal: React.FC<ModalProps> = ({
  showModal,
  closeModal,
  handleSave,
  handleChange,
  formData,
  designOptions,
  stateOfOriginOptions,
  domainOptions,
  statesOfActivityOptions,
  editMode,
  setDeleteModal,
}) => {
  if (!showModal) return null;


  // Handle form submission
  const handleSaveWithApi = async () => {
    // Create a FormData object to handle form fields and file uploads
    const formDataObj = new FormData();
  
    // Append form fields to FormData object
    formDataObj.append("mc_name", formData.mc_name);
    formDataObj.append("mc_email", formData.mc_email);
    formDataObj.append("mc_phone", formData.mc_phone);
    formDataObj.append("mc_domainKey", formData.mc_domainKey || "");
    formDataObj.append("mc_route53Key", formData.mc_route53Key || "");
    formDataObj.append("fc_data", formData.fc_data);
    formDataObj.append("s_code", formData.s_code);
  
    // Append domains and states (ensure these are passed as arrays in the formData)
    formData.dom_codes?.forEach((code: string) => formDataObj.append('dom_codes[]', code));
  
    // Handle s_codes (if it's not an array, treat it as a single value)
    if (Array.isArray(formData.s_codes)) {
      formData.s_codes.forEach((code: string) => formDataObj.append('s_codes[]', code));
    } else if (formData.s_codes) {
      formDataObj.append('s_codes[]', formData.s_codes);
    }
  
    // Append file (if there's a file)
    if (formData.mc_logo) {
      formDataObj.append("mc_logo", formData.mc_logo[0]);
    }
    
  
    try {
      // Axios POST request
      const response = await axios.post(
        'https://lawonearth.co.uk/api/back-office/core/apps/create',
        formDataObj,
        {
          headers: {
            'Authorization': 'Bearer 488|3lzNPyR9fbStZm4qTgGZ0E5n32dW0gP36kBkiM0Yff4be1c0', // Replace with the actual token
            'COMPANY-CODE': 'def-mc-admin',
            'FRONTEND-KEY': 'XXX', // Replace with actual Frontend key
            'X-Requested-With': 'XMLHttpRequest',
            //'Content-Type':'multipart/form-data',
            'accept': 'application/json',
            // Axios will automatically set the 'Content-Type' to 'multipart/form-data'
          }
        }
      );
  
      // Handle response based on API status
      if (response.data.status === "treatmentSuccess") {
        toast.success("White labeled app successfully created.");
        toast.success(response.data.data.primaryData.msg);
        closeModal();  // Close the modal if successful
      } else if (response.data.status === "validationError") {
        // Display validation errors as toast notifications
        const errors = response.data.data.primaryData.errors;
        Object.keys(errors).forEach((key) => {
          errors[key].forEach((errorMessage: string) => {
            toast.error(errorMessage);  // Show each error as a toast
          });
        });
      } else {
        toast.error("There was an issue creating the app.");
      }
    } catch (error) {
      console.error("Error submitting form data", error);
      toast.error("An error occurred while submitting the form.");
    }
  };
  

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <ToastContainer />
    <div className="bg-white bg-opacity-90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[80vh] transition-transform transform hover:scale-105">
      <h3 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
        {editMode ? "Edit Site" : "Create New Site"}
      </h3>

      <form>
        {/* Form fields */}
        <div className="mb-6">
          <label htmlFor="mc_name" className="block text-lg font-medium text-gray-800">Company Name</label>
          <input
            type="text"
            id="mc_name"
            name="mc_name"
            className="mt-1 p-4 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formData.mc_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="mc_email" className="block text-lg font-medium text-gray-800">Company Email</label>
          <input
            type="email"
            id="mc_email"
            name="mc_email"
            className="mt-1 p-4 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formData.mc_email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="mc_phone" className="block text-lg font-medium text-gray-800">Company Phone</label>
          <input
            type="tel"
            id="mc_phone"
            name="mc_phone"
            className="mt-1 p-4 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formData.mc_phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="mc_logo" className="block text-lg font-medium text-gray-800">Company Logo</label>
          <input
            type="file"
            id="mc_logo"
            name="mc_logo"
            className="mt-1 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="fc_data" className="block text-lg font-medium text-gray-800">Company Default Design Content</label>
          <select
            id="fc_data"
            name="fc_data"
            className="mt-1 p-4 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formData.fc_data}
            onChange={handleChange}
          >
            {designOptions.map((design) => (
              <option key={design} value={design}>
                {design}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="s_code" className="block text-lg font-medium text-gray-800">Company State of Origin</label>
          <select
            id="s_code"
            name="s_code"
            className="mt-1 p-4 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formData.s_code || ""}  // Ensure it is never undefined
            onChange={handleChange}
          >
            <option value="">Select a state of origin</option>  {/* Default option */}
            {stateOfOriginOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="dom_codes" className="block text-lg font-medium text-gray-800">Company Domains of Activity</label>
          <select
            id="dom_codes"
            name="dom_codes"
            className="mt-1 p-4 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formData.dom_codes}
            onChange={handleChange}
          >
            {domainOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="s_codes" className="block text-lg font-medium text-gray-800">Company States of Activity</label>
          <select
            id="s_codes"
            name="s_codes"
            className="mt-1 p-4 block w-full border border-blue-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            multiple
            value={formData.s_codes}
            onChange={handleChange}
          >
            {statesOfActivityOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="flex justify-end space-x-4 mt-6">
        {editMode && (
          <button
            onClick={() => setDeleteModal(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105 shadow-md"
          >
            Delete
          </button>
        )}

        <button
          onClick={closeModal}
          className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300 transform hover:scale-105 shadow-md"
        >
          Close
        </button>

        <button
          onClick={handleSaveWithApi}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
};

export default Modal;