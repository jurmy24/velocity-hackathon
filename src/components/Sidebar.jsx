import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const Sidebar = ({
  boards,
  onAddBoard,
  onSelectBoard,
  onDeleteBoard,
  selectedBoard,
}) => {
  const [newBoardName, setNewBoardName] = useState("");

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      onAddBoard(newBoardName.trim());
      setNewBoardName("");
    }
  };

  return (
    <div className="w-64 h-full bg-background border-r border-border p-4">
      <h1 className="text-2xl font-bold mb-4">MindFlow</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Boards</h2>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="flex-grow mr-2 px-2 py-1 border border-border rounded text-black"
            placeholder="New board name"
          />
          <button
            onClick={handleAddBoard}
            className="text-primary hover:text-primary-foreground"
          >
            <PlusCircle size={24} />
          </button>
        </div>
        <ul>
          {boards.map((board) => (
            <li
              key={board.id}
              className={`flex items-center justify-between cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded ${
                selectedBoard && selectedBoard.id === board.id
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              <span onClick={() => onSelectBoard(board.id)}>{board.name}</span>
              <button
                onClick={() => onDeleteBoard(board.id)}
                className="text-destructive hover:text-destructive-foreground"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

