import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "../store/ChatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Bot, MessageSquare } from "lucide-react";

export default function ChatWindow() {
  const { messages } = useChat();
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === "user") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto border p-4 rounded-xl bg-gray-50">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex my-5 ${
            msg.sender === "user" ? "justify-end" : "justify-start ml-4"
          }`}
        >
          <div
            className={`relative p-2 rounded-lg break-words ${
              msg.sender === "user"
                ? "bg-[#B8B8FF] max-w-[60%] text-right rounded-br-none"
                : "bg-gray-200 max-w-[70%] text-left rounded-bl-none"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        </div>
      ))}

      {/* Smooth transition for "loading" */}
      <AnimatePresence>
        {loading && (
          <motion.div
          key="loading"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 italic ml-4 flex items-center gap-2"
        >
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          thinking...
        </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}
