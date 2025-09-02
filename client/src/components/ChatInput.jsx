import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react"; // nice icon (install: npm i lucide-react)
import { useChat } from "../store/ChatStore";

export default function ChatInput() {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const {addMessage} = useChat();

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  }, [value]);
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handleSend = async() => {
    if (!value.trim()) return;
    addMessage("user" , value)
    const message = value
    setValue("");
    // await sleep(2000)
    const response = await fetch('http://localhost:3000/chat',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        'message':message,
        'threadId':'aohdqjlq'
      })
    }).then((res)=> res.json())
    addMessage("bot" , response.message)  
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "6px",
        backgroundColor: "white",
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e)=>{
          if (e.key === "Enter" && !e.shiftKey) { 
          e.preventDefault(); 
          handleSend();
        }
        }}
        placeholder="Type your message..."
        style={{
          flex: 1,
          minHeight: "40px",
          maxHeight: "150px",
          resize: "none",
          overflowY: "auto",
          padding: "8px",
          fontSize: "16px",
          lineHeight: "20px",
          border: "none",
          outline: "none",
        }}
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        style={{
          marginLeft: "8px",
          backgroundColor: "#B8B8FF",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom:"8px"
        }}
      >
        <Send size={20} color="white" />
      </button>
    </div>
  );
}
