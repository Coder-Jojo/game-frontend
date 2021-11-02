import React, { useState } from "react";
import io from "socket.io-client";
import { Home, GameArea } from "./components";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import SocketContext from "./socketContext";

// let socket = null;

// const socket = io("http://localhost:5000");
const socket = io("https://jojo-game-1.herokuapp.com");

const App = () => {
  const [inGame, setInGame] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <SocketContext.Provider value={socket}>
      {inGame && (
        <GameArea
          // socket={socket}
          name={name}
          room={room}
        />
      )}
      {inGame || (
        <Home
          // socket={socket}
          name={name}
          setName={setName}
          setRoom={setRoom}
          room={room}
          setInGame={setInGame}
        />
      )}
    </SocketContext.Provider>
  );
};

export default App;
