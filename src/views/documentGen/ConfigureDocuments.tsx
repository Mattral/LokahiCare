"use client"
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisualGraph from "./VisualGraph"; // Import the VisualGraph component
import NodeQuestionForm from "./NodeQuestionForm"; // Import the new NodeQuestionForm component

// Type for the node structure
interface Node {
  id: string;
  name: string;
  selectionType: "single" | "select1" | "multiSelect"; // Selection type for each node
  children: Node[];
  questionData?: any; // Store question data for each node
}

const ConfigureDocuments: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [openQuestionForm, setOpenQuestionForm] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [currentSelectionType, setCurrentSelectionType] = useState<"single" | "select1" | "multiSelect">("single");

  // State to control the open/close of the node type selection dialog
  const [openNodeTypeDialog, setOpenNodeTypeDialog] = useState(false);
  const [parentIdForNewNode, setParentIdForNewNode] = useState<string | null>(null);

    // Show the question form when selection type is changed
    const openQuestionFormForNode = (nodeId: string, selectionType: "single" | "select1" | "multiSelect") => {
      setSelectedNodeId(nodeId);
      setCurrentSelectionType(selectionType);
      setOpenQuestionForm(true);
    };

  // Add a new node
  const addNode = (parentId: string | null, selectionType: "single" | "select1" | "multiSelect") => {
    const newNode: Node = {
      id: `${Date.now()}`, // Unique ID based on timestamp
      name: "",
      selectionType: selectionType, // Set the selection type based on the button clicked
      children: [],
      questionData: {} // Initialize questionData to hold the label and other form data
    };

    if (parentId === null) {
      setNodes((prevNodes) => [...prevNodes, newNode]); // Add to root
    } else {
      const addChild = (nodeList: Node[]): Node[] => {
        return nodeList.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...node.children, newNode],
            };
          }
          if (node.children.length > 0) {
            return {
              ...node,
              children: addChild(node.children),
            };
          }
          return node;
        });
      };
      setNodes(addChild(nodes)); // Add child to parent node
    }

    // After adding the node, open the question form for that node
    openQuestionFormForNode(newNode.id, selectionType); // Pass the node id and selection type
  };
  

  // Handle changes to the node's name
  const handleNameChange = (id: string, newName: string) => {
    const updateName = (nodeList: Node[]): Node[] => {
      return nodeList.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            name: newName,
          };
        }
        if (node.children.length > 0) {
          return {
            ...node,
            children: updateName(node.children),
          };
        }
        return node;
      });
    };
    setNodes(updateName(nodes)); // Update node name
  };
  
  const handleSelectionTypeChange = (id: string, selectionType: "single" | "select1" | "multiSelect") => {
    const updateSelectionType = (nodeList: Node[]): Node[] => {
      return nodeList.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            selectionType,
          };
        }
        if (node.children.length > 0) {
          return {
            ...node,
            children: updateSelectionType(node.children),
          };
        }
        return node;
      });
    };
    setNodes(updateSelectionType(nodes)); // Update selection type for the node
    // Open the question form modal for the selected node
    openQuestionFormForNode(id, selectionType);
  };

  const removeNode = (id: string) => {
    const removeChild = (nodeList: Node[]): Node[] => {
      return nodeList.filter((node) => node.id !== id).map((node) => {
        if (node.children.length > 0) {
          return {
            ...node,
            children: removeChild(node.children),
          };
        }
        return node;
      });
    };
  
    setNodes(removeChild(nodes)); // Remove node recursively
  };

  const handleSubmitQuestionForm = (data: any) => {
    if (selectedNodeId) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === selectedNodeId) {
          return { ...node, questionData: data,
            name: data.question || node.name
           }; // Store question data in the selected node
        }
        return node;
      });
      setNodes(updatedNodes); // Update the nodes state with the new question data
      setOpenQuestionForm(false); // Close the question form
      toast.success("Question form submitted successfully!");
    }
  };
  


  // Recursive function to render node editing UI
  const renderNodeUI = (node: Node) => {
    return (
      <div key={node.id} style={{ marginBottom: "10px", marginLeft: "20px" }}>
        <TextField
          label={"Label Name"} 
          value={node.questionData?.question ||node.name} //
          onChange={(e) => handleNameChange(node.id, e.target.value)}
          style={{ width: "200px" }}
        />
        <FormControl style={{ marginLeft: "10px" }}>
          <InputLabel>Selection Type</InputLabel>
          <Select
            value={node.selectionType}
            onChange={(e) => handleSelectionTypeChange(node.id, e.target.value as "single" | "select1" | "multiSelect")}
          >
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="select1">One Choice</MenuItem>
            <MenuItem value="multiSelect">Multi Choice</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => removeNode(node.id)}
          style={{ marginLeft: "10px" }}
        >
          Remove
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => openNodeTypeSelection(node.id)} // Ask for the type of branch to add
          style={{ marginLeft: "10px" }}
        >
          Add Branch
        </Button>

        {/* Recursively render child nodes */}
        {node.children.length > 0 && (
          <div style={{ marginLeft: "20px" }}>
            {node.children.map((childNode) => renderNodeUI(childNode))}
          </div>
        )}
      </div>
    );
  };

  // Function to open the dialog for selecting the node type
  const openNodeTypeSelection = (parentId: string) => {
    setParentIdForNewNode(parentId); // Set the parent ID where the new node will be added
    setOpenNodeTypeDialog(true); // Open the dialog
  };

  // Function to handle the selection of node type for a branch
  const handleNodeTypeSelect = (selectionType: "single" | "select1" | "multiSelect") => {
    if (parentIdForNewNode) {
      addNode(parentIdForNewNode, selectionType); // Add the new branch to the selected parent
      setOpenNodeTypeDialog(false); // Close the dialog
      setParentIdForNewNode(null); // Reset the parent ID
    }
  };

  return (
    <>
      <div className="container mt-5" style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side - Node management */}
        <div style={{ width: "38%", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
          <h2>Configure Logic Flow</h2>

        {/* Button container using flexbox */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* New buttons for adding root nodes */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => addNode(null, "single")} // Add Plane Text Node
          >
            Add Plain Text Node
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => addNode(null, "select1")} // Add 1 Choice Node
          >
            Add 1 Choice Node
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => addNode(null, "multiSelect")} // Add Multi Choice Node
          >
            Add Multi-Choice Node
          </Button>
        </div>

          <div style={{ paddingTop: "20px" }}>
            {nodes.length === 0 ? (
              <p>No nodes yet. Start by adding a root node.</p>
            ) : (
              nodes.map((node) => renderNodeUI(node))
            )}
          </div>
        </div>

        {/* Right side - Visual Graph */}
        <div style={{ width: "58%", height: "calc(100vh - 100px)" }}>
          <VisualGraph nodes={nodes} />
        </div>
        
      </div>

      {/* Question Form Popup */}
      <NodeQuestionForm
        open={openQuestionForm}
        onClose={() => setOpenQuestionForm(false)}
        selectionType={currentSelectionType}
        onSubmit={handleSubmitQuestionForm}
      />

      {/* Node Type Selection Dialog */}
      <Dialog open={openNodeTypeDialog} onClose={() => setOpenNodeTypeDialog(false)}>
        <DialogTitle>Select Node Type</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleNodeTypeSelect("single")}
            style={{ marginBottom: "10px" }}
          >
            Plain Text Node
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleNodeTypeSelect("select1")}
            style={{ marginBottom: "10px" }}
          >
            1 Choice Node
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleNodeTypeSelect("multiSelect")}
          >
            Multi Choice Node
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNodeTypeDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ConfigureDocuments;
