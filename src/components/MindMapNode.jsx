import React, { useState, useCallback, useRef } from "react";
import {
  Handle, Position, useReactFlow,
} from "@xyflow/react";
const NodeContent = ({ data, isConnectable }) => {
  const [content, setContent] = useState(data.content || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { getNode, setNodes } = useReactFlow();

  const nodeRef = useRef(null);

  const handleChange = useCallback((evt) => {
    setContent(evt.target.value);
  }, []);

  const handleNodeMouseEnter = () => {
    setShowSuggestions(true);
    // calls db
    const mockResult = [
      { id: 9923, boardId: 1, author: {}, authorId: 1, board: {}, createAt: "", updatedAt: "", title: "Suggestion 1", content: "Suggestion 1 content", xPos: 100, yPos: 100, isSuggestion: true },
      { id: 890123, boardId: 1, author: {}, authorId: 1, board: {}, createAt: "", updatedAt: "", title: "Suggestion 2", content: "Suggestion 2 content", xPos: 120, yPos: 120, isSuggestion: false }
    ]
    if (data.handleAddNode) {
      const newNodes = mockResult
        .filter(x => x.isSuggestion === true)
        .map(n => ({
          id: n.id,
          type: "custom",
          data: { content: n.content }, // Note: content should be in the data object
          position: {
            x: n.xPos,
            y: n.yPos
          },
        }));

      if (newNodes?.length > 0) {
        setNodes(prevNodes => [...prevNodes, ...newNodes]);
      }
    }

    // if no suggestions in db

    // call llm

    // add nodes

  };

  const handleNodeMouseLeave = (e) => {
    if (e === undefined) {
      return;
    }
    if (
      !e.relatedTarget
    ) {
      setShowSuggestions(false);
    }
  };

  // const handleSuggestionClick = useCallback(
  //   (suggestion, parentNode) => {
  //     if (parentNode && parentNode.position) {
  //       const parentPosition = parentNode.position;
  //       handleAddNode(
  //         suggestion,
  //         parentPosition.x + 200,
  //         parentPosition.y + 100,
  //       );
  //     } else {
  //       handleAddNode(suggestion);
  //     }
  //   },
  //   [handleAddNode],
  // );

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
      {showSuggestions}
    </div>
  );
};

export default NodeContent;

