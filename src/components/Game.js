import React from "react";
import { Grid } from "semantic-ui-react";
import { Chat } from ".";

const Game = ({ socket, name, room }) => {
  return (
    <div className="bg-gray-50 h-screen p-0">
      <Grid celled="internally" className="h-screen p-0">
        <Grid.Row floated="up" className="p-0">
          <Grid.Column width={4}>asdfafsd</Grid.Column>
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
