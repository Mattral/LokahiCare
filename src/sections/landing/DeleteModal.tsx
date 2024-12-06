import React from "react";

interface DeleteModalProps {
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteConfirmation: string;
  setDeleteConfirmation: React.Dispatch<React.SetStateAction<string>>;
  handleDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  deleteModal,
  setDeleteModal,
  deleteConfirmation,
  setDeleteConfirmation,
  handleDelete
}) => {
  if (!deleteModal) return null;

  return (
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
  );
};

export default DeleteModal;
