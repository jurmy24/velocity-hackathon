import React, { useState, useCallback, useEffect } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  NodeToolbar,
  useStore,
} from "@xyflow/react";
import CenteredExpandingTextArea from "./CenteredExpandingTextArea";
import ResponsiveStar from "./ResponsiveStar";
import { CircleCheckBig } from "lucide-react";
import { updateNode } from "@/app/api/node";

const NodeContent = ({ id, data, isConnectable }) => {
  const [content, setContent] = useState(data.content || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { getNode, setNodes, setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const zoom = useStore((state) => state.transform[2]);

  useEffect(() => {
    setContent(data.content || "");
  }, [data.content]);

  const handleChange = useCallback(
    (evt) => {
      const newContent = evt.target.value;
      setContent(newContent); // Update local state

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, content: newContent },
            };
          }
          return node;
        }),
      );

      // Call the updateNode function from your API
      updateNode(parseInt(id), { content: newContent }).catch((error) => {
        console.error(`Error updating node ${id} content:`, error);
      });
    },
    [id, setNodes],
  );

  const acceptSuggestion = () => {
    // Logic to handle accepting a suggestion
    const updatedNode = { ...data, isSuggestion: false }; // Set isSuggestion to false to mark it as approved
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id ? { ...node, data: updatedNode } : node,
      ),
    );
    setShowSuggestions(false);
  };

  const handleStarClick = useCallback(() => {
    setShowSuggestions(true);
    const currentNode = getNode(id);

    if (!currentNode) {
      console.error(`Node with id ${id} not found`);
      return;
    }

    // In a real application, you would call your API or LLM here
    // For now, we'll use mock data
    const mockSuggestions = [
      { content: "Suggestion 1 content" },
      { content: "Suggestion 2 content" },
      { content: "Suggestion 3 content" },
    ];

    const newNodes = mockSuggestions.map((suggestion, index) => {
      const angle = (index / mockSuggestions.length) * 2 * Math.PI;
      const radius = 200; // Distance from the current node
      return {
        id: `suggestion-${id}-${index}`,
        type: "custom",
        position: {
          x: currentNode.position.x + Math.cos(angle) * radius,
          y: currentNode.position.y + Math.sin(angle) * radius,
        },
        data: {
          content: suggestion.content,
          isSuggestion: true,
          boardId: data.boardId,
        },
      };
    });

    setNodes((prevNodes) => [...prevNodes, ...newNodes]);

    const newEdges = newNodes.map((node) => ({
      id: `edge-${id}-${node.id}`,
      source: id,
      target: node.id,
      animated: true,
      type: "floating",
    }));

    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  }, [id, getNode, data.boardId, setNodes, setEdges]);

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
    if (!e.relatedTarget) {
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
        ${
          data.isSuggestion
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
        isVisible={isHovered || data.forceToolbarVisible}
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
          </button>
        )}

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
    </div>
  );
};

export default NodeContent;
