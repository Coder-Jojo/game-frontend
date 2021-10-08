import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Home, GameArea } from "./components";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SocketContext from "./socketContext";

// let socket = null;

const socket = io("http://localhost:5000");

const App = () => {
  // const [socket, setSocket] = useState(null);
  const [inGame, setInGame] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // socket = io("http://localhost:5000");

  // useEffect(() => {
  //   setSocket(io("http://localhost:5000"));
  //   // socket = io("http://localhost:5000");
  // }, []);

  // useEffect(() => {
  //   socket &&
  //     socket.on("teamsUpdated", (teams) => {
  //       console.log(teams);
  //     });
  // }, [socket]);

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

  // return (
  //   <SocketContext.Provider value={socket}>
  //     <Router>
  //       <Route path="/" exact>
  //         <Home
  //           socket={socket}
  //           name={name}
  //           setName={setName}
  //           setRoom={setRoom}
  //           room={room}
  //         />
  //       </Route>
  //       <Route path="/gamearea" exact>
  //         <GameArea socket={socket} name={name} room={room} />
  //       </Route>
  //     </Router>
  //   </SocketContext.Provider>
  // );
};

export default App;
