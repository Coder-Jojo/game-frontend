import React, { useState } from "react";
import { Modal, Checkbox, Button } from "semantic-ui-react";

const Options = ({ cardsOnEachRound, setCardsOnEachRound }) => {
  const [options, setOptions] = useState(false);

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

export default Options;
