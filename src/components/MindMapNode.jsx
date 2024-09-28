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
      setContent(newContent);

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

      updateNode(parseInt(id), { content: newContent }).catch((error) => {
        console.error(`Error updating node ${id} content:`, error);
      });
    },
    [id, setNodes],
  );

  const acceptSuggestion = () => {
    const updatedNode = { ...data, isSuggestion: false };
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: updatedNode } : node,
      ),
    );
    setShowSuggestions(false);
  };

  const streamContent = (node, fullContent) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullContent.length) {
        setNodes((prevNodes) =>
          prevNodes.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    content: fullContent.slice(0, index),
                  },
                }
              : n,
          ),
        );
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20); // Adjust the interval for faster or slower typing effect
  };

  const handleStarClick = useCallback(() => {
    setShowSuggestions(true);
    const currentNode = getNode(id);

    if (!currentNode) {
      console.error(`Node with id ${id} not found`);
      return;
    }

    const mockSuggestions = [
      { content: "RAG-powered bot with access to the ArXiv database" },
      {
        content:
          "AI-powered virtual research assistant for real-time data analysis",
      },
      {
        content:
          "Voice-activated research assistant for hands-free project guidance",
      },
    ];

    const newNodes = Array.from({ length: 3 }, (_, index) => {
      const angle = (index / 3) * 2 * Math.PI;
      const radius = 200;
      return {
        id: `suggestion-${id}-${index}`,
        type: "custom",
        position: {
          x: currentNode.position.x + Math.cos(angle) * radius,
          y: currentNode.position.y + Math.sin(angle) * radius,
        },
        data: {
          content: "",
          isSuggestion: true,
          boardId: data.boardId,
        },
      };
    });

    setNodes((prevNodes) => [...prevNodes, ...newNodes]);

    setTimeout(() => {
      newNodes.forEach((node, index) => {
        const randomSuggestion =
          mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
        streamContent(node, randomSuggestion.content);
      });
    }, 1000);

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
    </div>
  );
};

export default NodeContent;
