import React from "react";
import { Stars } from "lucide-react";
import Chat from "./Chat"; // Import the new Chat component

const AISidebar = ({ board, isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 bg-white dark:bg-black h-full w-96 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <button
            onClick={onClose}
            className="mb-4 text-primary hover:text-primary-foreground"
          >
            <Stars size={24} />
          </button>
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="flex-grow overflow-hidden">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default AISidebar;
