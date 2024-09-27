import React from 'react';
import { MousePointer, PlusCircle } from 'lucide-react';

const ToolButton = ({ onAddNode }) => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-background border border-border rounded-lg shadow-lg">
      <button className="block p-2 hover:bg-accent hover:text-accent-foreground">
        <MousePointer size={20} />
      </button>
      <button className="block p-2 hover:bg-accent hover:text-accent-foreground" onClick={onAddNode}>
        <PlusCircle size={20} />
      </button>
    </div>
  );
};

export default ToolButton;