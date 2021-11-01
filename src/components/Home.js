import React from "react";
import { Button, Input, Modal } from "semantic-ui-react";
import SocketContext from "../socketContext";

const Home = ({ name, setName, setRoom, room, setInGame }) => {
  const socket = React.useContext(SocketContext);

  const exampleReducer = (state, action) => {
    switch (action.type) {
      case "close":
        return { open: false };
      case "open":
        return { open: true, size: action.size };
      default:
        throw new Error("Unsupported action...");
    }
  };

  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (name === "") return;

    socket.emit("createRoom", name, (room) => {
      setRoom(room);

      setInGame(true);
    });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (name === "") {
      alert("please give a nickname before joining");
      return;
    }
    if (room === "") {
      alert("Give a room name");
      return;
    }

    socket.emit("join", { name, room }, (err) => {
      if (err) {
        alert(err);
      } else {
        setInGame(true);
      }
    });
  };

  return (
    <>
      <div className="bg-pink-600 h-screen flex justify-around">
        <div className="flex flex-col justify-around ">
          <div className="box-content p-4 rounded-3xl bg-gray-50 px-8 pt-5 flex-col flex">
            <p className="font-black mb-10 self-center">
              Welcome to the Yet_To_Be_Name_Game !!
            </p>

            <p className="mb-3 self-center">
              Choose a nickname to create/join a room
            </p>
            <Input
              className="mt-0 "
              placeholder="Enter a nickname"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <div className="flex justify-around mt-5 mb-8">
              <Button
                color="purple"
                onClick={() => dispatch({ type: "open", size: "mini" })}
              >
                Join
              </Button>
              <Button color="purple" onClick={(e) => handleCreateRoom(e)}>
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size={size}
        open={open}
        onClose={() => dispatch({ type: "close" })}
        className="box-content rounded-3xl"
      >
        <div className="box-content p-4 rounded-3xl bg-gray-200 px-8 pt-5 flex-col flex">
          <p className="font-black mb-7 self-center">JOIN GAME</p>
          <p className="mb-3 self-center">Enter the room Id below</p>
          <Input
            className="mt-0 mb-5"
            placeholder="Room Id..."
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />
          <Button
            className="self-center mt-5 mb-8"
            color="purple"
            onClick={(e) => handleJoinRoom(e)}
          >
            Join
          </Button>
          <Button
            className="self-center mt-5 mb-8"
            color="purple"
            onClick={(e) => {
              e.preventDefault();
              socket.emit("sendInfo", room, (data) => {
                console.log(data);
              });
            }}
          >
            showInfo
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Home;
