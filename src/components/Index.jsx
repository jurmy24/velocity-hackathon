"use client";

import { ReactFlowProvider } from 'reactflow';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Board from '../components/Board';
import { ThemeToggle } from '../components/ThemeToggle';
import AISidebar from '../components/AISidebar';
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

  const handleDeleteBoard = (id) => {
    const updatedBoards = boards.filter((board) => board.id !== id);
    setBoards(updatedBoards);
    if (selectedBoard.id === id) {
      setSelectedBoard(updatedBoards[0] || null);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar
          boards={boards}
          onAddBoard={handleAddBoard}
          onSelectBoard={handleSelectBoard}
          onDeleteBoard={handleDeleteBoard}
          selectedBoard={selectedBoard}
        />
        <div className="flex-grow relative">
          {selectedBoard && <Board board={selectedBoard} />}
          <div className="fixed top-4 right-4">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
            className={`fixed top-1/2 -translate-y-1/2 right-0 p-2 bg-background border border-border rounded-l-lg shadow-lg text-primary hover:text-primary-foreground transition-all duration-300 ${isAISidebarOpen ? 'mr-64' : ''
              }`}
          >
            <Stars size={20} />
          </button>
          <AISidebar isOpen={isAISidebarOpen} onClose={() => setIsAISidebarOpen(false)} />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default Index;