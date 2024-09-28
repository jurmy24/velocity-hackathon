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
    const words = fullContent.split(/\s+/);
    let currentIndex = 0;

    const streamChunk = () => {
      if (currentIndex < words.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1; // Random chunk size between 1 and 3 words
        const newChunk = words
          .slice(currentIndex, currentIndex + chunkSize)
          .join(" ");

        setNodes((prevNodes) =>
          prevNodes.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    content: n.data.content
                      ? n.data.content + " " + newChunk
                      : newChunk,
                  },
                }
              : n,
          ),
        );
        currentIndex += chunkSize;

        // Randomize the delay between chunks
        const delay = Math.random() * (100 - 50) + 100; // Random delay between 100ms and 300ms
        setTimeout(streamChunk, delay);
      }
    };

    // Start the streaming process with an initial delay
    const initialDelay = Math.random() * (1000 - 500) + 500; // Random delay between 500ms and 1000ms
    setTimeout(streamChunk, initialDelay);
  };

  const handleStarClick = useCallback(() => {
    setShowSuggestions(true);
    const currentNode = getNode(id);

    if (!currentNode) {
      console.error(`Node with id ${id} not found`);
      return;
    }

    const mockSuggestions = [
      {
        content:
          "RAG-powered bot with access to the ArXiv database for real-time scientific research assistance",
      },
      {
        content:
          "AI-powered virtual research assistant capable of data analysis, literature review, and hypothesis generation",
      },
      {
        content:
          "Voice-activated research assistant for hands-free project guidance and experimental protocol optimization",
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

    newNodes.forEach((node) => {
      const randomSuggestion =
        mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
      streamContent(node, randomSuggestion.content);
    });

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
