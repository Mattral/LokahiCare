"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useManagingCompanies from 'views/dashboard/useManagingCompanies'; // Import the custom hook
import Modal from "./Modal";
import DeleteModal from "./DeleteModal";

// Define the type for a Site object
interface Site {
  title: string;
  logo: string;
  onlineStatus: boolean;
}

const designOptions = ['{"x":22}'];
const stateOfOriginOptions = ["nsw"];
const domainOptions = ["def-legal", "def-business"];
const statesOfActivityOptions = ["nsw","sample"];

export default function DashboardDomain3() {
  
  const { companies, isLoading, error, refetch} = useManagingCompanies();
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

  useEffect(() => {
    // Call refetch whenever formData changes
    refetch();
  }, [formData, refetch]); // This will trigger refetch every time formData changes

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // Track if in edit mode
  const [deleteModal, setDeleteModal] = useState(false); // For delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState(""); // For input validation


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    //debug
    console.log("handlechange");
    console.log(name);
    console.log(value);
    //
    // Check if the input is of type 'file'
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const files = e.target.files;
      if (files && files[0]) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files,  // Store the file list in the state
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,  // Handle non-file inputs
      }));
    }
  };
  

  const handleSave = async () => {
    // Save logic
    // Trigger refetch when the data is saved
    refetch();
  };
  
  const handleDelete = () => {
    // Handle delete functionality
    if (deleteConfirmation === "Delete") {
      // Perform delete action
      setDeleteModal(false);
    }
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
  {isLoading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>Error...</p>
  ) : (
    companies.map((item, index) => (
      <SiteCard
        key={index}
        index={index}
        title={item.mc_name} // Assuming the structure of item
        logo={item.mc_logo || '/images/default.png'}
        onlineStatus={item.mc_status === 'online'}
        onEdit={() => {
          setFormData({
            mc_name: item.mc_name,
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
    ))
  )}
</section>

      {/* Modal Component */}
      <Modal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        handleSave={handleSave}
        handleChange={handleChange}
        formData={formData}
        designOptions={designOptions}
        stateOfOriginOptions={stateOfOriginOptions}
        domainOptions={domainOptions}
        statesOfActivityOptions={statesOfActivityOptions}
        editMode={editMode}
        setDeleteModal={setDeleteModal}
      />

      {/* DeleteModal Component */}
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        handleDelete={handleDelete}
      />
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

