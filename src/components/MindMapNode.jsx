import React, { useState, useCallback } from "react";
import {
  Handle, Position, useReactFlow, NodeToolbar, useStore
} from "@xyflow/react";
import CenteredExpandingTextArea from "./CenteredExpandingTextArea";
import ResponsiveStar from "./ResponsiveStar";
import { CircleCheckBig } from "lucide-react";

const NodeContent = ({ data, isConnectable }) => {
  const [content, setContent] = useState(data.content || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { getNode, setNodes, setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const zoom = useStore((state) => state.transform[2]);

  const handleChange = useCallback((evt) => {
    setContent(evt.target.value);
  }, []);

  const acceptSuggestion = () => {
    // Logic to handle accepting a suggestion
    const updatedNode = { ...data, isSuggestion: false }; // Set isSuggestion to false to mark it as approved
    setNodes((nodes) => nodes.map((node) => node.id === data.id ? { ...node, data: updatedNode } : node));
    setShowSuggestions(false);
  };

  const handleStarClick = () => {

    // if no suggestions in db

    // call llm

    // add nodes

    setShowSuggestions(true);
    const currentNode = getNode(data.nodeId);

    // calls db
    const mockResult = [
      { id: "a12332", boardId: data.boardId, author: {}, authorId: 1, board: {}, createAt: "", updatedAt: "", title: "Suggestion 1", content: "Suggestion 1 content", xPos: currentNode.position.x + 100, yPos: currentNode.position.y + 10, isSuggestion: true },
      { id: "a12331", boardId: data.boardId, author: {}, authorId: 1, board: {}, createAt: "", updatedAt: "", title: "Suggestion 2", content: "Suggestion 2 content", xPos: currentNode.position.x - 100, yPos: currentNode.position.y - 20, isSuggestion: true },
      { id: "a12334", boardId: data.boardId, author: {}, authorId: 1, board: {}, createAt: "", updatedAt: "", title: "Suggestion 3", content: "Suggestion 3 content", xPos: currentNode.position.x - 50, yPos: currentNode.position.y - 30, isSuggestion: true },
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
      id: `edge-${data.id}-${n.id}`,
      source: data.id,
      target: n.id,
      animated: true,
      type: "floating"
    }));

    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  };

  const handleNodeMouseEnter = () => {
    setIsHovered(true);
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
          ? "bg-gray-100 dark:bg-gray-500"
          : "bg-white dark:bg-gray-800"
        }
        border border-gray-200 dark:border-gray-600
      `}
      onMouseEnter={handleNodeMouseEnter}
      onMouseLeave={handleNodeMouseLeave}
    >
      <Handle type="source" position={Position.Top} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="source" position={Position.Left} id="d" />
      {/* <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 dark:bg-blue-400"
      /> */}
      <NodeToolbar
        isVisible={(isHovered || data.forceToolbarVisible)}
        position={{ y: -40 }}
        className="bg-white dark:bg-gray-700 rounded p-1 flex items-center border border-gray-200 dark:border-gray-600 shadow-lg transition-colors duration-200"
        align="end"
      >
        {!data.isSuggestion && (
          <button
            className="hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 transition-colors duration-200"
            onClick={handleStarClick}
          >
            <ResponsiveStar zoom={zoom} />
          </button>)
        }

        {data.isSuggestion && (
          <button
            className="hover:bg-green-100 dark:hover:bg-green-600 rounded p-1 transition-colors duration-200"
            onClick={acceptSuggestion}
          >
            <CircleCheckBig size={10} className="text-green-500" />
          </button>
        )}
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
      {/* <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      /> */}
    </div >
  );
};

export default NodeContent;

