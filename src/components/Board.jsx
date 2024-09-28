import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
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
  const [edges, setEdges] = useState(board.nodes?.connections || []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const { zoomIn, zoomOut } = useReactFlow();

  // 

  const handleAddNode = useCallback(
    (id = (nodes.length + 1).toString(), content = "", x = Math.random() * 500, y = Math.random() * 500) => {
      const newNode = {
        id: id,
        type: "custom",
        position: { x, y },
        data: {
          content,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes],
  );

  const handleFullScreen = useCallback(() => {
    // Implement full screen functionality
  }, []);

  // const toggleLock = useCallback(() => {
  //   setIsLocked(!isLocked);
  // }, [isLocked]);

  if (!board) {
    return (
      <div className="flex-grow flex items-center justify-center">
        Select a board to get started
      </div>
    );
  }
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex items-center bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
        <h2 className="text-xl font-semibold mr-2">{board.title}</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="z-50 absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-black border border-border rounded-lg shadow-lg">
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground`}
        >
          <MousePointer size={20} />
        </button>
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground`}
          onClick={() => {
            handleAddNode();
          }}
        >
          <PlusCircle size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={zoomIn}
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={zoomOut}
        >
          <ZoomOut size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={handleFullScreen}
        >
          <Maximize size={20} />
        </button>
        {/* <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${isLocked ? "bg-accent text-accent-foreground" : ""}`}
          onClick={toggleLock}
        >
          <Lock size={20} />
        </button> */}
      </div>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            handleAddNode,
          },
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        // panOnScroll
        selectionOnDrag
        // panOnDrag={!isLocked}
        // zoomOnScroll={!isLocked}
        // zoomOnPinch={!isLocked}
        // nodesDraggable={!isLocked}
        // nodesConnectable={!isLocked}
        // elementsSelectable={!isLocked}
        minZoom={0.2}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
      >
        <Background variant="dots" gap={15} size={1} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
};

export default Board;
