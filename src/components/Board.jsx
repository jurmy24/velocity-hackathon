import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MoreHorizontal, MousePointer, PlusCircle, ZoomIn, ZoomOut, Maximize, Lock } from 'lucide-react';

const Board = ({ board }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(board.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(board.edges || []);
  const [tool, setTool] = useState('select');
  const [isLocked, setIsLocked] = useState(false);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      type: 'default',
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  const handleZoomIn = useCallback((zoomIn) => {
    zoomIn();
  }, []);

  const handleZoomOut = useCallback((zoomOut) => {
    zoomOut();
  }, []);

  const handleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
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
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background border border-border rounded-lg shadow-lg">
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${tool === 'select' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setTool('select')}
        >
          <MousePointer size={20} />
        </button>
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${tool === 'add' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => {
            setTool('add');
            addNode();
          }}
        >
          <PlusCircle size={20} />
        </button>
        <button className="block p-2 hover:bg-accent hover:text-accent-foreground" onClick={() => handleZoomIn()}>
          <ZoomIn size={20} />
        </button>
        <button className="block p-2 hover:bg-accent hover:text-accent-foreground" onClick={() => handleZoomOut()}>
          <ZoomOut size={20} />
        </button>
        <button className="block p-2 hover:bg-accent hover:text-accent-foreground" onClick={handleFullScreen}>
          <Maximize size={20} />
        </button>
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${isLocked ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={toggleLock}
        >
          <Lock size={20} />
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnScroll
        selectionOnDrag
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        minZoom={0.2}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Board;