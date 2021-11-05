import React, { useState, useEffect } from "react";
import { Card } from ".";
import { Button, Modal, Checkbox } from "semantic-ui-react";
import sound1 from "../sounds/jingle.wav";

const ShowGrid = ({ socket, name, room, detective, myTurn }) => {
  const [wordArr, setWordArr] = useState([]);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(false);
  const [cardsOnEachRound, setCardsOnEachRound] = useState(true);
  const [selected, setSelected] = useState(-1);
  const [gridSound] = useState(new Audio(sound1));

  useEffect(() => {
    socket.emit("getCards", room, (arr) => {
      setWordArr(arr);
    });

    socket.on("updateCards", (arr) => {
      setWordArr(arr);
      // console.log(arr);
    });

    socket.on("openCards", () => {
      setOpen(cardsOnEachRound);
      gridSound.pause();
      gridSound.currentTime = 0;
      gridSound.play();
    });

    socket.on("closeCards", () => {
      setOpen(false);
      gridSound.pause();
    });

    socket.on("updateSelected", (selected) => {
      setSelected(selected);
    });
  }, [socket, name, room, gridSound, cardsOnEachRound]);

  const handleClick = (e) => {
    e.preventDefault();

    if (selected !== -1 && !wordArr[selected].guessed)
      socket.emit("setIndex", { room, selected });
  };

  return (
    <>
      <div className="h-full flex justify-center pt-10">
        <Button className="h-20" color="purple" onClick={() => setOpen(true)}>
          <p className="text-5xl">Show Cards</p>
        </Button>
        <Button
          className="h-20"
          color="purple"
          onClick={() => setOptions(true)}
        >
          <p className="text-5xl">Options</p>
        </Button>
      </div>

      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="large"
      >
        <div className="flex flex-wrap justify-between p-5 bg-color bg-center bg-black">
          {wordArr.map((word, index) => {
            return (
              <Card
                wordArr={wordArr}
                index={index}
                key={index}
                setSelected={setSelected}
                detective={detective}
                selected={selected}
              />
            );
          })}
        </div>
        <div className="flex justify-center p-4 w-full bg-gradient-to-b from-gray-500 to-gray-800">
          <div className="w-1/4 flex justify-around">
            <Button color="red" onClick={() => setOpen(false)}>
              <p className="text-xl font-black">Close</p>
            </Button>
            {detective && myTurn && (
              <Button
                className="ml-10"
                color="purple"
                onClick={(e) => handleClick(e)}
              >
                <p className="text-xl font-black">Select</p>
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        onClose={() => setOptions(false)}
        onOpen={() => setOptions(true)}
        open={options}
        size="mini"
      >
        <div className="bg-gray-800 text-white grid place-items-center pt-3 pb-3 border-t-2 border border-l-2 border-r-2 border-white">
          <div className="font-black text-6xl text-purple-600 mb-8">
            Options
          </div>
          <div className="flex place-items-center">
            <Checkbox
              checked={cardsOnEachRound}
              toggle
              onClick={() => setCardsOnEachRound((c) => !c)}
            />
            <span className="font-semibold ml-2">
              Automatically show cards after every round
            </span>
          </div>
        </div>
        <div className="w-full grid place-items-center bg-gradient-to-b from-gray-500 to-gray-800 border-2 border-white p-2">
          <Button color="red" onClick={() => setOptions(false)}>
            <p className="text-xl font-black">Close</p>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShowGrid;
