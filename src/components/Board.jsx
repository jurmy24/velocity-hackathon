import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MoreHorizontal } from 'lucide-react';
import ToolButton from './ToolButton';

const Board = ({ board }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(board.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(board.edges || []);
  const [tool, setTool] = useState('select');
  const [isLocked, setIsLocked] = useState(false);
  const reactFlowInstance = useReactFlow();

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

  const handleZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

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
      <ToolButton
        onAddNode={addNode}
        onSelectTool={setTool}
        selectedTool={tool}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFullScreen={handleFullScreen}
        onToggleLock={toggleLock}
        isLocked={isLocked}
      />
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