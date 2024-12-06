
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the type for a Site object
interface Site {
  title: string;
  logo: string;
  onlineStatus: boolean;
}

const designOptions = ["Design 1", "Design 2"];
const stateOfOriginOptions = ["nsw"];
const domainOptions = ["Legal", "Finance", "Logistics"];
const statesOfActivityOptions = ["nsw"];

export default function DashboardDomain3() {
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    mc_name: "",
    mc_email: "",
    mc_phone: "",
    mc_logo: null,
    fc_data: "",
    s_code: "",
    dom_codes: [] as string[],
    s_codes: [] as string[],
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // Track if in edit mode
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Index of the site being edited
  const [deleteModal, setDeleteModal] = useState(false); // For delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState(""); // For input validation

  useEffect(() => {
    const storedSites = localStorage.getItem('sites');
    if (storedSites) {
      setSites(JSON.parse(storedSites));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "mc_logo") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (!formData.mc_name.trim()) {
      alert("Please enter a company name");
      return;
    }

    const newSite = {
      title: formData.mc_name,
      logo: formData.mc_logo ? URL.createObjectURL(formData.mc_logo) : '/default.png',
      onlineStatus: false,
    };

    if (editMode && editingIndex !== null) {
      // Update existing site
      const updatedSites = [...sites];
      updatedSites[editingIndex] = newSite;
      localStorage.setItem('sites', JSON.stringify(updatedSites));
      setSites(updatedSites);
    } else {
      // Add new site
      const updatedSites = [...sites, newSite];
      localStorage.setItem('sites', JSON.stringify(updatedSites));
      setSites(updatedSites);
    }

    resetForm();
  };

  const handleDelete = () => {
    if (deleteConfirmation.toLowerCase() === "delete" && editingIndex !== null) {
      const updatedSites = sites.filter((_, index) => index !== editingIndex);
      localStorage.setItem('sites', JSON.stringify(updatedSites));
      setSites(updatedSites);
      resetForm();
      setDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      mc_name: "",
      mc_email: "",
      mc_phone: "",
      mc_logo: null,
      fc_data: "",
      s_code: "",
      dom_codes: [],
      s_codes: [],
    });
    setShowModal(false);
    setEditMode(false);
    setEditingIndex(null);
    setDeleteConfirmation("");
  };

  return (
    <>
      
      <section className="flex justify-between items-center py-6 bg-gradient-to-r from-white to-gray-100 shadow-lg rounded-xl p-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
          My Partner Apps
        </h2>
        <p className="text-gray-600 text-lg">
          Manage all your sites in one place
        </p>
      </div>
      <button
        onClick={() => {
          setShowModal(true);
          setEditMode(false); // Ensure to start in create mode
        }}
        className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:scale-110 transform transition duration-300 ease-in-out hover:shadow-2xl ring-4 ring-purple-300"
      >
        Create New Site
      </button>
    </section>


      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
        {sites.map((item, index) => (
          <SiteCard
            key={index}
            index={index}
            {...item}
            onEdit={() => {
              setEditingIndex(index);
              setFormData({
                mc_name: item.title,
                mc_email: "",
                mc_phone: "",
                mc_logo: null,
                fc_data: "",
                s_code: "",
                dom_codes: [],
                s_codes: [],
              });
              setShowModal(true);
              setEditMode(true);
            }}
            onDelete={() => setDeleteModal(true)}
          />
        ))}
      </section>

      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[80vh] transition-transform transform hover:scale-105">
          <h3 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
            {editMode ? "Edit Site" : "Create New Site"}
          </h3>
          <form>
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
                value={formData.s_code}
                onChange={handleChange}
              >
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
                onChange={(e) => setFormData((prev) => ({ ...prev, dom_codes: [e.target.value] }))}
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    s_codes: Array.from(e.target.selectedOptions, (option) => option.value),
                  }))
                }
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
              onClick={() => setShowModal(false)}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300 transform hover:scale-105 shadow-md"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}


      {deleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
            <p>Please type "Delete" to confirm deletion.</p>
            <input
              type="text"
              className="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const SiteCard = ({ title, logo, onlineStatus, onEdit, onDelete, index }: { 
  title: string, 
  logo: string, 
  onlineStatus: boolean, 
  onEdit: () => void, 
  onDelete: () => void, 
  index: number 
}) => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(onlineStatus);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOnline(!isOnline);
  };

  const handleCardClick = () => {
    router.push("/sites/edit/" + title);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    router.push('/sites/editVOI');
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative shadow-2xl rounded-xl overflow-hidden transform hover:scale-110 transition-transform cursor-pointer border border-white border-opacity-20"
    >
      {/* Background with nebula effect */}
      <div className="h-32 flex items-center justify-center bg-gradient-to-b from-purple-800 to-black bg-opacity-70 backdrop-blur-md">
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating particles effect */}
          <div className="particle-field">
            {[...Array(100)].map((_, index) => (
              <div key={index} className="particle" />
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/nebula-background.png')] bg-cover opacity-60" />
        </div>
        <img
          src={logo || logo.trim() !== "" ? logo : "/images/default.png"}
          alt={title}
          className="h-full object-contain shadow-2xl rounded-full border-4 border-white border-opacity-30 transition-transform transform hover:scale-105"
        />
      </div>
  
      {/* Title Block with celestial glow */}
      <div className="p-4 text-center bg-white bg-opacity-10 backdrop-blur-md rounded-t-lg shadow-lg">
        <h3 className="text-3xl font-extrabold text-gradient drop-shadow-2xl glow">{title}</h3>
      </div>
  
      {/* Buttons with a cosmic design */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-6 py-3 bg-white bg-opacity-10 backdrop-blur-md rounded-b-xl shadow-inner border-t border-white border-opacity-30">
        <button
          onClick={handleEditClick}
          className="btn-star text-blue-400 font-bold"
        >
          Edit
        </button>
        <button
          onClick={handleNavigate}
          className="btn-star text-purple-400 font-bold"
        >
          Configure
        </button>
        <button
          onClick={handleToggle}
          className={`btn-star font-bold ${isOnline ? "text-green-400" : "text-red-400"}`}
        >
          {isOnline ? "Online" : "Offline"}
        </button>
      </div>
  
      {/* CSS for animations and glow effects */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes floating {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px) rotate(30deg); }
          100% { transform: translateY(0); }
        }
        .particle-field {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8);
          animation: floating 3s infinite ease-in-out, twinkle 1.5s infinite alternate;
          opacity: 0.8;
        }
        .particle:nth-child(1) { width: 6px; height: 6px; left: 10%; top: 20%; animation-duration: 3.5s; }
        .particle:nth-child(2) { width: 8px; height: 8px; left: 40%; top: 30%; animation-duration: 4s; }
        .particle:nth-child(3) { width: 5px; height: 5px; left: 70%; top: 10%; animation-duration: 3.2s; }
        .particle:nth-child(4) { width: 10px; height: 10px; left: 15%; top: 80%; animation-duration: 4.5s; }
        .particle:nth-child(5) { width: 7px; height: 7px; left: 80%; top: 60%; animation-duration: 3.7s; }
        /* More particles with varied sizes and positions */
        .particle:nth-child(6) { width: 8px; height: 8px; left: 25%; top: 15%; animation-duration: 4s; }
        .particle:nth-child(7) { width: 5px; height: 5px; left: 55%; top: 25%; animation-duration: 3.5s; }
        .particle:nth-child(8) { width: 10px; height: 10px; left: 85%; top: 5%; animation-duration: 3.8s; }
        .particle:nth-child(9) { width: 7px; height: 7px; left: 35%; top: 75%; animation-duration: 4.2s; }
        .particle:nth-child(10) { width: 6px; height: 6px; left: 50%; top: 50%; animation-duration: 3.9s; }
  
        .btn-star {
          background: rgba(255, 255, 255, 0.2);
          backdrop-blur-md;
          border-radius: 12px;
          padding: 8px 12px;
          transition: all 0.3s ease;
          font-weight: bold;
        }
        .btn-star:hover {
          box-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8);
          transform: scale(1.05);
          color: inherit; /* Keep original text color on hover */
        }
        .btn-star:hover.text-blue-400 {
          box-shadow: 0 0 15px rgba(0, 162, 255, 1), 0 0 30px rgba(0, 162, 255, 0.8);
        }
        .btn-star:hover.text-purple-400 {
          box-shadow: 0 0 15px rgba(128, 0, 255, 1), 0 0 30px rgba(128, 0, 255, 0.8);
        }
        .btn-star:hover.text-green-400 {
          box-shadow: 0 0 15px rgba(0, 255, 0, 1), 0 0 30px rgba(0, 255, 0, 0.8);
        }
        .btn-star:hover.text-red-400 {
          box-shadow: 0 0 15px rgba(255, 0, 0, 1), 0 0 30px rgba(255, 0, 0, 0.8);
        }
        .glow {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 204, 0, 0.8), 0 0 15px rgba(255, 204, 0, 0.9);
        }
        .text-gradient {
          background: linear-gradient(90deg, #ff7e5f, #feb47b, #ff7e5f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 5s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
  
  
  
  
};

