import React, { useState, useEffect } from "react";
import { List, Input } from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";
import positiveSound from "../sounds/p1.wav";
import negativeSound from "../sounds/n2.wav";

const Chat = ({ socket, name, room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [positive] = useState(new Audio(positiveSound));
  const [negative] = useState(new Audio(negativeSound));

  useEffect(() => {
    socket.on("getMessage", (message) => {
      setMessages((prev) => [...prev, message]);

      if (message.type === 2) {
        positive.pause();
        positive.currentTime = 0;
        positive.play();
      } else if (message.type === -1) {
        negative.pause();
        negative.currentTime = 0;
        negative.play();
      }
    });
  }, [socket, positive, negative]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage === "") return;
    socket.emit("sendMessage", { name, room, message: newMessage });
    setNewMessage("");
  };

  const RedMsg = ({ name, msg }) => {
    return (
      <div className="bg-red-400 p-1 pb-2 border border-red-800">
        <span className="text-black font-semibold ">{name}: </span>
        <span className="text-white">{msg}</span>
      </div>
    );
  };

  const BlueMsg = ({ name, msg }) => {
    return (
      <div className="bg-blue-400 p-1 pb-2 border border-blue-800">
        <span className="text-black font-semibold">{name}: </span>
        <span className="text-white">{msg}</span>
      </div>
    );
  };

  const CorrectAns = ({ msg }) => {
    return (
      <div className="bg-gray-200 text-green-600 font-semibold p-1 pb-2 border border-black">
        {msg}
      </div>
    );
  };

  const Cheating = ({ name }) => {
    return (
      <div className="bg-gray-200 text-red-600 font-semibold p-1 pb-2 border border-black">
        PhaQueue {name} for cheating
      </div>
    );
  };

  const NewRound = ({ msg }) => {
    return (
      <div className="bg-gray-600 text-white font-black p-1 pb-2 border border-white">
        {msg}
      </div>
    );
  };

  const StartNextRound = ({ msg }) => {
    return (
      <div className="bg-gray-800 text-yellow-400 font-black p-1 pb-2 border-2 border-yellow-800">
        {msg}
      </div>
    );
  };

  const CreateMessage = ({ msg }) => {
    if (msg.type === 0) return <RedMsg name={msg.name} msg={msg.msg} />;
    else if (msg.type === 1) return <BlueMsg name={msg.name} msg={msg.msg} />;
    else if (msg.type === 2) return <CorrectAns msg={msg.msg} />;
    else if (msg.type === 3) return <NewRound msg={msg.msg} />;
    else if (msg.type === 4) return <></>;
    else if (msg.type === 5) return <StartNextRound msg={msg.msg} />;
    else return <Cheating name={msg.name} />;
  };

  return (
    <div className="flex justify-between width-5/6 h-full p-0 m-0 flex-col ">
      <div className="flex bg-gray-700 self-center h-16 w-full justify-center">
        <h2 className="self-center text-3xl font-semibold text-white">
          MESSAGES
        </h2>
      </div>
      <div className="h-5/6">
        <ScrollToBottom initialScrollBehavior="smooth" className="h-full">
          <List celled size="huge">
            {messages.map((msg, i) => {
              return <CreateMessage key={i} msg={msg} />;
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
