import React from "react";
import { Button, List } from "semantic-ui-react";

const TeamCard = ({ socket, score, team, inLobby, teamMem, name, room }) => {
  const handleUpdateTeams = (e, informer) => {
    e.preventDefault();
    const color = team === "red" ? 0 : 1;
    socket.emit("updateTeams", { name, room, color, informer });
  };

  // console.log(inLobby);

  return (
    <div
      className={`box-content p-4 rounded-3xl bg-${
        team === "red" ? "red" : "blue"
      }-600 px-8 pt-5 flex-col flex max-w-3xl w-64 mr-16`}
    >
      <div className="flex justify-between w-full  font-black  text-yellow-400">
        <p className="text-4xl">{team === "red" ? "RED" : "BLUE"}</p>
        {/* <p className="text-yellow-1000">-</p> */}
        <p className="oldstyle-nums text-6xl">
          {score ? score[team === "red" ? 0 : 1] : 0}
        </p>
      </div>

      <div className="flex flex-col mt-5">
        <h5 className={`mb-1 text-${team}-300`}>Operative(s)</h5>
        <List
          horizontal
          bulleted
          items={teamMem
            .filter((mem) => mem.informer === false)
            .map((mem) => mem.name)}
        />
        {inLobby && (
          <div className="w-auto mt-1">
            <Button
              compact
              size="small"
              color="purple"
              onClick={(e) => handleUpdateTeams(e, false)}
            >
              Join as Operative
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col mt-5">
        <h5 className={`mb-1 text-${team}-300`}>Detective(s)</h5>
        <List
          horizontal
          bulleted
          items={teamMem
            .filter((mem) => mem.informer === true)
            .map((mem) => mem.name)}
        />
        {inLobby && (
          <div className="w-auto mt-1">
            <Button
              compact
              size="small"
              color="purple"
              onClick={(e) => handleUpdateTeams(e, true)}
            >
              Join as Detective
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
