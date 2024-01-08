import React, { useState } from "react";
import io from "socket.io-client";
import { Home, GameArea } from "./components";
import SocketContext from "./socketContext";
import LoadingPage from "./loading";

// const socket = io("http://localhost:5000");
// const socket = io("https://jojo-game-1.herokuapp.com");
const socket = io("https://jojo-game-backend.onrender.com");
socket.connect();
var forcedDelay = true;
setTimeout(() => forcedDelay = false, 3000);

const App = () => {
  const [inGame, setInGame] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(socket.connected && !forcedDelay);
  const [reRender, setReRender] = useState(1);
  
  if (!loading || reRender) {
    setTimeout(() => {
      setLoading(socket.connected && !forcedDelay)
      if (!loading) setReRender(reRender + 1);
      else setReRender(0);
    }, 1000);
    console.log("loading");
    return <LoadingPage />;
  }

  return (
    <SocketContext.Provider value={socket}>
      {inGame && <GameArea name={name} room={room} />}
      {inGame || (
        <Home
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
