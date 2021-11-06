import React, { useState, useEffect } from "react";
import { Board, Chat, TeamCard, ShowGrid } from ".";
import red from "../assets/red4.jpg";
import blue from "../assets/blue3.jpg";
import logo from "../logo/logo2.png";
import sound1 from "../sounds/atmos.mp3";

const Game = ({ socket, name, room, redTeam, blueTeam, inLobby }) => {
  const [score, setScore] = useState([0, 0]);
  const [time, setTime] = useState(60);
  const [turn, setTurn] = useState(0);
  const [turnBG, setTurnBG] = useState(red);
  const [wordLen, setWordLen] = useState(-1);
  const [detective, setDetective] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [guessingSound] = useState(new Audio(sound1));

  const WordToBeGuessed = ({ wordLen }) => {
    let newWord = "";

    if (wordLen === -1) newWord = "Choosing...";
    else {
      // for (let i = 0; i < wordLen; i++) {
      //   newWord += "_";
      // }
      // newWord = newWord.split("").join(" ");
      newWord = `${wordLen} letters`;
    }
    return <p>{newWord}</p>;
  };

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
      className={`bg-${turnBG}-50 h-screen p-0 bg-center bg-cover grid grid-cols-5 gap-2`}
      style={{ backgroundImage: `url(${turnBG})` }}
    >
      <div className="col-span-1 grid grid-rows-5 overflow-hidden pt-2">
        <div className="h-full grid grid-rows-2 rounded-3xl bg-gray-800 w-full">
          <div className="flex justify-between">
            <img src={logo} alt="logo" style={{ height: "100%" }} />
            <div className="self-center font-bold text-5xl text-white pr-5 oldstyle-nums">
              {time}
            </div>
          </div>
          <div className="bg-gray-600 rounded-bl-3xl rounded-br-3xl w-full flex items-center font-black text-5xl text-white pl-5">
            <WordToBeGuessed wordLen={wordLen} />
          </div>
        </div>

        <div className="h-full row-span-2 place-self-center flex items-center">
          <TeamCard
            score={score}
            name={name}
            room={room}
            team="red"
            teamMem={redTeam}
            inLobby={inLobby}
          />
        </div>

        <div className="h-full row-span-2 place-self-center flex items-start">
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
        <ShowGrid
          socket={socket}
          room={room}
          name={name}
          turn={turn}
          detective={detective}
          myTurn={myTurn}
        />
      </div>

      <div className="col-span-1 h-full overflow-hidden">
        <Chat socket={socket} name={name} room={room} />
      </div>
    </div>
  );
};

export default Game;
