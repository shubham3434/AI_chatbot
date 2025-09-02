import React, { createContext, useContext, useState } from "react";
const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    
  ]);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
