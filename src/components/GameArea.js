import React, { useState, useEffect } from "react";
import SocketContext from "../socketContext";
import { Lobby, Game } from "./";

const GameArea = ({ name, room }) => {
  const [inLobby, setInLobby] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [spectators, setSpectators] = useState([]);

  const socket = React.useContext(SocketContext);

  useEffect(() => {
    socket.on("startGame", () => {
      setInLobby(false);
    });

    socket.on("endGame", () => {
      setInLobby(true);
      setShowResult(true);
    });
  }, [socket]);

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
      />
    );
  else
    return (
      <Game redTeam={redTeam} blueTeam={blueTeam} spectators={spectators} />
    );
};

export default GameArea;
