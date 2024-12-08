"use client";
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, IconButton, Tooltip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Box, Modal } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NodeQuestionForm from "./NodeQuestionForm"; // Existing form component

import html2canvas from "html2canvas";

interface Node {
  id: string;
  name: string;
  type: "single" | "select1" | "multiSelect"; // Define types of nodes
  parentId?: string; // Parent ID to create hierarchy
  children?: Node[]; // Child nodes to form a branch
  position: { x: number; y: number }; // Track the position of the node for free move
  width: number; // Added width for node size
  height: number; // Added height for node size
}

interface DraggedNode {
  node: Node | null; // The node being dragged
  offsetX: number; // X offset from where the mouse clicked
  offsetY: number; // Y offset from where the mouse clicked
}

const NodeConfigurator: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentNodeType, setCurrentNodeType] = useState<"single" | "select1" | "multiSelect">("single");
  const [currentNodeName, setCurrentNodeName] = useState("");
  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null); // Track dragging state
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParentNode, setSelectedParentNode] = useState<Node | null>(null); // For parent node selection
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For dropdown menu
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [openBranchLinksDialog, setOpenBranchLinksDialog] = useState(false); // Dialog state for relationships
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const workspaceRef = useRef<HTMLDivElement>(null); // Reference to workspace container
  const canvasRef = useRef<HTMLCanvasElement>(null); // Reference to the canvas

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalC, setOpenModalC] = useState(false);
  // Function to capture the image
  const captureImage = () => {
    if (workspaceRef.current) {
      // Use html2canvas to capture the content of the workspace
      html2canvas(workspaceRef.current).then((canvas) => {
        // Convert the canvas to an image
        const imgUrl = canvas.toDataURL("image/png");
  
        // Set the image URL in the state
        setImageUrl(imgUrl);
  
        // Open the modal to show the image
        setOpenModal(true);
        // You could also download the image or do further processing here
        const link = document.createElement("a");
        link.href = imgUrl;
        link.download = "diagram_image.png";  // Set the name of the downloaded image
        link.click();  // Trigger the download
      });
    }
  };
  
  // Open form for creating nodes (regular or branch)
  const openFormForNode = (type: "single" | "select1" | "multiSelect", parentNode?: Node) => {
    setCurrentNodeType(type);
    setOpenForm(true);
  };

  const handleNodeSubmit = (data: any, parentId?: string) => {
    setIsLoading(true);

    const newNode: Node = {
      id: `${Date.now()}`,
      name: currentNodeName || data.question,
      type: currentNodeType,
      parentId: parentId, // Set parentId if it's a branch
      children: [],
      position: { x: 100, y: 100 }, // Default position for the new node
      width: 150, // Set a default width for nodes
      height: 50, // Set a default height for nodes
    };

    // If parentId exists, add it as a child of the parent node
    if (parentId) {
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          if (node.id === parentId) {
            node.children = [...(node.children || []), newNode];
          }
          return node;
        });
      });
    } else {
      // If no parent, it's a root-level node
      setNodes((prevNodes) => [...prevNodes, newNode]);
    }

    setTimeout(() => {
      setOpenForm(false);
      setCurrentNodeName("");
      toast.success("Node created successfully!");
      setIsLoading(false);
    }, 0);
  };

  // Handle deletion of a node
  const handleDeleteNode = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    toast.success("Node deleted successfully!");
  };

  // Handle dragging of nodes (move position)
  const handleMouseDown = (event: React.MouseEvent, node: Node) => {
    if (workspaceRef.current) {
      const workspaceBounds = workspaceRef.current.getBoundingClientRect();
      const offsetX = event.clientX - workspaceBounds.left - node.position.x;
      const offsetY = event.clientY - workspaceBounds.top - node.position.y;

      // Store the dragged node and the offset
      setDraggedNode({ node, offsetX, offsetY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggedNode && workspaceRef.current) {
      const workspaceBounds = workspaceRef.current.getBoundingClientRect();
      const newPos = {
        x: event.clientX - draggedNode.offsetX - workspaceBounds.left,
        y: event.clientY - draggedNode.offsetY - workspaceBounds.top,
      };

      // Update the node's position while dragging
      const updatedNodes = nodes.map((node) => {
        if (node.id === draggedNode.node?.id) {
          node.position = newPos; // Update the node position dynamically
        }
        return node;
      });

      setNodes(updatedNodes);
    }
  };

  const handleMouseUp = () => {
    // Stop dragging
    setDraggedNode(null);
  };

  // Open the branch selection dropdown
  const handleBranchButtonClick = (node: Node, event: React.MouseEvent<HTMLElement>) => {
    setSelectedParentNode(node); // Set parent node for branch
    setSelectedNodeId(node.id); // Set the selected node ID
    setAnchorEl(event.currentTarget); // Open the dropdown menu
  };
  

  // Close the dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle selecting a node as a child
  const handleSelectChildNode = (node: Node) => {
    if (selectedParentNode) {
      // Add selected node as a child of the parent node
      setNodes((prevNodes) =>
        prevNodes.map((parentNode) => {
          if (parentNode.id === selectedParentNode.id) {
            parentNode.children = [...(parentNode.children || []), node];
          }
          return parentNode;
        })
      );
      toast.success(`${node.name} is now a child of ${selectedParentNode.name}`);
    }
    setAnchorEl(null); // Close dropdown after selection
  };

  const handleDeleteRelation = (parentId: string, childId: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((parentNode) => {
        if (parentNode.id === parentId) {
          parentNode.children = parentNode.children?.filter((child) => child.id !== childId);
        }
        return parentNode;
      })
    );
    toast.success("Parent-child relationship deleted successfully!");
  };

// Function to draw lines connecting parent and child nodes
const drawLines = () => {
  if (canvasRef.current) { // Ensure canvasRef.current is not null
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear previous lines

      nodes.forEach((node) => {
        if (node.children) {
          node.children.forEach((childNode) => {
            const parentCenter = {
              x: node.position.x + node.width / 2,
              y: node.position.y + node.height / 2,
            };
            const childCenter = {
              x: childNode.position.x + childNode.width / 2,
              y: childNode.position.y + childNode.height / 2,
            };

            // Draw line from parent to child node
            ctx.beginPath();
            ctx.moveTo(parentCenter.x, parentCenter.y);
            ctx.lineTo(childCenter.x, childCenter.y);
            ctx.strokeStyle = "rgba(90, 90, 90, 0.6)"; // Darker gray for better contrast
            ctx.lineWidth = 2; // Slightly thicker for better visibility
            ctx.lineCap = "round"; // Rounded ends for smoothness
            ctx.lineJoin = "round"; // Round join for smooth connection
            ctx.stroke();

            // Calculate the midpoint of the line
            const midX = (parentCenter.x + childCenter.x) / 2;
            const midY = (parentCenter.y + childCenter.y) / 2;

            // Draw the arrowhead at the midpoint with a more refined style
            const arrowSize = 10; // Slightly larger arrow for better visibility
            const angle = Math.atan2(childCenter.y - parentCenter.y, childCenter.x - parentCenter.x); // Angle of the line

            // Calculate the points for the arrowhead
            const arrowX = midX - arrowSize * Math.cos(angle - Math.PI / 6);
            const arrowY = midY - arrowSize * Math.sin(angle - Math.PI / 6);

            const arrowX2 = midX - arrowSize * Math.cos(angle + Math.PI / 6);
            const arrowY2 = midY - arrowSize * Math.sin(angle + Math.PI / 6);

            // Draw the arrowhead at the midpoint with a matching color
            ctx.beginPath();
            ctx.moveTo(midX, midY);
            ctx.lineTo(arrowX, arrowY);
            ctx.lineTo(arrowX2, arrowY2);
            ctx.closePath();
            ctx.fillStyle = "rgba(90, 90, 90, 0.8)"; // Matching color for the arrow
            ctx.fill();
          });
        }
      });
    }
  }
};

  // Re-draw the lines whenever the nodes change
  useEffect(() => {
    drawLines();
  }, [nodes]);

  const openBranchLinksDialogHandler = () => {
    setOpenBranchLinksDialog(true);
  };

  const closeBranchLinksDialogHandler = () => {
    setOpenBranchLinksDialog(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", gap: "20px" }}>
      {/* Left Sidebar for Node Creation */}
      <div
        style={{
          width: "30%",
          padding: "20px",
          backgroundColor: "#f9f9f9", // Light background color for light mode
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for contrast
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          transition: "transform 0.3s ease", // Smooth transition for hover effects
        }}
      >
        <h2 style={{ color: "#333333" }}>Create Node</h2>
        <div>
          <Button variant="contained" color="primary" onClick={() => openFormForNode("single")} fullWidth>
            Add a Block
          </Button>
          <Button variant="contained" color="info" fullWidth onClick={openBranchLinksDialogHandler}>
            See Branches
          </Button>

          <Button variant="outlined" color="warning" fullWidth onClick={captureImage}>
            Capture Image
          </Button>
        </div>
  
        <div
          style={{
            maxHeight: "500px", // Scrollable area
            overflowY: "auto", // Vertical scrolling for overflow
          }}
        >
          {nodes.length === 0 ? (
            <p style={{ color: "#333333" }}>No nodes yet. Start by adding a node.</p> // Stable text color
          ) : (
            nodes.map((node) => (
          <div
            key={node.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "#eee", // Light grey background
              borderRadius: "5px",
              cursor: "move",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background-color 0.2s ease",
              color: "#333333", // Ensure text is always dark
            }}
            onClick={() => {
              setSelectedNode(node); // Set selected node's info
              setOpenModalC(true); // Open modal when node is clicked
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1d1d1")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#eee")}
          >
            <span>{node.name}</span>
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Button to create branch */}
              <Tooltip title="Create Branch" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up to the node
                    handleBranchButtonClick(node, e);
                  }}
                  style={{
                    backgroundColor: "#4CAF50", // Green for create button
                    color: "white", // White icon
                    borderRadius: "50%",
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>

              {/* Button to delete node */}
              <Tooltip title="Delete Node" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up to the node
                    handleDeleteNode(node.id);
                  }}
                  style={{
                    backgroundColor: "#FF4D4D", // Red for delete button
                    color: "white", // White icon
                    borderRadius: "50%",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Branch Links Dialog */}
      <Dialog 
        open={openBranchLinksDialog} 
        onClose={closeBranchLinksDialogHandler} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          style: {
            width: "80%",  // Reduce the width to 80% of the original size
            borderRadius: "16px",  // Rounded corners for smooth visuals
            backdropFilter: "blur(15px)", // Apply blur effect for glassmorphism
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Soft shadow to create depth
            backgroundColor: "rgba(255, 255, 255, 0.15)", // Semi-transparent background
            border: "1px solid rgba(255, 255, 255, 0.3)",  // Light border to enhance glass effect
          }
        }}
      >
        <DialogTitle 
          style={{
            backgroundColor: "rgba(245, 245, 245, 0.7)",  // Light frosted background
            backdropFilter: "blur(8px)",  // Slight blur to create glass effect
            padding: "20px 30px", 
            fontSize: "20px",  // Slightly larger to stand out more
            fontWeight: 700,  // Stronger font weight for better impact
            color: "#333",
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
            letterSpacing: "0.5px", // Add a subtle letter-spacing for elegance
          }}
        >
          Established Parent-Child Relationships
        </DialogTitle>

        <DialogContent 
          style={{
            padding: "20px 30px",
            backgroundColor: "rgba(250, 250, 250, 0.8)",  // Slightly transparent to blend in
            backdropFilter: "blur(8px)", // Glassmorphism effect for content area
            fontSize: "16px", 
            color: "#444",
            maxHeight: "400px",  // Limit height for better scrolling
            overflowY: "auto", // Enable scroll when content exceeds height
          }}
        >
          {/* If no relationships */}
          {nodes.filter(node => node.children && node.children.length > 0).length === 0 ? (
            <div style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
              <p>No parent-child relationships have been established yet.</p>
            </div>
          ) : (
            nodes.map((parentNode) =>
              parentNode.children?.map((childNode) => (
                <div 
                  key={`${parentNode.id}-${childNode.id}`} 
                  style={{
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "12px 20px",
                    marginBottom: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",  // Card with frosted glass effect
                    borderRadius: "12px",  // Smooth rounded corners
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div style={{ flex: 1, fontWeight: 500, color: "#333", fontSize: "16px", wordBreak: "break-word" }}>
                    {parentNode.name} → {childNode.name}
                  </div>

                  {/* Delete icon for removal */}
                  <IconButton
                    onClick={() => handleDeleteRelation(parentNode.id, childNode.id)}
                    style={{
                      color: "#ff4d4d",  // Red color for delete
                      backgroundColor: "rgba(255, 77, 77, 0.1)", // Subtle background on hover
                      borderRadius: "50%", 
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 77, 77, 0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 77, 77, 0.1)")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))
            )
          )}
        </DialogContent>

        <DialogActions 
          style={{
            backgroundColor: "rgba(245, 245, 245, 0.7)", // Transparent background for actions
            backdropFilter: "blur(8px)",  // Apply subtle blur to the actions section
            padding: "16px 30px",
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            display: "flex", 
            justifyContent: "center", 
            gap: "10px",
          }}
        >
          <Button 
            onClick={closeBranchLinksDialogHandler} 
            color="primary" 
            variant="contained" 
            style={{
              backgroundColor: "#007bff", 
              color: "#fff", 
              fontWeight: "500", 
              padding: "10px 20px", 
              borderRadius: "8px", 
              boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)", 
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
 
      {/* Right Diagram Area - Workspace for the nodes */}
      <div
        ref={workspaceRef}
        style={{
          width: "65%",
          height: "700px",
          border: "none", // Removing the border for a cleaner look
          padding: "20px",
          position: "relative",
          borderRadius: "12px", // Smoother rounded corners
          backgroundColor: "#f9f9f9", // Lighter and cleaner background
          backgroundImage: "linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%)", // Smooth gradient background
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.12)", // Soft but prominent shadow for a premium feel
          overflow: "auto", // This enables scrolling when content overflows
          display: "flex", // Enables flex layout for nested content (can be useful for further tweaking)
          flexDirection: "column", // Keep the layout vertically aligned
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas to draw lines */}
        <canvas
          ref={canvasRef}
          width={workspaceRef.current ? workspaceRef.current.offsetWidth : 0}
          height={workspaceRef.current ? workspaceRef.current.offsetHeight : 0}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            background: "transparent",
          }}
        />

        {/* Node Rendering */}
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: node.position.x,
              top: node.position.y,
              width: "auto", // Allowing width to adjust based on content
              height: "auto", // Allowing height to adjust
              minWidth: "120px", // Ensure minimum width for readability
              maxWidth: "250px", // Max width to avoid nodes becoming too wide
              backgroundColor: "rgba(209, 231, 255, 0.8)", // Light blue with transparency for glass effect
              padding: "15px", // Spacious padding for better readability
              borderRadius: "8px", // Soft rounded corners for a modern look
              cursor: "move",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Light shadow for depth
              zIndex: 2,
              transition: "transform 0.2s ease, box-shadow 0.2s ease", // Smooth hover transition
              wordWrap: "break-word", // Ensures long text wraps inside the node box
              backdropFilter: "blur(10px)", // Apply blur for Glassmorphism
              border: "1px solid rgba(255, 255, 255, 0.2)", // Light border to enhance the frosted effect

              // Added Flexbox for centering content
              display: "flex",
              flexDirection: "column", // Align content vertically in column
              justifyContent: "center", // Center content vertically
              alignItems: "center", // Center content horizontally
            }}
            onMouseDown={(e) => handleMouseDown(e, node)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"; // Subtle scale effect on hover
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.2)"; // Enhanced shadow on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // Reset scale on mouse leave
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"; // Reset shadow
            }}
          >
            <span
              style={{
                color: "#333333", // Dark color for text to ensure readability
                fontWeight: "bold",
                fontSize: "14px", // Smaller, clean font for node names
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)", // Subtle text shadow to enhance readability
              }}
            >
              {node.name}
            </span>
          </div>
        ))}
      </div>

      {/* Branch Selection Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {nodes.map((node) => (
          // Exclude the node that is currently being selected as a parent from the options
          node.id !== selectedNodeId && (
            <MenuItem 
              key={node.id} 
              onClick={() => handleSelectChildNode(node)}
            >
              {node.name}
            </MenuItem>
          )
        ))}
      </Menu>

      {/* Node Question Form */}
      <NodeQuestionForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleNodeSubmit}
        selectionType={currentNodeType}
      />
      <ToastContainer />

      {/* Modal to display the captured image */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}  // Close the modal when clicked outside or on close
        aria-labelledby="image-modal"
        aria-describedby="captured-image"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.05)", // Ultra-transparent glass background
            padding: 3,
            borderRadius: "18px", // Luxuriously rounded corners
            boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3), 0 2px 30px rgba(255, 255, 255, 0.3)", // Rich shadows for depth
            maxWidth: "80%",
            maxHeight: "80%",
            overflow: "auto",
            backdropFilter: "blur(20px)", // Enhanced blur for true glassmorphism
            border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border for a frosted look
            animation: "glowAnimation 2.5s infinite alternate, scaleUp 2s infinite alternate", // Glowing & scaling animation
            zIndex: 9999,
          }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Captured workspace"
              className="glowing-image"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px", // Smooth, elegant borders for the image
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Enhanced shadow around the image
              }}
            />
          )}
        </Box>
      </Modal>

      <Modal
        open={openModalC}
        onClose={() => setOpenModalC(false)}  // Close the modal when clicked outside or on close
        aria-labelledby="node-info-modal"
        aria-describedby="node-information"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent white background
            backdropFilter: "blur(10px)", // Blur effect for the frosted-glass look
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
            maxWidth: "80%",  // Adjust width of modal if needed
            maxHeight: "80%", // Adjust height if needed
            overflow: "auto", // Ensure the modal content can scroll if it's too large
            textAlign: "center", // Center-align content in modal
          }}
        >
          {selectedNode ? (
            <div>
              <h2 style={{ color: "#333" }}>Node Information</h2>
              <p style={{ color: "#333" }}><strong>Name:</strong> {selectedNode.name}</p>
              <p style={{ color: "#333" }}><strong>Description Here</strong> {selectedNode.description}</p>
              {/* Add more details as necessary */}
            </div>
          ) : (
            <p style={{ color: "#333" }}>Loading...</p>
          )}
        </Box>
      </Modal>


    </div>
  );
  
};

export default NodeConfigurator;

