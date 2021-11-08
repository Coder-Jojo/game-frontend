import React, { useState, useEffect } from "react";
import { Options } from ".";
import { Button } from "semantic-ui-react";
import logo from "../logo/logo2.png";

const Topbar = ({
  socket,
  wordLen,
  time,
  room,
  setCardsOnEachRound,
  cardsOnEachRound,
}) => {
  const [word, setWord] = useState("");

  useEffect(() => {
    socket.on("onHint", ({ index, letter }) => {
      setWord((word) => {
        let newWord = word.split(" ");
        newWord[index] = letter;
        return newWord.join(" ");
      });
    });
  }, [socket]);

  useEffect(() => {
    if (wordLen > 0) setWord("_ ".repeat(wordLen));
    else {
      socket.emit("getRound", room, ({ current, total }) => {
        setWord(`Round ${current} of ${total}`);
      });
    }
  }, [socket, room, wordLen]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(room);
  };

  const handleLeave = () => {
    window.location.reload();
  };

  return (
    <div className="h-18 flex-none bg-gray-800 grid grid-cols-11">
      <div className="col-span-4 flex overflow-hidden pl-5">
        <img src={logo} alt="logo" style={{ height: "100%" }} />
        <div className="self-center font-bold text-5xl text-white oldstyle-nums ml-6">
          {time}
        </div>
      </div>

      <div className="col-span-3 grid place-items-center overflow-hidden font-black text-5xl text-white">
        <p>{word}</p>
      </div>

      <div className="col-span-4 h-full w-full grid place-content-center overflow-hidden">
        <div className="flex">
          <Button color="teal" onClick={handleCopyRoomId}>
            Copy RoomId
          </Button>
          <Options
            setCardsOnEachRound={setCardsOnEachRound}
            cardsOnEachRound={cardsOnEachRound}
          />
          <Button color="red" onClick={handleLeave}>
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
