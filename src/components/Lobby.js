import React, { useEffect, useState } from "react";
import { TeamCard } from "./";
import { List, Label, Button, Icon, Dimmer } from "semantic-ui-react";
import backgroundImage from "../assets/detect1.jpeg";
import logo from "../logo/logo2.png";
import joinSound from "../sounds/join.wav";
import Cookies from "universal-cookie";

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
  winningTeam,
}) => {
  const cookies = new Cookies();
  const [joinGame, setJoinGame] = useState(false);
  const [mute, setMute] = useState(true);
  const [sound] = useState(new Audio(joinSound));
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    setMute(cookies.get("mute") === "true");
  }, []);

  useEffect(() => {
    if (!mute) {
      sound.currentTime = 0;
      sound.play();
    }
  }, [mute, playSound, sound]);

  useEffect(() => {
    const updateTeams = (teams) => {
      setSpectators(teams.filter((s) => s.team === -1));
      setRedTeam(teams.filter((s) => s.team === 0));
      setBlueTeam(teams.filter((s) => s.team === 1));
    };

    socket.emit("getLobbyStatus", room, (teams) => {
      updateTeams(teams);
    });

    socket.emit("isGameRunning", room, (ans) => {
      setJoinGame(ans);
    });

    socket.on("teamsUpdated", (teams) => {
      setPlaySound((s) => !s);
      updateTeams(teams);
    });
  }, [socket, room, setSpectators, setBlueTeam, setRedTeam]);

  const handleCopy = (e) => {
    e.preventDefault();
    const link =
      window.location.protocol +
      "//" +
      window.location.hostname +
      `?room=${room}`;

    const invite = `You have been invited for JojoGame\nRoom Id: ${room}\n${link}`;
    navigator.clipboard.writeText(invite);
  };

  const handleMute = (e, value) => {
    e.preventDefault();
    setMute(value);
    cookies.set("mute", value);
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

  const handleJoinGame = () => {
    socket.emit("joinRunningGame", { room, name });
  };

  const handleLeave = () => {
    window.location.reload();
  };

  return (
    <div
      className="h-screen bg-center bg-cover overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="grid grid-rows-6 gap-3 max-w-screen-lg mx-auto h-full">
        <div className="h-full flex items-end">
          <div className="h-20 w-full rounded-3xl grid grid-cols-3 bg-gray-900">
            <div className="h-full grid place-content-center p-0">
              <img src={logo} alt="logo" className="h-16" />
            </div>

            <div className="h-full grid place-content-center p-0">
              <p className="place-self-center self-begin font-black text-6xl text-yellow-600">
                LOBBY
              </p>
            </div>

            <div className="h-full grid place-content-center p-0 overflow-hidden">
              <div className="flex overflow-hidden">
                <Button
                  compact
                  color={mute ? "green" : "red"}
                  onClick={(e) => handleMute(e, !mute)}
                >
                  {mute ? "Unmute" : "Mute"}
                </Button>
                {host && (
                  <Button
                    compact
                    color="purple"
                    onClick={(e) => handleReset(e)}
                  >
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
                {joinGame && (
                  <Button
                    compact
                    color="purple"
                    onClick={() => handleJoinGame()}
                  >
                    Join Game
                  </Button>
                )}
                <Button compact color="red" onClick={handleLeave}>
                  Leave
                </Button>
              </div>
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

      <Dimmer
        active={showResult}
        onClickOutside={() => setShowResult(false)}
        page
      >
        <p className="text-white font-black text-6xl mb-7">
          {winningTeam === "red" && (
            <span className="text-red-500 text-7xl">Red</span>
          )}
          {winningTeam === "blue" && (
            <span className="text-blue-500 text-7xl">Blue</span>
          )}
          {winningTeam === "draw" || <span> team has won the game!!!</span>}
          {winningTeam === "draw" && <span> The game has been drawn!!!</span>}
        </p>
      </Dimmer>
    </div>
  );
};

export default Lobby;
