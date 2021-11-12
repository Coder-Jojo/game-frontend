import React, { useState, useEffect } from "react";
import { Card } from ".";
import { Button, Modal } from "semantic-ui-react";

const ShowGrid = ({
  socket,
  name,
  room,
  detective,
  myTurn,
  cardsOnEachRound,
}) => {
  const [wordArr, setWordArr] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1);

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
    });

    socket.on("closeCards", () => {
      setOpen(false);
    });

    socket.on("updateSelected", (selected) => {
      setSelected(selected);
    });
  }, [socket, name, room, cardsOnEachRound]);

  const handleClick = (e) => {
    e.preventDefault();

    if (selected !== -1 && !wordArr[selected].guessed)
      socket.emit("setIndex", { room, selected });
  };

  return (
    <>
      <Button color="purple" onClick={() => setOpen(true)}>
        <p className="text-5xl">Show Cards</p>
      </Button>

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
    </>
  );
};

export default ShowGrid;
