import React, { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBoardWithNodes } from "@/app/api/board";
import { getNodeConnectionsByBoardId } from "@/app/api/node";
import { Stars } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Chat = ({ boardId }) => {
  const [formattedNodes, setFormattedNodes] = useState([]);
  const [formattedEdges, setEdges] = useState([]);
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      initialMessages: [
        {
          role: "system",
          content:
            "You are a chatbot called MindFlow who is an expert on brainstorming. You are very concise and never say more than is necessary. You are provided a bunch of nodes with content and connections and you help the user with more ideas.",
        },
      ],
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
        const connections = await getNodeConnectionsByBoardId(boardId);

        if (fetchedBoard) {
          const newFormattedNodes = fetchedBoard.nodes.map((node) => ({
            id: node.id.toString(),
            content: node.content,
          }));
          setFormattedNodes(newFormattedNodes);

          const newFormattedEdges = connections.map((connection) => ({
            id: `e${connection.id}`,
            source: connection.nodes[0].id.toString(),
            target: connection.nodes[1].id.toString(),
          }));
          setEdges(newFormattedEdges);

          // Update the system message with the new formatted nodes
          const systemMessage = {
            role: "system",
            content: `You are a chatbot called MindFlow who is an expert on brainstorming. Here are the current nodes in the mindmap:
            ${newFormattedNodes
              .map(
                (node) => `Node ${node.id} \n Internal info: ${node.content}`
              )
              .join("\n")}
            
              \n
            Here are the connections between the nodes:
            
             ${newFormattedEdges
               .map(
                 (edge) =>
                   `Node ${edge.id} \n Source node: ${edge.source}, Target node: ${edge.target}`
               )
               .join("\n")}
               \n
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
    [handleSubmit, fetchBoardData]
  );

  const MarkdownContent = ({ content }) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
      className="markdown-content"
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages
            .filter((message) => message.role !== "system")
            .map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 shadow-md ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <MarkdownContent content={message.content} />
                  {message.role === "assistant" && (
                    <button
                      onClick={() => console.log("Integrating suggestion...")}
                      className="mt-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                      <Stars size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <form
        onSubmit={handleFormSubmit}
        className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow dark:bg-gray-800 dark:text-white"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
