import React, { useRef, useState, useEffect } from "react";
// import CanvasDraw from "react-canvas-draw";

// const Board = ({ socket }) => {
//   const canvasRef = useRef(null);

//   const [tit, setTit] = React.useState(null);

//   const draw = (ctx, socket, canvas) => {
//     let x;
//     let y;
//     let mouseDown = false;

//     setTit(ctx);

//     window.onmousedown = (e) => {
//       console.log(e);
//       ctx.moveTo(x, y);
//       socket.emit("down", { x, y });
//       mouseDown = true;
//     };

//     window.onmouseup = (e) => {
//       mouseDown = false;
//     };

//     socket.on("onDown", ({ x, y }) => {
//       ctx.moveTo(x, y);
//     });

//     socket.on("onDraw", ({ x, y }) => {
//       ctx.lineTo(x, y);
//       ctx.stroke();
//     });

//     socket.on("initialBoardState", (arr) => {
//       arr.forEach(({ x, y, z }, i) => {
//         if (z) {
//           ctx.moveTo(x, y);
//         } else {
//           ctx.lineTo(x, y);
//           ctx.stroke();
//         }
//       });
//     });

//     function getMousePos(canvas, evt) {
//       var rect = canvas.getBoundingClientRect();
//       return {
//         a: evt.clientX - rect.left,
//         b: evt.clientY - rect.top,
//       };
//     }

//     window.onmousemove = (e) => {
//       // x = e.clientX;
//       // y = e.clientY;
//       let { a, b } = getMousePos(canvas, e);

//       if (a <= (window.innerWidth / 16) * 8.6) x = a;
//       console.log(a, (window.innerWidth / 16) * 9);
//       x = a;
//       y = b;

//       if (mouseDown) {
//         socket.emit("drawing", { x, y });
//         ctx.lineTo(x, y);
//         console.log("asdf;l");
//         ctx.stroke();
//       }
//     };
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     // var bounds = canvas.getBoundingClientRect();
//     // canvas.width = canvas.offsetWidth;
//     // canvas.height = canvas.offsetHeight;
//     // canvas.width = "100%";
//     // canvas.height = "100%";
//     canvas.width = "400";
//     canvas.height = "300";
//     const context = canvas.getContext("2d");
//     setTit(context);

//     // window.addEventListener("resize", (e) => {
//     //   console.log(window.innerWidth, window.innerHeight);
//     //   canvas.width = (window.innerWidth / 16) * 6;
//     //   canvas.height = (window.innerHeight / 4) * 3;
//     // });

//     //Our draw come here
//     draw(context, socket, canvasRef.current);
//   }, [socket]);

//   const handleClear = (e) => {
//     e.preventDefault();
//     // console.log(e);
//     // if (tit !== null) {
//     //   // console.log(tit);
//     //   // tit.setTransform(1, 0, 0, 1, 0, 0);
//     //   // tit.clearRect(0, 0, 800, 800);
//     //   // tit.lineWidth = 10;
//     //   // tit.moveTo(canvas.width / 2, 0);
//     //   // tit.lineTo(canvas.Width / 2, window.innerHeight);
//     //   // tit.stroke();
//     // }
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.fillStyle = "white";
//     ctx.clearRect(0, 0, 800, 800);
//   };

//   return (
//     <div className="bg-gray-50 h-full w-full">
//       <canvas ref={canvasRef} />;
//       <button onClick={(e) => handleClear(e)}>butt</button>
//     </div>
//   );
// };

// const Board = ({ socket, room }) => {
//   const canvas = useRef();

//   const [brushColor, setBrushColor] = useState("#000000");
//   const [brushRadius, setBrushRadius] = useState(5);
//   const [disabled, setDisabled] = useState(false);

//   useEffect(() => {
//     socket.on("setDrawing", (data) => {
//       console.log("draw", data);
//       canvas.current.loadSaveData(data);
//     });
//   }, [socket]);

//   const handleChange = () => {
//     console.log("fow");
//     socket.emit("updateDrawing", { room, data: canvas.current.getSaveData() });
//     console.log(canvas.current.getSaveData());
//   };

//   return (
//     <div className="w-full h-full bg-red-500">
//       <CanvasDraw
//         ref={canvas}
//         onChange={handleChange}
//         canvasHeight="100%"
//         canvasWidth="100%"
//         hideGrid={true}
//         lazyRadius={0}
//         gridColor="#FFFFFF"
//         brushColor={brushColor}
//         brushRadius={brushRadius}
//         disabled={disabled}
//       />
//     </div>
//   );
// };

const Board = ({ socket, room }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushRadius, setBrushRadius] = useState(5);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = (window.innerWidth * 8.6) / 16;
    canvas.height = (window.innerHeight * 2) / 3;
    // console.log(window.innerWidth, window.innerHeight);
    // canvas.style.width = `${window.innerWidth}px`;
    // canvas.style.height = `${window.innerHeight}px`;
    canvas.style.cursor = "pointer";

    const context = canvas.getContext("2d");
    // context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit("startDrawing", { room, x: offsetX, y: offsetY });
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    socket.emit("finishDrawing", { room });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    socket.emit("draw", { room, x: offsetX, y: offsetY });
  };

  useEffect(() => {
    prepareCanvas();
  }, []);

  useEffect(() => {
    socket.on("onStartDrawing", ({ x, y }) => {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    });

    socket.on("onFinishDrawing", () => {
      contextRef.current.closePath();
      setIsDrawing(false);
    });

    socket.on("onDraw", ({ x, y }) => {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    });
  }, [socket]);

  useEffect(() => {
    contextRef.current.lineWidth = brushRadius;
    socket.emit("brushRadius", brushRadius);
  }, [socket, brushRadius]);

  const handleClick = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      if (brushRadius > 1) setBrushRadius((b) => b - 1);
    } else {
      if (brushRadius < 30) setBrushRadius((b) => b + 1);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onDoubleClick={handleClick}
        onWheel={(e) => handleWheel(e)}
      />
    </div>
  );
};

export default Board;
