import React, { useRef, useEffect } from "react";

const Board = ({ socket }) => {
  console.log(socket);
  const canvasRef = useRef(null);

  const draw = (ctx, socket) => {
    let x;
    let y;
    let mouseDown = false;

    window.onmousedown = (e) => {
      ctx.moveTo(x, y);
      socket.emit("down", { x, y });
      mouseDown = true;
    };

    window.onmouseup = (e) => {
      mouseDown = false;
    };

    socket.on("onDown", ({ x, y }) => {
      ctx.moveTo(x, y);
    });

    socket.on("onDraw", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    socket.on("initialBoardState", (arr) => {
      console.log(arr);
      arr.forEach(({ x, y, z }, i) => {
        if (z) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });
    });

    window.onmousemove = (e) => {
      x = e.clientX;
      y = e.clientY;

      if (mouseDown) {
        socket.emit("drawing", { x, y });
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 800;
    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context, socket);
  }, [socket]);

  return <canvas ref={canvasRef} />;
};

export default Board;
