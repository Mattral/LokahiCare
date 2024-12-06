"use client";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mermaid from "mermaid"; // Mermaid core library
import NodeQuestionForm from "./NodeQuestionForm"; // Existing form component

interface Node {
  id: string;
  name: string;
  type: "single" | "select1" | "multiSelect"; // Define types of nodes
  diagramId: string;
  parentId?: string; // Parent ID to create hierarchy
  children?: Node[]; // Child nodes to form a branch
  isBranch?: boolean; // Flag to check if this node has branches
}

const NodeConfigurator: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentNodeType, setCurrentNodeType] = useState<"single" | "select1" | "multiSelect">("single");
  const [currentNodeName, setCurrentNodeName] = useState("");
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parentNodeForBranch, setParentNodeForBranch] = useState<Node | null>(null); // Track parent for branch nodes

  const mermaidRef = useRef<any>(null);

  // Open form for creating nodes (regular or branch)
  const openFormForNode = (type: "single" | "select1" | "multiSelect", parentNode?: Node) => {
    setCurrentNodeType(type);
    setParentNodeForBranch(parentNode || null); // Set the parent node for branches
    setOpenForm(true);
  };

  const handleNodeSubmit = (data: any, parentId?: string, isBranchNode: boolean = false) => {
    setIsLoading(true);
  
    const newNode: Node = {
      id: `${Date.now()}`,
      name: currentNodeName || data.question,
      type: currentNodeType,
      diagramId: `node_${Date.now()}`,
      parentId: parentId, // Set parentId if it's a branch
      children: [],
      isBranch: isBranchNode, // If it's a branch, mark it
    };
  
    console.log("New Node created:", newNode);
  
    if (!parentId) {
      setNodes((prevNodes) => {
        console.log("Previous nodes before adding root-level node:", prevNodes);
        const updatedNodes = [...prevNodes, newNode];
        console.log("Final nodes after adding root-level node:", updatedNodes);
        return updatedNodes; // Ensure returning the updated state
      });
    } else {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id === parentId) {
            console.log("Parent node before update:", node);
  
            node.isBranch = true; // Mark as having children
            node.children = [...(node.children || []), newNode]; // Add as child of parent node
  
            console.log("Parent node after update:", node);
          }
          return node;
        });
  
        console.log("Updated nodes after adding child:", updatedNodes);
        return updatedNodes; // Ensure returning the updated state
      });
    }
  
    setTimeout(() => {
      setOpenForm(false);
      setCurrentNodeName("");
      toast.success("Node created successfully!");
      setIsLoading(false);
  
      // Final state update after submission (ensure it's returning the updated state)
      setNodes((finalNodes) => {
        console.log("Final nodes after submission:", finalNodes);
        return finalNodes; // Ensure the return here
      });
    }, 0);
  };
  
  
  


  // Handle deletion of a node
  const handleDeleteNode = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    toast.success("Node deleted successfully!");
  };

  // Handle dragging of nodes
  const handleDragStart = (node: Node) => {
    setDraggedNode(node);
  };

  // Handle drop event (drag and drop functionality)
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (draggedNode) {
      const updatedNodes = nodes.map((node) =>
        node.id === draggedNode.id ? { ...node, diagramId: draggedNode.diagramId } : node
      );
      setNodes(updatedNodes);
    }
  };

  // Generate the Mermaid diagram based on the node structure
  // ToDo: Current Logic is wrong and need to fix!
const generateMermaidDiagram = () => {
  let diagram = `flowchart TD;\n`; // Default Top-Down layout for root nodes

  // Generate diagram with all nodes and their links
  nodes.forEach((node, index) => {
    const nodeName = `"${node.name.replace(/"/g, '\\"')}"`; // Escape double quotes in node names
    diagram += `  ${node.diagramId}[${nodeName}];\n`; // Add the current node

    // If this is not the first node and the node is not a branch, link the previous node to the current node (Top-Down)
    if (index > 0 && !node.isBranch && !node.parentId) {
      diagram += `  ${nodes[index - 1].diagramId} --> ${node.diagramId};\n`;
    }

    // If the node has children (branch), create links for child nodes (Top-Down)
    if (node.isBranch && node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        diagram += `  ${node.diagramId} --> ${child.diagramId};\n`; // Parent to child link (Top-Down)
      });
    }
  });

  console.log("Generated Mermaid Diagram:", diagram); // Log the generated diagram

  return diagram;
};



  // UseEffect to update the Mermaid diagram whenever the nodes change
  useEffect(() => {
    // Log the updated nodes when they change
    console.log("Nodes have been updated:", nodes);
  
    if (mermaidRef.current) {
      const diagram = generateMermaidDiagram();
      mermaidRef.current.innerHTML = `<div class="mermaid">${diagram}</div>`;
      mermaid.contentLoaded();
    }
  }, [nodes]);  // Trigger this when `nodes` changes
  

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", gap: "20px" }}>
      {/* Left Sidebar for Node Creation */}
      <div
        style={{
          width: "30%",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2>Create Node</h2>
        <div>
          <Button variant="contained" color="primary" onClick={() => openFormForNode("single")} fullWidth>
            Add Plain Text Node
          </Button>
          <Button variant="contained" color="secondary" onClick={() => openFormForNode("select1")} fullWidth>
            Add One Choice Node
          </Button>
          <Button variant="contained" color="success" onClick={() => openFormForNode("multiSelect")} fullWidth>
            Add Multi-Choice Node
          </Button>
        </div>

        <div>
          {nodes.length === 0 ? (
            <p>No nodes yet. Start by adding a node.</p>
          ) : (
            nodes.map((node) => (
              <div
                key={node.id}
                draggable
                onDragStart={() => handleDragStart(node)}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "#eee",
                  borderRadius: "5px",
                  cursor: "move",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{node.name}</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Add Branch (Plus Button) */}
                  <Tooltip title="Create Branch" arrow>
                    <IconButton
                      onClick={() => openFormForNode(currentNodeType, node)} // Pass current node as parent for branch
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        borderRadius: "50%",
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Delete Node */}
                  <Tooltip title="Delete Node" arrow>
                    <IconButton
                      onClick={() => handleDeleteNode(node.id)}
                      style={{
                        backgroundColor: "#ff4d4d",
                        color: "white",
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

      {/* Right Diagram Area - Mermaid Diagram */}
      <div
        style={{
          width: "65%",
          height: "calc(100vh - 100px)",
          border: "1px solid #ccc",
          padding: "20px",
          position: "relative",
          borderRadius: "10px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "auto",
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        ref={mermaidRef}
      >
        <h2>Diagram Playground</h2>
        {isLoading ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
            <p>Rendering Diagram...</p>
          </div>
        ) : (
          <div className="mermaid">
            {generateMermaidDiagram()}
          </div>
        )}
      </div>

      {/* Node Question Form */}
      <NodeQuestionForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleNodeSubmit}
        selectionType={currentNodeType}
      />
      <ToastContainer />
    </div>
  );
};

export default NodeConfigurator;
