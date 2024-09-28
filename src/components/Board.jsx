"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  MiniMap,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MoreHorizontal, PlusCircle, ZoomIn, ZoomOut } from "lucide-react";
import NodeContent from "./MindMapNode";
import {
  createNode,
  deleteNode,
  updateNode,
  getNodeConnectionsByBoardId,
  createNodeConnection,
  deleteNodeConnection,
} from "@/app/api/node";
import { getBoardWithNodes } from "@/app/api/board";
import SimpleFloatingEdge from "./SimpleFloatingEdge";

const nodeTypes = {
  custom: NodeContent,
};

const Board = ({ board: initialBoard }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [board, setBoard] = useState(initialBoard);
  const [currentBoardId, setCurrentBoardId] = useState(initialBoard?.id);
  const edgeTypes = {
    floating: SimpleFloatingEdge,
  };

  useEffect(() => {
    if (initialBoard?.id !== currentBoardId) {
      setCurrentBoardId(initialBoard?.id);
    }
  }, [initialBoard, currentBoardId]);

  useEffect(() => {
    const fetchBoardData = async () => {
      if (currentBoardId) {
        try {
          const fetchedBoard = await getBoardWithNodes(currentBoardId);
          const connections = await getNodeConnectionsByBoardId(currentBoardId);

          if (fetchedBoard) {
            setBoard(fetchedBoard);
            const formattedNodes = fetchedBoard.nodes.map((node) => ({
              id: node.id.toString(),
              type: "custom",
              position: { x: parseFloat(node.xPos), y: parseFloat(node.yPos) },
              data: { content: node.content },
            }));
            setNodes(formattedNodes);

            const formattedEdges = connections.map((connection) => ({
              id: `e${connection.id}`,
              source: connection.nodes[0].id.toString(),
              target: connection.nodes[1].id.toString(),
              type: "floating",
            }));
            setEdges(formattedEdges);
          } else {
            setNodes([]);
            setEdges([]);
          }
        } catch (error) {
          console.error("Error fetching board data:", error);
          setNodes([]);
          setEdges([]);
        }
      } else {
        console.log("No board ID available, clearing nodes and edges");
        setNodes([]);
        setEdges([]);
      }
    };

    fetchBoardData();
  }, [currentBoardId]);

  const onNodesDelete = useCallback(
    async (deletedNodes) => {
      for (const node of deletedNodes) {
        try {
          await deleteNode(parseInt(node.id));
          console.log(`Node ${node.id} deleted from database`);

          setNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id));

          // Remove any edges connected to this node
          setEdges((prevEdges) =>
            prevEdges.filter(
              (edge) => edge.source !== node.id && edge.target !== node.id
            )
          );
        } catch (error) {
          console.error(`Error deleting node ${node.id}:`, error);
        }
      }
    },
    [setNodes, setEdges]
  );

  const onNodesChange = useCallback((changes) => {
    setNodes((prevNodes) => {
      const newNodes = applyNodeChanges(changes, prevNodes);

      changes.forEach((change) => {
        const node = newNodes.find((n) => n.id === change.id);
        if (!node) return;

        if (change.type === "position" && change.dragging === false) {
          // Node dragging has ended, update the position in the database
          updateNode(parseInt(node.id), {
            xPos: node.position.x,
            yPos: node.position.y,
          }).catch((error) => {
            console.error(`Error updating node ${node.id} position:`, error);
          });
        }
      });

      return newNodes;
    });
  }, []);

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    async (connection) => {
      // Generate a temporary ID for the new edge
      const tempId = `temp-${Date.now()}`;

      // Create and add the new edge immediately
      const newEdge = {
        id: tempId,
        source: connection.source,
        target: connection.target,
        type: "floating",
      };
      setEdges((eds) => addEdge(newEdge, eds));

      try {
        // Persist the connection to the database
        const newConnection = await createNodeConnection(
          parseInt(connection.source),
          parseInt(connection.target)
        );

        // Update the edge with the real ID from the database
        setEdges((eds) =>
          eds.map((edge) =>
            edge.id === tempId ? { ...edge, id: `e${newConnection.id}` } : edge
          )
        );
      } catch (error) {
        console.error("Error creating node connection:", error);
        // Remove the edge if the database operation failed
        setEdges((eds) => eds.filter((edge) => edge.id !== tempId));
      }
    },
    [setEdges]
  );

  const onEdgesDelete = useCallback(
    async (edgesToDelete) => {
      for (const edge of edgesToDelete) {
        const edgeId = edge.id.startsWith("e") ? edge.id.substring(1) : edge.id;
        try {
          if (!edge.id.startsWith("temp-")) {
            await deleteNodeConnection(parseInt(edgeId));
          }
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        } catch (error) {
          console.error(`Error deleting edge ${edge.id}:`, error);
        }
      }
    },
    [setEdges]
  );

  const { zoomIn, zoomOut } = useReactFlow();

  const handleAddNode = useCallback(
    async ({
      authorId = 1,
      boardId,
      title = "",
      content = "",
      xPos = Math.random() * 500,
      yPos = Math.random() * 500,
    }) => {
      try {
        const dbNode = await createNode({
          authorId,
          boardId,
          title,
          content,
          xPos,
          yPos,
        });

        const newNode = {
          id: dbNode.id.toString(), // Ensure id is a string
          type: "custom",
          position: { x: parseFloat(dbNode.xPos), y: parseFloat(dbNode.yPos) },
          data: {
            label: title, // ReactFlow often expects a 'label' property
            content: content,
          },
        };

        console.log("Adding new node:", newNode); // For debugging

        setNodes((prevNodes) => {
          const updatedNodes = [...prevNodes, newNode];
          console.log("Updated nodes:", updatedNodes); // For debugging
          return updatedNodes;
        });
      } catch (error) {
        console.error("Error creating node:", error);
      }
    },
    []
  );

  const handleFullScreen = useCallback(() => {
    // Implement full screen functionality
  }, []);

  // const toggleLock = useCallback(() => {
  //   setIsLocked(!isLocked);
  // }, [isLocked]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex items-center bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
        <h2 className="text-xl font-semibold mr-2">{board.title}</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="z-50 absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-black border border-border rounded-lg shadow-lg">
        {/* <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground`}
        >
          <MousePointer size={20} />
        </button> */}
        <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground`}
          onClick={() => {
            handleAddNode({ boardId: board.id, title: "test" });
          }}
        >
          <PlusCircle size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={zoomIn}
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={zoomOut}
        >
          <ZoomOut size={20} />
        </button>
        {/* <button
          className="block p-2 hover:bg-accent hover:text-accent-foreground"
          onClick={handleFullScreen}
        >
          <Maximize size={20} />
        </button> */}
        {/* <button
          className={`block p-2 hover:bg-accent hover:text-accent-foreground ${isLocked ? "bg-accent text-accent-foreground" : ""}`}
          onClick={toggleLock}
        >
          <Lock size={20} />
        </button> */}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        fitView
        // panOnScroll
        selectionOnDrag
        // panOnDrag={!isLocked}
        // zoomOnScroll={!isLocked}
        // zoomOnPinch={!isLocked}
        // nodesDraggable={!isLocked}
        // nodesConnectable={!isLocked}
        // elementsSelectable={!isLocked}
        minZoom={0.2}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
        connectionMode={ConnectionMode.Loose}
      >
        <Background variant="dots" gap={15} size={1} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
};

export default Board;
