import React, { useState } from "react";
import Layout from "../components/shared/Layout/Layout";
import "./Chatbot.css"; // You can style it here

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to the Blood Bank Chatbot!" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:8003/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong." },
      ]);
    }

    setInput("");
  };

  return (
    <Layout>
      <div className="chatbot-container">
        <h1>Chatbot</h1>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>
            <span><i class="fa-solid fa-share"></i> Send</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Chatbot;
