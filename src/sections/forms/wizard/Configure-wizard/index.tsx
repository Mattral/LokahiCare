'use client';
import { useState } from 'react';
import { Grid, Stack, Typography, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import Notification from './Notification';
import MultiFileUpload from 'components/third-party/dropzone/MultiFile';
import { CustomFile, DocumentCategory } from 'types/dropzone';
import PointSystemConfig from "./clientVOI";

// Define types
interface DocumentType extends CustomFile {
  selectedDocument: string;
  points: number;
  category: DocumentCategory | undefined;
}

// Main Component
const FileUpload = ({ setFormData }: any) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false); // Pop-up dialog state
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>([]);

  const handleUpload = (data: DocumentType[]) => {
    setSelectedDocuments(data);
    setSnackbarMessage('Files uploaded successfully!');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleSubmit = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      selectedDocuments,
    }));
    setOpenDialog(true); // Show dialog on submit
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Grid container spacing={3} sx={{ marginTop: '30px' }}>
      
      {/* Centered Table */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <PointSystemConfig />
      </Grid>

      {/* File Upload Section */}
      <Grid item xs={12}>
        <MultiFileUpload
          files={selectedDocuments}
          setFieldValue={(name: string, value: DocumentType[]) => setSelectedDocuments(value)}
          onUpload={handleUpload}
        />
      </Grid>

      {/* Navigation Buttons */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, padding: 2 }}>
        <Stack spacing={2} sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            sx={{
              borderRadius: 15,
              fontWeight: 'bold',
              color: 'primary',
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#388E3C',
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
              },
            }}
          >
            Submit
          </Button>
        </Stack>
      </Grid>

      {/* Snackbar Notification */}
      <Notification
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        handleClose={handleCloseSnackbar}
      />

      {/* Dialog for Submit Confirmation */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            Submission Confirmed!
          </Typography>
          <Typography variant="body1" textAlign="center">
            Your documents have been successfully submitted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default FileUpload;
