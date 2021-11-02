import React, { useEffect } from "react";
import { TeamCard } from "./";
import { List, Label, Button, Icon } from "semantic-ui-react";
import backgroundImage from "../assets/detect1.jpeg";
import logo from "../logo/logo2.png";

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
  host,
  inLobby,
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
      // console.log(teams);
    });
  }, [socket, room, setSpectators, setBlueTeam, setRedTeam]);

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(room);
  };

  const handleReset = (e) => {
    e.preventDefault();
    socket.emit("reset", room);
  };

  const handleCreateGame = (e) => {
    e.preventDefault();
    socket.emit("createGame", room, (err) => {
      if (err) alert(err);
    });
  };

  return (
    <div
      className="h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="grid grid-rows-6 max-w-screen-lg mx-auto h-full">
        <div className="flex flex-col overflow-hidden justify-end">
          <div className="w-full bg-gray-900 flex box-content rounded-3xl h-16 mb-3 justify-between pl-6 pt-1 pb-1">
            <div className="h-20">
              <img src={logo} alt="logo" style={{ height: "75%" }} />
            </div>
            <p className="self-begin font-black text-6xl text-yellow-600">
              LOBBY
            </p>
            <div className="self-center pr-8">
              {host && (
                <Button compact color="purple" onClick={(e) => handleReset(e)}>
                  Reset
                </Button>
              )}
              {host && (
                <Button
                  compact
                  color="purple"
                  onClick={(e) => handleCreateGame(e)}
                >
                  Start Game
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 row-span-3  overflow-hidden">
          <div className="h-full place-self-end ">
            <TeamCard
              socket={socket}
              name={name}
              room={room}
              team="red"
              teamMem={redTeam}
              inLobby={inLobby}
            />
          </div>

          <div className="">
            <div className="box-content p-3 rounded-t-3xl bg-gray-600">
              <p className="text-center text-gray-50 text-2xl">SPECTATORS </p>
            </div>
            {/* <Button color="purple"> JOIN SPECTATORS</Button> */}
            <div className="box-content p-3 rounded-b-3xl bg-gray-50">
              <List
                className="text-center"
                divided
                size="medium"
                items={spectators?.map((a) => a.name)}
              />
            </div>
          </div>

          <div className="h-full place-self-start">
            <TeamCard
              socket={socket}
              name={name}
              room={room}
              team="blue"
              teamMem={blueTeam}
              inLobby={inLobby}
            />
          </div>
        </div>

        <div className="h-full row-span-1 flex flex-col justify-center overflow-hidden ">
          <div className="bg-gray-700 box-content rounded-full p-3">
            <div className="w-full flex justify-center text-white text-4xl fond-black">
              INVITE YOUR FRIENDS!
            </div>
            <div className="w-full flex justify-center p-0">
              <div className=" max-w-full">
                <span className=" bg-gray-100">
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
      </div>
    </div>
  );
};

export default Lobby;
