"use client"
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./NavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Box, SelectChangeEvent } from "@mui/material"; // Add SelectChangeEvent import

const AddDocument: React.FC = () => {
    const [documentName, setDocumentName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<any>(""); // Using `any` type for the image
    const [location, setLocation] = useState<string>(""); // New state for location

    const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setDocumentName(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setDescription(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files ? e.target.files[0] : null;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Update event type to SelectChangeEvent<string>
    const handleLocationChange = (e: SelectChangeEvent<string>): void => {
        setLocation(e.target.value); // Update location state
    };

    const handleAddDocument = (): void => {
        if (!documentName.trim() || !description.trim() || !location) {
            toast.error("Please fill in all fields.");
            return;
        }

        const currentDate = new Date().toLocaleDateString();
        const existingDocuments = JSON.parse(localStorage.getItem("documents") || "[]") as any[];
        const newDocument = {
            id: existingDocuments.length + 1, // Use the length of existingDocuments array as the ID
            name: documentName,
            description: description,
            location: location,
            date: currentDate,
        };
        const updatedDocuments = [...existingDocuments, newDocument];
        localStorage.setItem("documents", JSON.stringify(updatedDocuments));
        setDocumentName("");
        setDescription("");
        setLocation(""); // Reset location field
        toast.success("Document added successfully.");
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5" style={{ maxWidth: "800px" }}>
                {/* Form Card */}
                <div
                    className="card shadow-lg border-0 rounded-3"
                    style={{ padding: "2rem", background: "#f8f9fa" }}
                >
                    <h2 className="text-center mb-4" style={{ color: "#495057" }}>
                        Add New Template
                    </h2>

                    {/* Document Name Field */}
                    <div className="mb-3">
                        <TextField
                            label="Template Name"
                            variant="outlined"
                            fullWidth
                            value={documentName}
                            onChange={handleDocumentNameChange}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    background: '#ffffff',
                                },
                            }}
                        />
                    </div>

                    {/* Description Field */}
                    <div className="mb-3">
                        <TextField
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            value={description}
                            onChange={handleDescriptionChange}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    background: '#ffffff',
                                },
                            }}
                        />
                    </div>

                    {/* Location Dropdown */}
                    <div className="mb-3">
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={location}
                                onChange={handleLocationChange} // Corrected event handler
                                label="Location"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                            >
                                <MenuItem value="Australia">Australia</MenuItem>
                                <MenuItem value="New Zealand">New Zealand</MenuItem>
                                <MenuItem value="USA">USA</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddDocument}
                            sx={{
                                fontSize: "1.2rem",
                                padding: "10px 30px",
                                borderRadius: "50px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#5a67d8",
                                '&:hover': {
                                    backgroundColor: "#4c51bf",
                                    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            Add Document
                        </Button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default AddDocument;
