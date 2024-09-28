import React, { useRef, useEffect, useState } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// systemPrompt = "You are a chatbot knowledgeable who is an expert on brainstorming. You are provided a bunch of nodes with content and connections."

const Chat = ({ board }) => {
  const [formattedNodes, setFormattedNodes] = useState([]);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        role: "system",
        content:
          "You are a chatbot called MindFlow who is an expert on brainstorming. You are provided a bunch of nodes with content and connections and you help the user with more ideas.",
      },
    ],
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // console.log("Board ID: ", board.id);
    const fetchBoardData = async () => {
      if (board.id) {
        try {
          const fetchedBoard = await getBoardWithNodes(board.id);
          if (fetchedBoard) {
            const formattedNodes = fetchedBoard.nodes.map((node) => ({
              id: node.id.toString(),
              type: "custom",
              position: { x: parseFloat(node.xPos), y: parseFloat(node.yPos) },
              data: { content: node.content },
            }));
            setFormattedNodes(newFormattedNodes);
            console.log("Formatted Nodes from Chat: ", formattedNodes);
            // Update the system message with the new formatted nodes
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                role: "system",
                content: JSON.stringify({ nodes: newFormattedNodes }),
              },
            ]);
          } else {
          }
        } catch (error) {
          console.error("Error fetching board data:", error);
        }
      } else {
        console.log("No board ID available, clearing nodes and edges");
      }
    };
  }, []);

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
      <form onSubmit={handleSubmit} className="p-4 border-t">
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
