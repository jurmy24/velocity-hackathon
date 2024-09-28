import React, { useState, useCallback } from "react";
import { Handle, Position, NodeToolbar, useStore } from "@xyflow/react";
import CenteredExpandingTextarea from "./CenteredExpandingTextarea";
import ResponsiveStar from "./ResponsiveStar";

const NodeContent = ({ data, isConnectable }) => {
  const [content, setContent] = useState(data.content || "");
  const [isHovered, setIsHovered] = useState(false);
  const zoom = useStore((state) => state.transform[2]);

  const handleChange = useCallback((evt) => {
    setContent(evt.target.value);
  }, []);

  const handleStarClick = () => {
    console.log("Star button clicked for node:", data.id);
    // Add your custom logic here
  };

  return (
    <div
      className={`rounded shadow-md p-4 w-50 h-auto relative transition-colors duration-200
        ${
          data.isSuggestion
            ? "bg-gray-100 dark:bg-gray-700 opacity-80"
            : "bg-white dark:bg-gray-800"
        }
        border border-gray-200 dark:border-gray-600
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 dark:bg-blue-400"
      />
      <NodeToolbar
        isVisible={isHovered || data.forceToolbarVisible}
        position={{ y: -40 }}
        className="bg-white dark:bg-gray-700 rounded p-1 flex items-center border border-gray-200 dark:border-gray-600 shadow-lg transition-colors duration-200"
        align="end"
      >
        <button
          className="hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 transition-colors duration-200"
          onClick={handleStarClick}
        >
          <ResponsiveStar zoom={zoom} />
        </button>
      </NodeToolbar>
      <CenteredExpandingTextarea
        content={content}
        onChange={handleChange}
        placeholder={
          data.isSuggestion ? "Suggestion" : "Write your idea here..."
        }
        readOnly={data.isSuggestion}
        isSuggestion={data.isSuggestion}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 dark:bg-blue-400"
      />
    </div>
  );
};

export default NodeContent;
