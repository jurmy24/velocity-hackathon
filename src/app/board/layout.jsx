"use client";

import { ReactFlowProvider } from "@xyflow/react";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/LeftSidebar";
import Board from "@/components/Board";
import { ThemeToggle } from "@/components/ThemeToggle";
import AISidebar from "@/components/RightSidebar";
import { Stars } from "lucide-react";
import { getAllBoards, createBoard, deleteBoard } from "@/app/api/board";

export default function RootLayout() {
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetchBoards();
  });

  const fetchBoards = async () => {
    try {
      const fetchedBoards = await getAllBoards();
      setBoards(fetchedBoards);
      if (fetchedBoards.length > 0 && !selectedBoard) {
        setSelectedBoard(fetchedBoards[0]);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleAddBoard = async (name) => {
    try {
      const createdBoard = await createBoard(name, 1); // Assuming authorId is 1 for now
      setBoards([...boards, createdBoard]);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      await deleteBoard(id);
      const updatedBoards = boards.filter((board) => board.id !== id);
      setBoards(updatedBoards);
      if (selectedBoard && selectedBoard.id === id) {
        if (updatedBoards.length > 0) {
          setSelectedBoard(updatedBoards[0]);
        } else {
          setSelectedBoard(null);
        }
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ReactFlowProvider>
            <div className="flex h-screen bg-background text-foreground">
              <Sidebar
                boards={boards}
                selectedBoard={selectedBoard}
                setSelectedBoard={setSelectedBoard}
                onAddBoard={handleAddBoard}
                onDeleteBoard={handleDeleteBoard}
              />
              <div className="flex-grow relative">
                {selectedBoard && <Board board={selectedBoard} />}
                <div className="fixed top-4 right-4 bg-white dark:bg-black">
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
                  className={`fixed top-1/2 -translate-y-1/2 right-0 p-2 bg-white dark:bg-black border border-border rounded-l-lg shadow-lg text-primary hover:text-primary-foreground transition-all duration-300 ${
                    isAISidebarOpen ? "mr-96" : ""
                  }`}
                >
                  <Stars size={20} />
                </button>
                <AISidebar
                  board={selectedBoard}
                  isOpen={isAISidebarOpen}
                  onClose={() => setIsAISidebarOpen(false)}
                />
              </div>
            </div>
          </ReactFlowProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
