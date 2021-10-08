import React from "react";
import { Button, List } from "semantic-ui-react";

const TeamCard = ({ score, team, inLobby }) => {
  const teamMem = [
    "adsf",
    "asdfasdf",
    "asdfasfdasfd",
    "adsfasd",
    "asdfasdfasfsdfsadf",
    "asdfasdfsadfsadf",
    "asdfd",
  ];

  return (
    <div
      className={`box-content p-4 rounded-3xl bg-${
        team === "red" ? "red" : "blue"
      }-500 px-8 pt-5 flex-col flex max-w-sm`}
    >
      <div className="flex justify-around w-full">
        <p>{team === "red" ? "RED" : "BLUE"}</p>
        <p>-</p>
        <p>{score ? score : 0}</p>
      </div>

      <div className="flex flex-col mt-5">
        <h5 className="mb-1">Operative(s)</h5>
        <List horizontal bulleted items={teamMem} />
        <div className="w-auto mt-1">
          <Button compact size="small" color="purple">
            Join as Operative
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-5">
        <h5 className="mb-1">Detective(s)</h5>
        <List horizontal bulleted items={teamMem} />
        <div className="w-auto mt-1">
          <Button compact size="small" color="purple">
            Join as Detective
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
