import React, { useState, useCallback } from "react";
import {
  Handle, Position, useReactFlow, NodeToolbar, useStore
} from "@xyflow/react";
import CenteredExpandingTextArea from "./CenteredExpandingTextArea";
import ResponsiveStar from "./ResponsiveStar";

const NodeContent = ({ data, isConnectable }) => {
  const [content, setContent] = useState(data.content || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { getNode, setNodes, setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const zoom = useStore((state) => state.transform[2]);

  const handleChange = useCallback((evt) => {
    setContent(evt.target.value);
  }, []);

  const handleStarClick = () => {
    setShowSuggestions(true);
    const currentNode = getNode(data.nodeId);

    // calls db
    const mockResult = [
      { id: "a12332", boardId: data.boardId, author: {}, authorId: 1, board: {}, createAt: "", updatedAt: "", title: "Suggestion 1", content: "Suggestion 1 content", xPos: currentNode.position.x + 100, yPos: currentNode.position.y, isSuggestion: true },
      { id: "q123213", boardId: data.boardId, author: {}, authorId: 1, board: {}, createAt: "", updatedAt: "", title: "Suggestion 2", content: "Suggestion 2 content", xPos: currentNode.position.x + 100, yPos: currentNode.position.y, isSuggestion: false }
    ]

    const newNodes = mockResult
      .filter(x => x.isSuggestion === true)
      .map(n => ({
        id: n.id,
        type: "custom",
        data: { content: n.content, id: n.id, isSuggestion: true },
        position: {
          x: n.xPos,
          y: n.yPos
        },
      }));

    console.log(newNodes)
    if (newNodes?.length > 0) {
      setNodes(prevNodes => [...prevNodes, ...newNodes]);
    }

    // Automatically add an edge between the current node and each new node
    const newEdges = newNodes.map((n) => ({
      id: `edge-${data.id}-${n.id}`, // Unique ID for each edge
      source: data.id, // Source is the current node
      target: n.id, // Target is the newly added node
    }));

    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  };

  const handleNodeMouseEnter = () => {
    setIsHovered(true);
    // if no suggestions in db

    // call llm

    // add nodes

  };

  const handleNodeMouseLeave = (e) => {
    setIsHovered(false);
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
      className={`rounded shadow-md p-4 w-50 h-auto relative transition-colors duration-200
        ${data.isSuggestion
          ? "bg-gray-100 dark:bg-gray-700 opacity-80"
          : "bg-white dark:bg-gray-800"
        }
        border border-gray-200 dark:border-gray-600
      `}
      onMouseEnter={handleNodeMouseEnter}
      onMouseLeave={handleNodeMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 dark:bg-blue-400"
      />
      <NodeToolbar
        isVisible={!data.isSuggestion && (isHovered || data.forceToolbarVisible)}
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
      <CenteredExpandingTextArea
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
      />
    </div>
  );
};

export default NodeContent;

