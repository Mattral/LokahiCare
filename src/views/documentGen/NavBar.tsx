import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Optional, if you still want some bootstrap styles
import { Button, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Icon for the mobile menu

const Navbar: React.FC = () => {
    // A simple click handler for the buttons
    const handleNavigate = (path: string) => {
        window.location.href = path; // This will navigate to the specified path
    };

    return (
        <AppBar
            position="sticky"
            color="primary" // Keep the original primary color
            sx={{
                backdropFilter: 'blur(10px)', // Apply the glassmorphism effect
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                borderRadius: '10px', // Optional: rounded corners
                border: '1px solid rgba(255, 255, 255, 0.2)', // Border for glass effect
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    A place where you create and configure your own document workflows and logics, what you see is what you get.
                </Typography>

                {/* For desktop, buttons will be shown horizontally */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={() => handleNavigate('/forms/document-template')} // Navigate to Documents
                        sx={{
                            color: '#ffffff', // Ensure constant white color
                            borderColor: '#ffffff', // Keep white border color
                            borderRadius: '30px', // Rounded borders for premium look
                            padding: '10px 20px', // Add some padding for better button size
                            transition: 'all 0.3s ease-in-out', // Smooth transition for hover effect
                            '&:hover': {
                                borderColor: 'rgba(0, 204, 255, 0.8)', // Glowing effect on hover
                                color: 'rgba(0, 204, 255, 0.8)', // Glowing text color on hover
                                boxShadow: '0 0 15px rgba(0, 204, 255, 0.8)', // Glow around the button
                                transform: 'scale(1.05)', // Subtle scaling for premium effect
                            },
                            '&:active': {
                                borderColor: 'rgba(0, 204, 255, 1)', // Stronger glow on active
                                color: 'rgba(0, 204, 255, 1)', // Stronger glowing text on active
                                boxShadow: '0 0 20px rgba(0, 204, 255, 1)', // Stronger glow on active
                            },
                        }}
                    >
                        Document Templates
                    </Button>
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={() => handleNavigate('/forms/AddDocument')} // Navigate to Add Document
                        sx={{
                            color: '#ffffff', // Ensure constant white color
                            borderColor: '#ffffff', // Keep white border color
                            borderRadius: '30px', // Rounded borders for premium look
                            padding: '10px 20px', // Add some padding for better button size
                            transition: 'all 0.3s ease-in-out', // Smooth transition for hover effect
                            '&:hover': {
                                borderColor: 'rgba(0, 204, 255, 0.8)', // Glowing effect on hover
                                color: 'rgba(0, 204, 255, 0.8)', // Glowing text color on hover
                                boxShadow: '0 0 15px rgba(0, 204, 255, 0.8)', // Glow around the button
                                transform: 'scale(1.05)', // Subtle scaling for premium effect
                            },
                            '&:active': {
                                borderColor: 'rgba(0, 204, 255, 1)', // Stronger glow on active
                                color: 'rgba(0, 204, 255, 1)', // Stronger glowing text on active
                                boxShadow: '0 0 20px rgba(0, 204, 255, 1)', // Stronger glow on active
                            },
                        }}
                    >
                        Add New Template
                    </Button>
                </Box>

                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton color="inherit">
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
