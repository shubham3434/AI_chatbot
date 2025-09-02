import React from "react";
import { ChatProvider } from "./store/ChatStore";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

export default function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen py-4 px-16 ">
        <ChatWindow />
        <br />
        <ChatInput />
      </div>
    </ChatProvider>
  );
}
