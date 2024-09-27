import React from "react";
import { Stars } from "lucide-react";

const AISidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <button
          onClick={onClose}
          className="mb-4 text-primary hover:text-primary-foreground"
        >
          <Stars size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-2">AI Assistant</h2>
        {/* Add AI assistant content here */}
      </div>
    </div>
  );
};

export default AISidebar;

