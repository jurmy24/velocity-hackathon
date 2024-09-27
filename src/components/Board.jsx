import React, { useState, useCallback } from 'react';
import ReactFlow, { addEdge, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { MoreHorizontal } from 'lucide-react';

const Board = ({ board }) => {
  const [nodes, setNodes] = useState(board.nodes || []);
  const [edges, setEdges] = useState(board.edges || []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex items-center bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
        <h2 className="text-xl font-semibold mr-2">{board.name}</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Board;