import React, { useState } from "react";
import { Modal, Checkbox, Button } from "semantic-ui-react";
import Cookies from "universal-cookie";

const Options = ({
  cardsOnEachRound,
  setCardsOnEachRound,
  messageSound,
  setMessageSound,
  resultSound,
  setResultSound,
}) => {
  const [options, setOptions] = useState(false);
  const cookies = new Cookies();
  const set = ["cardsOnEachRound", "messageSound", "resultSound"];

  const handleOptions = (e, index, value) => {
    e.preventDefault();
    if (index === 0) setCardsOnEachRound(value);
    else if (index === 1) setMessageSound(value);
    else if (index === 2) setResultSound(value);

    cookies.set(set[index], value);
  };

  return (
    <>
      <Button color="purple" onClick={() => setOptions(true)}>
        Options
      </Button>
      <Modal
        onClose={() => setOptions(false)}
        onOpen={() => setOptions(true)}
        open={options}
        size="mini"
      >
        <div className="bg-gray-800 text-white grid place-items-center pt-3 pb-3 border-t-2 border border-l-2 border-r-2 border-white">
          <div className="font-black text-6xl text-yellow-600 mb-8">
            Options
          </div>

          <div className="flex flex-col">
            <div className="flex mb-3">
              <Checkbox
                checked={cardsOnEachRound}
                toggle
                onClick={(e) => handleOptions(e, 0, !cardsOnEachRound)}
              />
              <span className="font-semibold pt-1 ml-2">
                Automatically show cards after every round
              </span>
            </div>

            <div className="flex mb-3">
              <Checkbox
                checked={messageSound}
                toggle
                onClick={(e) => handleOptions(e, 1, !messageSound)}
              />
              <span className="font-semibold pt-1 ml-2">
                Play sound on correct and invalid guess
              </span>
            </div>

            <div className="flex mb-3">
              <Checkbox
                checked={resultSound}
                toggle
                onClick={(e) => handleOptions(e, 2, !resultSound)}
              />
              <span className="font-semibold pt-1 ml-2">
                Play sound on correct answer revelation
              </span>
            </div>
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

export default Options;
