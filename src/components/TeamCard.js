import React, { useEffect, useState } from "react";
import { Button, List } from "semantic-ui-react";

const TeamCard = ({ socket, score, team, inLobby, teamMem, name, room }) => {
  const [bgColor, setBgColor] = useState("bg-red-600");

  useEffect(() => {
    if (team === "red") setBgColor("bg-red-600");
    else setBgColor("bg-blue-600");
  }, [team]);

  const handleUpdateTeams = (e, informer) => {
    e.preventDefault();
    const color = team === "red" ? 0 : 1;
    socket.emit("updateTeams", { name, room, color, informer });
  };

  return (
    <div
      className={`box-content p-4 rounded-3xl ${bgColor} px-8 pt-5 flex-col flex max-w-3xl w-64`}
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
        <List horizontal celled>
          {teamMem
            .filter((mem) => mem.isDetective === false)
            .map((mem, i) => {
              return (
                <List.Item key={i}>
                  <p className="text-white font-bold">{mem.name}</p>
                </List.Item>
              );
            })}
        </List>
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
        <List horizontal celled>
          {teamMem
            .filter((mem) => mem.isDetective === true)
            .map((mem, i) => {
              return (
                <List.Item key={i}>
                  <p className="text-white font-bold">{mem.name}</p>
                </List.Item>
              );
            })}
        </List>
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
