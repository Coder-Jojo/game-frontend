import React, { useState, useEffect } from "react";
import { Board, Chat, TeamCard, ShowGrid, Topbar } from ".";
import red from "../assets/red4.jpg";
import blue from "../assets/blue3.jpg";
import sound1 from "../sounds/atmos.mp3";

const Game = ({ socket, name, room, redTeam, blueTeam, inLobby }) => {
  const [score, setScore] = useState([0, 0]);
  const [time, setTime] = useState(0);
  const [turn, setTurn] = useState(0);
  const [turnBG, setTurnBG] = useState(red);
  const [wordLen, setWordLen] = useState(-1);
  const [detective, setDetective] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [cardsOnEachRound, setCardsOnEachRound] = useState(true);
  const [guessingSound] = useState(new Audio(sound1));

  useEffect(() => {
    socket.on("updateTime", (time) => {
      if (time >= 79) {
        guessingSound.play();
      }
      if (time >= 0) setTime(time);
    });

    socket.on("updateScore", (score) => {
      setScore(score);
    });

    socket.on("resetTime", (time) => {
      setTime(time);
      guessingSound.pause();
      guessingSound.currentTime = 0;
    });

    socket.on("updateTurn", (turn) => {
      setTurn(turn);
      if (turn === 0) setTurnBG(red);
      else setTurnBG(blue);
    });

    socket.on("updateWordLen", (wordLen) => {
      setWordLen(wordLen);
    });

    socket.emit("isDetective", { name, room }, (res) => {
      setDetective(res);
    });

    socket.emit("getTurn", room, (turn) => {
      if (turn === 0) setTurnBG(red);
      else setTurnBG(blue);
      setTurn(turn);
    });

    socket.emit("getScore", room, (score) => {
      setScore(score);
    });
  }, [socket, room, name, guessingSound]);

  useEffect(() => {
    if (detective) {
      socket.emit("isMyTurn", { room, name }, (answer) => {
        setMyTurn(answer);
      });
    }
  }, [socket, room, detective, turn, name]);

  return (
    <div
      className={`h-screen p-0 bg-center bg-cover overflow-hidden flex flex-col`}
      style={{ backgroundImage: `url(${turnBG})` }}
    >
      <Topbar
        socket={socket}
        room={room}
        time={time}
        wordLen={wordLen}
        cardsOnEachRound={cardsOnEachRound}
        setCardsOnEachRound={setCardsOnEachRound}
      />

      <div className="flex-grow grid grid-cols-5 gap-2">
        <div className="col-span-1 grid grid-rows-7 overflow-hidden pt-2">
          <div className="row-span-1 grid place-content-center">
            <ShowGrid
              socket={socket}
              room={room}
              name={name}
              turn={turn}
              detective={detective}
              myTurn={myTurn}
              cardsOnEachRound={cardsOnEachRound}
            />
          </div>
          <div className="h-full row-span-3 place-self-center flex items-center">
            <TeamCard
              score={score}
              name={name}
              room={room}
              team="red"
              teamMem={redTeam}
              inLobby={inLobby}
            />
          </div>

          <div className="h-full row-span-3 place-self-center flex items-start">
            <TeamCard
              score={score}
              name={name}
              room={room}
              team="blue"
              teamMem={blueTeam}
              inLobby={inLobby}
            />
          </div>
        </div>

        <div className="col-span-3 h-full overflow-hidden pt-2">
          <Board socket={socket} myTurn={myTurn} room={room} />
        </div>

        <div className="col-span-1 h-full overflow-hidden pt-2 pb-3">
          <Chat socket={socket} name={name} room={room} />
        </div>
      </div>
    </div>
  );
};

export default Game;
