import React, { useEffect } from "react";
import { TeamCard } from "./";
import { List, Grid } from "semantic-ui-react";

const Lobby = ({
  socket,
  setRedTeam,
  setBlueTeam,
  setSpectators,
  spectators,
  showResult,
  setShowResult,
  name,
  room,
  redTeam,
  blueTeam,
}) => {
  // const tempArray = [
  //   "adsf",
  //   "adsfdfsaf",
  //   "asdfadsfads",
  //   "asdfzxvczcxc",
  //   "zxcvzxvvzx",
  // ];

  // useEffect(() => {
  //   socket.on("teamsUpdated", (teams) => {
  //     setRedTeam(teams.filter((team) => team.team === 0));
  //     setBlueTeam(teams.filter((team) => team.team === 1));
  //     setSpectators(teams.filter((team) => team.team === -1));

  //     console.log("count++");
  //     console.log(teams);
  //   });
  // }, [socket, setSpectators, setRedTeam, setBlueTeam]);

  useEffect(() => {
    socket.on("teamsUpdated", (teams) => {
      console.log(teams);
    });
  }, [socket]);

  console.log(socket.id);

  return (
    <div className="bg-yellow-500 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
              <TeamCard team="red" />
            </Grid.Column>
            <Grid.Column>
              <div className="box-content p-3 rounded-t-3xl bg-gray-400">
                <p className="text-center">SPECTATATORS </p>
              </div>
              <input type="text" />
              <div className="box-content p-3 rounded-b-3xl bg-gray-50">
                <List
                  className="text-center"
                  divided
                  size="huge"
                  items={spectators?.map((a) => a.name)}
                />
              </div>
            </Grid.Column>
            <Grid.Column>
              <TeamCard />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default Lobby;
