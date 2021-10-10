import React, { useState, useEffect } from "react";
import { List, Input } from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, name, room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("getMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage === "") return;
    socket.emit("sendMessage", { name, room, message: newMessage });
    setNewMessage("");
  };

  const CreateMessage = (msg, i) => {
    let color = "white";
    if (msg.type === 0) color = "red";
    else if (msg.type === 1) color = "blue";

    let textColor = "white";
    if (msg.type === 2) textColor = "green";
    else if (msg.type === 3) textColor = "yellow";

    return (
      <div key={i} className={`bg-${color}-400`}>
        <List.Item className="p-0">
          <p
            className={` text-${textColor}${
              msg.type < 2 ? "" : "-600 font-semibold"
            }`}
          >
            <b className="text-black">{msg.name && `${msg.name}: `}</b>
            {msg.msg}
          </p>
        </List.Item>
      </div>
    );
  };

  return (
    <div className="flex justify-between width-5/6 h-full p-0 m-0 flex-col -mt-4 -ml-4 -mr-4 ">
      <div className="flex bg-gray-700 self-center h-16 w-full justify-center">
        <h2 className="self-center text-white">MESSAGES</h2>
      </div>
      <div className="h-5/6">
        <ScrollToBottom initialScrollBehavior="smooth" className="h-full">
          <List celled size="huge">
            {messages.map((msg, i) => {
              return CreateMessage(msg, i);
            })}
          </List>
        </ScrollToBottom>
      </div>
      <div>
        <Input
          fluid
          placeholder="Type your guess here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          onKeyPress={(e) => {
            e.key === "Enter" && handleSendMessage(e);
          }}
          size="large"
          className="self-end"
        />
      </div>
    </div>
  );
};

export default Chat;
