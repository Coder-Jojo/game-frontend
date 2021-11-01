import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { Board, Chat, TeamCard, ShowGrid } from ".";
import red from "../assets/red4.jpg";
import blue from "../assets/blue3.jpg";

const Game = ({ socket, name, room, redTeam, blueTeam, inLobby }) => {
  const [score, setScore] = useState([0, 0]);
  const [time, setTime] = useState(60);
  const [turn, setTurn] = useState(0);
  const [turnBG, setTurnBG] = useState(red);
  const [wordLen, setWordLen] = useState(-1);

  const WordToBeGuessed = ({ wordLen }) => {
    let newWord = "";

    if (wordLen === -1) newWord = "Choosing...";
    else {
      for (let i = 0; i < wordLen; i++) {
        newWord += "_";
      }
      newWord = newWord.split("").join(" ");
    }
    return <p>{newWord}</p>;
  };

  useEffect(() => {
    socket.on("updateTime", (time) => {
      setTime(time);
    });

    socket.on("updateScore", (score) => {
      setScore(score);
    });

    socket.on("resetTime", (time) => {
      setTime(time);
    });

    socket.on("updateTurn", (turn) => {
      setTurn(turn);
      if (turn === 0) setTurnBG(red);
      else setTurnBG(blue);
    });

    socket.on("updateWordLen", (wordLen) => {
      setWordLen(wordLen);
    });

    socket.emit("getTurn", room, (turn) => {
      if (turn === 0) setTurnBG(red);
      else setTurnBG(blue);
      setTurn(turn);
    });

    socket.emit("getScore", room, (score) => {
      setScore(score);
    });
  }, [socket, room]);

  return (
    <div
      className={`bg-${turnBG}-50 h-screen p-0`}
      style={{ backgroundImage: `url(${turnBG})` }}
    >
      <Grid celled="internally" className="h-screen p-0">
        <Grid.Row floated="up" className="p-0">
          <Grid.Column width={4} className="p-0 m-0 h-screen">
            <div className="h-full grid grid-rows-5 gap-3">
              {/* <div className="row-span-1 w-full"> */}
              <div className="row-span-1 rounded-3xl bg-gray-700 w-full flex justify-between">
                <div className="self-center font-black text-5xl text-white pl-5">
                  <WordToBeGuessed wordLen={wordLen} />
                </div>
                <div className="self-center font-bold text-5xl text-white pr-5">
                  {time}
                </div>
              </div>
              {/* </div> */}
              {/* <div className="flex flex-col justify-around h-2/3 w-full items-center"> */}
              <div className=" row-span-2">
                <TeamCard
                  score={score}
                  name={name}
                  room={room}
                  team="red"
                  teamMem={redTeam}
                  inLobby={inLobby}
                />
              </div>
              <div className="row-span-2">
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
          </Grid.Column>
          <Grid.Column width={9}>
            <div className="grid grid-rows-6 gap-4 h-full">
              <div className="row-span-5">
                <Board socket={socket} turn={turn} room={room} />
              </div>
              <div>
                <ShowGrid socket={socket} room={room} name={name} turn={turn} />
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={3} className="h-screen p-0 m-0">
            <Chat socket={socket} name={name} room={room} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Game;
