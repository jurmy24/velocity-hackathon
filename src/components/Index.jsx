"use client";
import { ReactFlowProvider } from "reactflow";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./LeftSidebar";
import Board from "../components/Board";
import { ThemeToggle } from "../components/ThemeToggle";
import AISidebar from "./RightSidebar";
import { Stars } from "lucide-react";
import { getAllBoards, createBoard, deleteBoard } from "@/app/api/board";

const Index = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBoards();
  }, []);

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

  const handleSelectBoard = (id) => {
    const board = boards.find((b) => b.id === id);
    if (board) {
      setSelectedBoard(board);
      router.push(`/board/${id}`);
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
          router.push(`/board/${updatedBoards[0].id}`);
        } else {
          setSelectedBoard(null);
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error deleting board:", error);
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
          <div className="fixed top-4 right-4 bg-white dark:bg-black">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
            className={`fixed top-1/2 -translate-y-1/2 right-0 p-2 bg-white dark:bg-black border border-border rounded-l-lg shadow-lg text-primary hover:text-primary-foreground transition-all duration-300 ${
              isAISidebarOpen ? "mr-64" : ""
            }`}
          >
            <Stars size={20} />
          </button>
          <AISidebar
            isOpen={isAISidebarOpen}
            onClose={() => setIsAISidebarOpen(false)}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default Index;

