import React, { useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

function MindMapNode({ data, isConnectable }) {
  const [content, setContent] = useState(data.content || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const onChange = useCallback((evt) => {
    setContent(evt.target.value);
  }, []);

  const handleFocus = () => {
    setIsEditing(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    if (
      data.onSuggestionClick &&
      typeof data.onSuggestionClick === "function"
    ) {
      data.onSuggestionClick(suggestion, data);
    } else {
      console.warn("onSuggestionClick is not provided or is not a function");
    }
  };

  const suggestions = data.suggestions || [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3",
  ];

  return (
    <div className="bg-slate-300 dark:bg-slate-700 rounded border-1 border-black dark:border-white">
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <textarea
        className="my-1 mx-1 resize-none bg-slate-300 dark:bg-slate-700 text-black dark:text-white align-middle"
        value={content}
        onChange={onChange}
        onFocus={handleFocus} // when pressing on it
        onBlur={handleBlur} // when pressing away from it
        placeholder="Ideas go here..."
      />
      {isEditing && showSuggestions && (
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
      )}
    </div>
  );
}

export default MindMapNode;
