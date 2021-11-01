import React from "react";
import { Reveal, Image, Label } from "semantic-ui-react";
import spy from "../assets/spi.png";

const Card = ({ wordArr, index, selected, detective, setSelected }) => {
  const size = wordArr[index].size;
  const color = wordArr[index].color;
  // const bgColor = [300, 500, 700, 900];
  const bgColor = [
    "bg-gradient-to-tl from-green-200 via-green-500 to-yellow-800",
    "bg-gradient-to-tl from-yellow-300 via-yellow-500 to-red-800",
    "bg-gradient-to-tl from-yellow-600 via-pink-600 to-red-700",
    "bg-gradient-to-tl from-red-700 via-pink-900 to-purple-900",
  ];
  // const difficulty = (wordArr[index].difficulty / 100) % 4;
  const difficulty = bgColor[wordArr[index].difficulty / 100 - 1];

  const CalculateNoOfUnderscore = () => {
    let word = "";
    for (let i = 0; i < size; i++) {
      word += "_";
    }
    word = word.split("").join(" ");
    return <>{word}</>;
  };

  const ShowWord = ({ word }) => {
    let newWord = "";
    for (let i = 0; i < size; i++) {
      newWord += word[i];
      if (i === 7) newWord += "\n";
    }
    return <>{newWord}</>;
  };

  const handleSelect = () => {
    if (selected === index) setSelected(-1);
    else setSelected(index);
  };

  return (
    <div className="mb-3">
      {selected === index && (
        <Label color="black" ribbon as="a">
          selected
        </Label>
      )}
      <Reveal active={!wordArr[index].guessed} animated="move up">
        <Reveal.Content visible>
          <div className={`bg-${color}-600`}>
            <Image src={spy} size="small" />
          </div>
        </Reveal.Content>

        <Reveal.Content hidden className="h-full">
          <div
            className={`flex flex-col justify-center h-full ${difficulty} box-border border-white border-2 rounded-xl text-white shadow-2xl`}
          >
            {detective && (
              // <Button fluid inverted className="h-full" onClick={handleSelect}>
              <button
                className="h-full w-full hover:text-black hover:bg-gray-50"
                onClick={handleSelect}
              >
                <p className="font-black text-3xl text-center">
                  <ShowWord word={wordArr[index].word} />
                </p>
              </button>

              // </Button>
            )}
            {!detective && !wordArr[index].guessed && (
              <p className="font-black text-3xl text-center">
                <CalculateNoOfUnderscore />
              </p>
            )}
            {!detective && wordArr[index].guessed && (
              <p className="font-black text-3xl text-center">
                {/* {wordArr[index].word} */}
                <ShowWord word={wordArr[index].word} />
              </p>
            )}
          </div>
        </Reveal.Content>
      </Reveal>
    </div>
  );
};

export default Card;
