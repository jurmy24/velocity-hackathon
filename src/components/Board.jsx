import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  MoreHorizontal,
  MousePointer,
  PlusCircle,
  ZoomIn,
  ZoomOut,
  Maximize,
  Lock,
} from "lucide-react";
import NodeContent from "./MindMapNode";

const nodeTypes = {
  custom: NodeContent,
};

const Board = ({ board }) => {
  const [nodes, setNodes] = useState(board.nodes || []);
  const [edges, setEdges] = useState(board.edges || []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddNode = useCallback(
    (content = "", x = Math.random() * 500, y = Math.random() * 500) => {
      const newNode = {
        id: (nodes.length + 1).toString(),
        type: "custom",
        position: { x, y },
        data: {
          content,
          suggestions: [
            "New Suggestion 1",
            "New Suggestion 2",
            "New Suggestion 3",
          ],
          onSuggestionClick: handleSuggestionClick,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes],
  );

  const handleSuggestionClick = useCallback(
    (suggestion, parentNode) => {
      if (parentNode && parentNode.position) {
        const parentPosition = parentNode.position;
        handleAddNode(
          suggestion,
          parentPosition.x + 200,
          parentPosition.y + 100,
        );
      } else {
        // Fallback to a default position if parentNode or its position is undefined
        handleAddNode(suggestion);
      }
    },
    [handleAddNode],
  );
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [tool, setTool] = useState("select");
  const [isLocked, setIsLocked] = useState(false);

  const { zoomIn, zoomOut } = useReactFlow();

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleFullScreen = useCallback(() => {
    // Implement full screen functionality
  }, []);

  const toggleLock = useCallback(() => {
    setIsLocked(!isLocked);
  }, [isLocked]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex items-center bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
        <h2 className="text-xl font-semibold mr-2">{board.name}</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="z-50 absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-black border border-border rounded-lg shadow-lg">
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${tool === "select" ? "bg-accent text-accent-foreground" : ""}`}
          onClick={() => setTool("select")}
        >
          <MousePointer size={20} />
        </button>
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${tool === "add" ? "bg-accent text-accent-foreground" : ""}`}
          onClick={() => {
            setTool("add");
            handleAddNode();
          }}
        >
          <PlusCircle size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={handleZoomIn}
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={handleZoomOut}
        >
          <ZoomOut size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={handleFullScreen}
        >
          <Maximize size={20} />
        </button>
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${isLocked ? "bg-accent text-accent-foreground" : ""}`}
          onClick={toggleLock}
        >
          <Lock size={20} />
        </button>
      </div>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onSuggestionClick: handleSuggestionClick,
          },
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnScroll
        selectionOnDrag
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        zoomOnPinch={!isLocked}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        minZoom={0.2}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Board;

