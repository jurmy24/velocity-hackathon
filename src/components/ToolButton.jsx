import React from 'react';
import { MousePointer, PlusCircle, ZoomIn, ZoomOut, Maximize, Lock } from 'lucide-react';

const ToolButton = ({ onAddNode, onSelectTool, selectedTool, onZoomIn, onZoomOut, onFullScreen, onToggleLock, isLocked }) => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-background border border-border rounded-lg shadow-lg">
      <button
        className={`block p-2 hover:bg-accent hover:text-accent-foreground ${selectedTool === 'select' ? 'bg-accent text-accent-foreground' : ''}`}
        onClick={() => onSelectTool('select')}
      >
        <MousePointer size={20} />
      </button>
      <button
        className={`block p-2 hover:bg-accent hover:text-accent-foreground ${selectedTool === 'add' ? 'bg-accent text-accent-foreground' : ''}`}
        onClick={() => {
          onSelectTool('add');
          onAddNode();
        }}
      >
        <PlusCircle size={20} />
      </button>
      <button className="block p-2 hover:bg-accent hover:text-accent-foreground" onClick={onZoomIn}>
        <ZoomIn size={20} />
      </button>
      <button className="block p-2 hover:bg-accent hover:text-accent-foreground" onClick={onZoomOut}>
        <ZoomOut size={20} />
      </button>
      <button className="block p-2 hover:bg-accent hover:text-accent-foreground" onClick={onFullScreen}>
        <Maximize size={20} />
      </button>
      <button
        className={`block p-2 hover:bg-accent hover:text-accent-foreground ${isLocked ? 'bg-accent text-accent-foreground' : ''}`}
        onClick={onToggleLock}
      >
        <Lock size={20} />
      </button>
    </div>
  );
};

export default ToolButton;