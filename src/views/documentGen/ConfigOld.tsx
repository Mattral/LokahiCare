"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisualGraph from "./VisualGraph"; // Import the VisualGraph component
import NodeQuestionForm from "./NodeQuestionForm"; // Import the new NodeQuestionForm component

// Type for the node structure
interface Node {
  id: string;
  name: string;
  selectionType: "single" | "select1" | "multiSelect";
  children: Node[];
  questionData?: any; // Store question data for each node
}

const ConfigureDocuments: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [openQuestionForm, setOpenQuestionForm] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [currentSelectionType, setCurrentSelectionType] = useState<"single" | "select1" | "multiSelect">("single");

  // Add a new node
  const addNode = (parentId: string | null) => {
    const newNode: Node = {
      id: `${Date.now()}`, // Unique ID based on timestamp
      name: "",
      selectionType: "single",
      children: [],
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
  };

  // Recursive function to remove a node
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

    setNodes(removeChild(nodes)); // Remove node
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

  // Handle changes to the node's selection type
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
    setNodes(updateSelectionType(nodes)); // Update selection type

    // Open the question form modal for the selected node
    openQuestionFormForNode(id, selectionType);
  };

  // Show the question form when selection type is changed
  const openQuestionFormForNode = (nodeId: string, selectionType: "single" | "select1" | "multiSelect") => {
    setSelectedNodeId(nodeId);
    setCurrentSelectionType(selectionType);
    setOpenQuestionForm(true);
  };

  // Handle submitting the question form
  const handleSubmitQuestionForm = (data: any) => {
    if (selectedNodeId) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === selectedNodeId) {
          return { ...node, questionData: data }; // Save the data to the node
        }
        return node;
      });
      setNodes(updatedNodes);
      toast.success("Question form submitted successfully!");
    }
  };

  // Recursive function to render node editing UI
  const renderNodeUI = (node: Node) => {
    return (
      <div key={node.id} style={{ marginBottom: "10px", marginLeft: "20px" }}>
        <TextField
          label="Node Name"
          value={node.name}
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
            <MenuItem value="select1">Select 3</MenuItem>
            <MenuItem value="multiSelect">Multi Select</MenuItem>
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
          onClick={() => addNode(node.id)} // Add child node
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

  return (
    <>
      <div className="container mt-5" style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side - Node management */}
        <div style={{ width: "48%", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
          <h2>Configure Documents</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => addNode(null)} // Add root node
            style={{ marginBottom: "20px" }}
          >
            Add Root Node
          </Button>

          <div>
            {nodes.length === 0 ? (
              <p>No nodes yet. Start by adding a root node.</p>
            ) : (
              nodes.map((node) => renderNodeUI(node))
            )}
          </div>
        </div>

        {/* Right side - Visual Graph */}
        <div style={{ width: "48%", height: "calc(100vh - 100px)" }}>
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

      <ToastContainer />
    </>
  );
};

export default ConfigureDocuments;
