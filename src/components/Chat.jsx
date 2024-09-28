import React, { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBoardWithNodes } from "@/app/api/board";

const Chat = ({ boardId }) => {
  const [formattedNodes, setFormattedNodes] = useState([]);
  const chatId = `chat-${boardId}`;

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      id: chatId,
      initialMessages: [
        {
          role: "system",
          content:
            "You are a chatbot called MindFlow who is an expert on brainstorming. You are provided a bunch of nodes with content and connections and you help the user with more ideas.",
        },
      ],
      api: "/api/chat",
    });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchBoardData = useCallback(async () => {
    if (boardId) {
      try {
        const fetchedBoard = await getBoardWithNodes(boardId);
        if (fetchedBoard) {
          const newFormattedNodes = fetchedBoard.nodes.map((node) => ({
            id: node.id.toString(),
            type: "custom",
            position: { x: parseFloat(node.xPos), y: parseFloat(node.yPos) },
            data: { content: node.content },
          }));
          setFormattedNodes(newFormattedNodes);

          // Update the system message with the new formatted nodes
          const systemMessage = {
            role: "system",
            content: `You are a chatbot called MindFlow who is an expert on brainstorming. Here are the current nodes in the mindmap for board ${boardId}:
            ${newFormattedNodes.map((node) => `Node ${node.id}: ${node.data.content}`).join("\n")}
            
            Use this information to provide context-aware suggestions and help the user with more ideas.`,
          };

          setMessages((prevMessages) => [
            systemMessage,
            ...prevMessages.filter((msg) => msg.role !== "system"),
          ]);
        }
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    }
  }, [boardId, setMessages]);

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleSubmit(e);
      // Refetch board data after each message to ensure up-to-date context
      fetchBoardData();
    },
    [handleSubmit, fetchBoardData],
  );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4">
        {messages
          .filter((message) => message.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <form onSubmit={handleFormSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
