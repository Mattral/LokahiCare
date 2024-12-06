import React, { useState, useEffect } from "react";
import ReactFlow, { ReactFlowProvider, MiniMap, Controls } from "react-flow-renderer";
import html2canvas from "html2canvas";

// Type for the node structure
interface NodeData {
  id: string;
  name: string;
  selectionType: "single" | "select1" | "multiSelect";
  children: NodeData[];
}

interface VisualGraphProps {
  nodes: NodeData[];
}

const VisualGraph: React.FC<VisualGraphProps> = ({ nodes }) => {
  const [reactFlowNodes, setReactFlowNodes] = useState<any[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<any[]>([]);
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State to store the image URL

  // Function to generate flow data (with position and edges)
  const generateFlowData = (nodes: NodeData[]) => {
    let nodeList: any[] = [];
    let edgeList: any[] = [];
    let nodeIndex = 0;

    // Function to position nodes and manage vertical/horizontal spacing
    const positionNodes = (parentX: number, parentY: number, node: NodeData, depth: number = 0) => {
      const nodeId = `node-${nodeIndex++}`;
      const x = parentX + (depth * 200); // Adjust horizontal spacing between levels
      const y = parentY + (Math.random() * 100); // Randomize vertical position for now

      // Save the position of the node
      setNodePositions((prevPositions) => ({
        ...prevPositions,
        [nodeId]: { x, y }, // Store the position of the node
      }));

      // Construct the label to include the name and selection type
      const label = `${node.name} (${node.selectionType})`;

      nodeList.push({
        id: nodeId,
        data: { label }, // Include the selection type in the label
        position: { x, y },
        style: {
          borderRadius: 5,
          padding: 10,
          background: "#f4f4f4",
          border: "1px solid #333",
        },
      });

      if (node.children.length > 0) {
        // If there are children, position them one by one
        node.children.forEach((child, index) => {
          const childNodeId = positionNodes(x, y + (index * 150), child, depth + 1); // Adjust y for each child
          edgeList.push({
            id: `edge-${nodeId}-${childNodeId}`,
            source: nodeId,
            target: childNodeId,
            animated: true,
            style: { stroke: "#333" },
          });
        });
      }

      return nodeId;
    };

    nodes.forEach((node) => positionNodes(0, 0, node)); // Start positioning from the top-left corner

    return { nodes: nodeList, edges: edgeList };
  };

  useEffect(() => {
    const { nodes: reactFlowNodesData, edges: reactFlowEdgesData } = generateFlowData(nodes);
    setReactFlowNodes(reactFlowNodesData);
    setReactFlowEdges(reactFlowEdgesData);
  }, [nodes]);

  // Handle node drag stop event to update positions
  const onNodeDragStop = (event: any, node: any) => {
    const updatedPositions = { ...nodePositions, [node.id]: node.position }; // Update the position in state
    setNodePositions(updatedPositions); // Update the node positions

    const updatedNodes = reactFlowNodes.map((n) =>
      n.id === node.id ? { ...n, position: node.position } : n
    );
    setReactFlowNodes(updatedNodes); // Update node position after drag
  };

  // Function to capture and show image in a modal
  const captureAndShowImage = () => {
    // Capture the entire ReactFlow container
    const graphContainer = document.getElementById("react-flow-container");
    if (graphContainer) {
      html2canvas(graphContainer, {
        scrollX: window.scrollX, // Include the full scroll position for large graphs
        scrollY: window.scrollY,
        width: graphContainer.scrollWidth, // Ensure the full width of the container is captured
        height: graphContainer.scrollHeight, // Ensure the full height of the container is captured
        x: 0, // Start at the top-left of the container
        y: 0, // Start at the top-left of the container
        useCORS: true, // Allow cross-origin images (if needed)
        scale: 2, // Optionally increase the scale for better image quality
      }).then((canvas) => {
        // Convert the canvas to an image URL
        const imageUrl = canvas.toDataURL();
        setImageUrl(imageUrl); // Store the image URL
        setShowModal(true); // Show the modal
      });
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setImageUrl(null); // Clear the image URL when closing the modal
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          fitView
          onNodeDragStop={onNodeDragStop} // Ensure positions are updated after dragging
          style={{ width: "100%", height: "100%" }}
          id="react-flow-container" // Assign ID to the ReactFlow container
        >
          </ReactFlow>
          <MiniMap />
          <Controls />
        </ReactFlowProvider>

      {/* Button to trigger the image capture */}
      <button
        onClick={captureAndShowImage}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 10, // Ensures the button is clickable even when modal is open
        }}
      >
        Preview Graph in Popup
      </button>

      {/* Modal to show the captured image */}
      {showModal && imageUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // Ensure modal is on top of other elements
          }}
          onClick={closeModal} // Close modal when clicking outside
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              position: "relative",
              maxWidth: "80%", // Set max width to 80% of the viewport
              maxHeight: "70%", // Set max height to 0% of the viewport
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", // Add some shadow for depth
              overflow: "hidden", // Prevent overflow of the modal
              transition: "transform 0.3s ease-out", // Smooth entrance effect

            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
          >
          <img
            src={imageUrl}
            alt="Graph Preview"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain", // Ensure image fits well within the modal
              transition: "transform 0.3s ease", // Smooth zoom effect
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLImageElement; // Cast event.target to HTMLImageElement
              target.style.transform = "scale(1.05)"; // Zoom in the image on hover
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLImageElement; // Cast event.target to HTMLImageElement
              target.style.transform = "scale(1)"; // Reset zoom
            }}
          />
             <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                padding: "5px 10px",
                cursor: "pointer",
                zIndex: 1001, // Ensure close button is on top of the image
                transition: "background 0.3s ease", // Smooth transition for background color

              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement; // Cast event.target to HTMLButtonElement
                target.style.background = "#FF6347"; // Change background color on hover
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement; // Cast event.target to HTMLButtonElement
                target.style.background = "rgba(0, 0, 0, 0.5)"; // Reset background color on hover leave
              }}

            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualGraph;
