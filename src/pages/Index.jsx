import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Board from '../components/Board';
import { ThemeToggle } from '../components/ThemeToggle';
import AISidebar from '../components/AISidebar';
import ToolButton from '../components/ToolButton';
import { Stars } from 'lucide-react';

const Index = () => {
  const [boards, setBoards] = useState([
    { id: 1, name: 'Hackathon', nodes: [], edges: [] },
    { id: 2, name: 'Thesis', nodes: [], edges: [] },
  ]);
  const [selectedBoard, setSelectedBoard] = useState(boards[0]);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  const handleAddBoard = (name) => {
    const newBoard = { id: boards.length + 1, name, nodes: [], edges: [] };
    setBoards([...boards, newBoard]);
  };

  const handleSelectBoard = (id) => {
    const board = boards.find((b) => b.id === id);
    if (board) setSelectedBoard(board);
  };

  const handleAddNode = () => {
    const newNode = {
      id: `node-${selectedBoard.nodes.length + 1}`,
      data: { label: `Node ${selectedBoard.nodes.length + 1}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setSelectedBoard({
      ...selectedBoard,
      nodes: [...selectedBoard.nodes, newNode],
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar boards={boards} onAddBoard={handleAddBoard} onSelectBoard={handleSelectBoard} />
      <div className="flex-grow relative">
        <Board board={selectedBoard} />
        <ToolButton onAddNode={handleAddNode} />
        <div className={`fixed top-4 right-4 flex items-center space-x-2 transition-all duration-300 ${isAISidebarOpen ? 'mr-64' : ''}`}>
          <button
            onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
            className="p-2 bg-background border border-border rounded-full shadow-lg text-primary hover:text-primary-foreground"
          >
            <Stars size={20} />
          </button>
          <ThemeToggle />
        </div>
        <AISidebar isOpen={isAISidebarOpen} onClose={() => setIsAISidebarOpen(false)} />
      </div>
    </div>
  );
};

export default Index;