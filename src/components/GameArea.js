import React, { useState, useEffect } from "react";
import SocketContext from "../socketContext";
import { Lobby, Game } from "./";

const GameArea = ({ name, room }) => {
  const [inLobby, setInLobby] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [host, setHost] = useState(false);

  const socket = React.useContext(SocketContext);

  useEffect(() => {
    socket.on("startGame", () => {
      setInLobby(false);
    });

    socket.on("endGame", () => {
      setInLobby(true);
      setShowResult(true);
    });

    socket.emit("isHost", { name, room }, (host) => {
      setHost(host);
    });
  }, [socket, setHost, name, room]);

  if (inLobby)
    return (
      <Lobby
        socket={socket}
        setRedTeam={setRedTeam}
        setBlueTeam={setBlueTeam}
        setSpectators={setSpectators}
        spectators={spectators}
        showResult={showResult}
        setShowResult={setShowResult}
        name={name}
        room={room}
        redTeam={redTeam}
        blueTeam={blueTeam}
        host={host}
        inLobby={inLobby}
      />
    );
  else
    return (
      <Game
        socket={socket}
        redTeam={redTeam}
        blueTeam={blueTeam}
        spectators={spectators}
        name={name}
        room={room}
        inLobby={inLobby}
      />
    );
};

export default GameArea;
