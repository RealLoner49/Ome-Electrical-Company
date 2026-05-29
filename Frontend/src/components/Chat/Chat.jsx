import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import "./Chat.css";

function Chat() {
  const { chatOpen, toggleChat, closeChat } = useChat();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! How can we help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thanks for your message! Our team will respond shortly.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Fixed Chat Button */}
      <button
        className="chat__toggle"
        onClick={() => toggleChat()}
        title="Chat with us"
        aria-label="Chat button"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="chat__svg">
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="#c41e3a"/>
          <path d="M7 10h10M7 14h7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="chat__modal">
          <div className="chat__header">
            <h3>Chat with Us</h3>
            <button
              className="chat__close"
              onClick={() => closeChat()}
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="chat__messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat__message chat__message--${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="chat__input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat__input"
            />
            <button onClick={handleSendMessage} className="chat__send">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
