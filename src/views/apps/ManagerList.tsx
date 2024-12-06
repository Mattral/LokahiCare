'use client';
import { useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';

interface Manager {
  pers_fName: string;
  pers_mName?: string;  // Optional
  pers_lName: string;
  email: string;
  password: string;
  password_confirmation: string;
  pers_preferredTimezone?: string;  // Optional
  redirectUrl: string;
}

const initialFormData = {
  pers_fName: '',
  pers_mName: '',  // Optional
  pers_lName: '',
  email: '',
  password: '',
  password_confirmation: '',
  pers_preferredTimezone: '',  // Optional
  redirectUrl: '',
};

const ManagerList = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // For success message
  const [isError, setIsError] = useState(false); // For error message
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dummy Edit: Set a default manager to edit
  const handleEdit = () => {
    setFormData({
      pers_fName: 'John',
      pers_mName: 'Doe',
      pers_lName: 'Smith',
      email: 'john.doe@mail.com',
      password: 'aAertyuiop@1',
      password_confirmation: 'aAertyuiop@1',
      pers_preferredTimezone: 'UTC',
      redirectUrl: 'http://lawonearth.org/',
    });
    setIsModalOpen(true);
  };

  // Send form data to the API when saving
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('pers_type', 'partner-manager');
      formDataToSend.append('pers_fName', formData.pers_fName);
      formDataToSend.append('pers_mName', formData.pers_mName || ''); // optional field
      formDataToSend.append('pers_lName', formData.pers_lName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.password_confirmation);
      formDataToSend.append('pers_preferredTimezone', formData.pers_preferredTimezone || ''); // optional field
      formDataToSend.append('redirectUrl', formData.redirectUrl);

      // Replace with actual API URL
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://lawonearth.co.uk';  // Provide a fallback if needed

      const response = await axios.post(`${baseUrl}/api/back-office/core/partners/create`, formDataToSend, {
        headers: {
          Authorization: 'Bearer 468|Z3R1e6AafzevNYXbMF2QJhpkcwfKpukgqNjTGbI7dbde9b5f', // Use the provided token
          'COMPANY-CODE': 'def-mc-admin', // Replace with actual company code
          'FRONTEND-KEY': 'XXX', // Replace with actual frontend key
        },
      });

      // Handle API response
      if (response.data.status === 'treatmentSuccess') {
        setManagers([...managers, formData]); // Add the new manager to the list
        setIsSuccess(true); // Display success message
      } else {
        setIsError(true); // Display error message if needed
        setErrorMessage(response.data.message || 'An error occurred while creating the manager.');
      }

    } catch (error) {
      setIsError(true);
      setErrorMessage('An error occurred while communicating with the server.');
    }
  };

  const handleModalClose = () => {
    setFormData(initialFormData);
    setIsModalOpen(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Partner Managers</Typography>
        <Button variant="contained" color="primary" onClick={handleEdit}>Add New Manager</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <caption>List of Partner Managers</caption>
          <TableHead>
            <TableRow>
              <TableCell>S/N</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Timezone</TableCell>
              <TableCell>Redirect URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.pers_fName} {item.pers_mName} {item.pers_lName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.pers_preferredTimezone}</TableCell>
                <TableCell>{item.redirectUrl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Editable Modal */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Partner Manager
          </Typography>

          <TextField
            fullWidth
            label="First Name"
            name="pers_fName"
            value={formData.pers_fName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Middle Name"
            name="pers_mName"
            value={formData.pers_mName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="pers_lName"
            value={formData.pers_lName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            type="password"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            margin="normal"
            type="password"
          />
          <TextField
            fullWidth
            label="Preferred Timezone"
            name="pers_preferredTimezone"
            value={formData.pers_preferredTimezone}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Redirect URL"
            name="redirectUrl"
            value={formData.redirectUrl}
            onChange={handleChange}
            margin="normal"
          />

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Success/Error Message */}
      <Snackbar open={isSuccess} autoHideDuration={6000} onClose={() => setIsSuccess(false)}>
        <Alert onClose={() => setIsSuccess(false)} severity="success">
          Manager created successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={isError} autoHideDuration={6000} onClose={() => setIsError(false)}>
        <Alert onClose={() => setIsError(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerList;
