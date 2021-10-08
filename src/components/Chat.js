import React, { useState, useEffect } from "react";
import { List, Input } from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("getMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log(newMessage);
    socket.emit("sendMessage", newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex justify-between width-5/6 h-screen flex-col">
      <ScrollToBottom initialScrollBehavior="smooth" className="h-full">
        <List celled>
          {messages.map((msg, i) => {
            return <List.Item key={i}>{msg}</List.Item>;
          })}
        </List>
      </ScrollToBottom>
      <Input
        placeholder="Type your guess here..."
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
        onKeyPress={(e) => {
          e.key === "Enter" && handleSendMessage(e);
        }}
      />
    </div>
  );
};

export default Chat;
