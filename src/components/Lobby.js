import React, { useEffect } from "react";
import { TeamCard } from "./";
import { List, Grid, Label, Button, Icon } from "semantic-ui-react";

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
  useEffect(() => {
    const updateTeams = (teams) => {
      setSpectators(teams.filter((s) => s.team === -1));
      setRedTeam(teams.filter((s) => s.team === 0));
      setBlueTeam(teams.filter((s) => s.team === 1));
    };

    socket.emit("getLobbyStatus", room, (teams) => {
      updateTeams(teams);
    });

    socket.on("teamsUpdated", (teams) => {
      updateTeams(teams);
      console.log(teams);
    });
  }, [socket, room, setSpectators, setBlueTeam, setRedTeam]);

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(room);
  };

  return (
    <div className="bg-yellow-500 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
              <TeamCard
                socket={socket}
                name={name}
                room={room}
                team="red"
                teamMem={redTeam}
              />
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
              <TeamCard
                socket={socket}
                name={name}
                room={room}
                team="blue"
                teamMem={blueTeam}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row></Grid.Row>
        </Grid>
        <div className="w-full flex justify-center p-0">
          <div className=" max-w-full">
            <span className="bg-gray-100">
              <Label>{room}</Label>
            </span>

            <Button
              className=""
              size="mini"
              color="teal"
              onClick={(e) => handleCopy(e)}
            >
              <Icon name="copy" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
