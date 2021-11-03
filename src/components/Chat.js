import React, { useState, useEffect } from "react";
import { List, Input } from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";
import positiveSound from "../sounds/p1.wav";
import negativeSound from "../sounds/n2.wav";

const Chat = ({ socket, name, room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // const [bgChatColor, setBgChatColor] = useState("bg-gray-200");
  // const [msgColor, setMsgColor] = useState("");
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
      <div className="bg-red-400 p-2">
        <span className="text-black font-semibold">{name}: </span>
        <span className="text-white">{msg}</span>
      </div>
    );
  };

  const BlueMsg = ({ name, msg }) => {
    return (
      <div className="bg-blue-400 p-2">
        <span className="text-black font-semibold">{name}: </span>
        <span className="text-white">{msg}</span>
      </div>
    );
  };

  const CorrectAns = ({ msg }) => {
    return (
      <div className="bg-gray-200 text-green-600 font-black p-2">{msg}</div>
    );
  };

  const Cheating = ({ name }) => {
    return (
      <div className="bg-gray-200 text-red-600 font-black p-2">
        PhaQueue {name} for cheating
      </div>
    );
  };

  const CreateMessage = ({ msg }) => {
    // let color = "gray";
    // let weight = 400;

    // if (msg.type === 0 || msg.type === 1) {
    //   if (msg.type === 0) color = "red";
    //   else if (msg.type === 1) color = "blue";
    // }

    // let textColor = "white";

    // if (msg.type === 2 || msg.type === -1) {
    //   weight = 200;
    //   if (msg.type === 2) textColor = "green";
    //   else if (msg.type === -1) textColor = "red";
    // }

    // let setBgChatColor = `bg-${color}-${weight}`;
    // let setMsgColor = "";
    // if (msg.type === 1 || msg.type === 0) setMsgColor = `text-${textColor}`;
    // else setMsgColor = `text-${textColor}-600 font-semibold`;

    if (msg.type === 0) return <RedMsg name={msg.name} msg={msg.msg} />;
    else if (msg.type === 1) return <BlueMsg name={msg.name} msg={msg.msg} />;
    else if (msg.type === 2) return <CorrectAns msg={msg.msg} />;
    else return <Cheating name={msg.name} />;

    // return (
    //   <div key={i} className={setBgChatColor}>
    //     <List.Item className="p-0">
    //       <p
    //         // className={` text-${textColor}${
    //         //   msg.type === 1 || msg.type === 0 ? "" : "-600 font-semibold"
    //         // }`}
    //         className={setMsgColor}
    //       >
    //         <b className="text-black">
    //           {(msg.type === 1 || msg.type === 0) && `${msg.name}: `}
    //         </b>
    //         {msg.type === -1 ? `PhaQueue ${msg.name} for cheating` : msg.msg}
    //       </p>
    //     </List.Item>
    //   </div>
    // );
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
