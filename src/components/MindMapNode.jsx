import React, { useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import handleAddNode from "@/components/Board"

const NodeContent = ({ data, isConnectable }) => {
  const [content, setContent] = useState(data.content || "");
  const [showSuggestions, setShowSuggestions] = useState(false);


  const handleChange = useCallback((evt) => {
    setContent(evt.target.value);
  }, []);

  const handleNodeMouseEnter = () => {
    setShowSuggestions(true);
  };

  const handleNodeMouseLeave = (e) => {
    if (e === undefined) {
      return;
    }
    if (
      !e.relatedTarget ||
      !e.relatedTarget.closest(".suggestions-container")
    ) {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = useCallback(
    (suggestion, parentNode) => {
      if (parentNode && parentNode.position) {
        const parentPosition = parentNode.position;
        handleAddNode(
          suggestion,
          parentPosition.x + 200,
          parentPosition.y + 100,
        );
      } else {
        handleAddNode(suggestion);
      }
    },
    [handleAddNode],
  );

  const createSuggestionsCallback = () => {
    // calls db

    // if no suggestions in db

    // call llm
  }


  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 w-64 relative"
      onMouseEnter={handleNodeMouseEnter}
      onMouseLeave={handleNodeMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <textarea
        className="w-full h-24 p-2 border rounded resize-none"
        value={content}
        onChange={handleChange}
        placeholder="Write your idea here..."
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      {/* {showSuggestions && (
        <div className="suggestions-container absolute top-full left-0 mt-2 z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-gray-200 opacity-70 p-2 rounded mb-2 cursor-pointer hover:bg-gray-300"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default NodeContent;

