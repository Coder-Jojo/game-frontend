import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { Chat, TeamCard } from ".";

const Game = ({ socket, name, room, redTeam, blueTeam, inLobby }) => {
  const [score, setScore] = useState([0, 0]);
  const [time, setTime] = useState(60);

  useEffect(() => {
    socket.on("updateScore", (score) => {
      setScore(score);
    });

    socket.on("resetTime", (time) => {
      setTime(time);
    });
  }, [socket]);

  return (
    <div className="bg-gray-50 h-screen p-0">
      <Grid celled="internally" className="h-screen p-0">
        <Grid.Row floated="up" className="p-0">
          <Grid.Column width={4} className="p-0 m-0">
            <div className="rounded-3xl h-24 bg-gray-700 w-full flex justify-between">
              <div className="self-center font-black text-5xl text-white pl-5">
                NO_NAME
              </div>
              <div className="self-center font-bold text-5xl text-white pr-5">
                {time}
              </div>
            </div>
            <div className="flex flex-col justify-around h-5/6 w-full items-center">
              <TeamCard
                score={score}
                name={name}
                room={room}
                team="red"
                teamMem={redTeam}
                inLobby={inLobby}
              />
              <TeamCard
                score={score}
                name={name}
                room={room}
                team="blue"
                teamMem={blueTeam}
                inLobby={inLobby}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={9}>asldfk;afsd</Grid.Column>
          <Grid.Column width={3} className="h-screen p-0 m-0">
            <Chat socket={socket} name={name} room={room} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Game;
