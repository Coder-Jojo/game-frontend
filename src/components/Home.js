import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Button, Input, Modal } from "semantic-ui-react";
import SocketContext from "../socketContext";
import backgroundImage from "../assets/detect1.jpeg";
import logo from "../logo/logo2.png";

const Home = ({ name, setName, setRoom, room, setInGame }) => {
  const socket = React.useContext(SocketContext);

  const [openJoin, setOpenJoin] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    const query = window.location.search;
    if (query.substr(0, 6) === "?room=") {
      setRoom(query.substr(6));
      setOpenJoin(true);
    }

    if (cookies.get("name") !== undefined) setName(cookies.get("name"));
  }, [setRoom, setName]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (name === "") return;

    socket.emit("createRoom", name, (room) => {
      setRoom(room);
      const cookies = new Cookies();
      cookies.set("name", name);
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
        const cookies = new Cookies();
        cookies.set("name", name);
        setInGame(true);
      }
    });
  };

  return (
    <>
      <div
        className="bg-pink-600 h-screen flex justify-around bg-center bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="flex flex-col justify-around ">
          <div className="box-content p-4 rounded-3xl bg-gray-800 px-8 pt-5 flex-col flex">
            <img
              src={logo}
              alt="logo"
              style={{ height: "70px", width: "210px" }}
              className="self-center"
            />
            <p className="font-black text-white text-5xl mt-6 mb-2 self-center">
              Welcome Officer !!
            </p>

            <Input
              className="mt-0 "
              placeholder="Enter a nickname"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <div className="flex justify-around mt-5 mb-8">
              <Button
                size="big"
                color="purple"
                onClick={() => setOpenJoin(true)}
              >
                Join
              </Button>
              <Button
                size="big"
                color="purple"
                onClick={(e) => handleCreateRoom(e)}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal size="mini" open={openJoin} onClose={() => setOpenJoin(false)}>
        <div className="box-content p-4 rounded-3xl bg-gray-900 px-8 pt-5 flex-col flex">
          <p className="font-black text-blue-500 text-6xl mb-7 self-center">
            JOIN GAME
          </p>
          <p className="mb-2 text-white text-2xl self-center">
            Enter the room Id below
          </p>
          <Input
            className="mt-0 mb-5"
            placeholder="Room Id..."
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />
          <div className="flex justify-around">
            <Button
              className=""
              size="big"
              color="purple"
              onClick={() => setOpenJoin(false)}
            >
              Back
            </Button>
            <Button
              className=""
              size="big"
              color="purple"
              onClick={(e) => handleJoinRoom(e)}
            >
              Join
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Home;
