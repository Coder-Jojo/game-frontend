import React, { useRef, useState, useEffect } from "react";
import { Menu, Icon, Button, Progress } from "semantic-ui-react";

const Board = ({ socket, room }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushRadius, setBrushRadius] = useState(5);
  const [brushColor, setBrushColor] = useState("black");
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
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
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

    socket.on("onClear", () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    });

    socket.on("onBrushColor", (brushColor) => {
      setBrushColor(brushColor);
      contextRef.current.strokeStyle = brushColor;
    });

    socket.on("onBrushRadius", (brushRadius) => {
      setBrushRadius(brushRadius);
      contextRef.current.lineWidth = brushRadius;
    });
  }, [socket]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear", { room });
  };

  const handleWheel = (e) => {
    let send = false;
    if (e.deltaY > 0) {
      if (brushRadius > 1) {
        setBrushRadius((b) => b - 1);
        send = true;
      }
    } else {
      if (brushRadius < 30) {
        setBrushRadius((b) => b + 1);
        send = true;
      }
    }
    if (send) {
      socket.emit("brushRadius", { room, brushRadius });
      contextRef.current.lineWidth = brushRadius;
    }
  };

  const handleBrushColor = (brushColor) => {
    setBrushColor(brushColor);
    contextRef.current.strokeStyle = brushColor;
    socket.emit("brushColor", { room, brushColor });
  };

  return (
    <div className="h-full w-full ">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onWheel={(e) => handleWheel(e)}
      />
      <Menu>
        <Menu.Item fitted>
          <Button.Group size="huge" icon>
            <Button color="red" onClick={() => handleBrushColor("red")} />
            <Button color="orange" onClick={() => handleBrushColor("orange")} />
            <Button color="yellow" onClick={() => handleBrushColor("yellow")} />
            <Button color="olive" onClick={() => handleBrushColor("olive")} />
            <Button color="green" onClick={() => handleBrushColor("green")} />
            <Button color="teal" onClick={() => handleBrushColor("teal")} />
            <Button color="blue" onClick={() => handleBrushColor("blue")} />
            <Button color="violet" onClick={() => handleBrushColor("violet")} />
            <Button color="purple" onClick={() => handleBrushColor("purple")} />
            <Button color="pink" onClick={() => handleBrushColor("pink")} />
            <Button color="brown" onClick={() => handleBrushColor("brown")} />
            <Button color="grey" onClick={() => handleBrushColor("grey")} />
            <Button inverted onClick={() => handleBrushColor("white")} />
            <Button color="black" onClick={() => handleBrushColor("black")} />
          </Button.Group>
        </Menu.Item>
        <div className="w-full pr-2 pl-2">
          <Progress
            value={brushRadius}
            total="30"
            progress="ratio"
            color={brushColor}
            label="Brush Radius"
          />
          {/* Brush Radius
          </Progress> */}
        </div>
        <Menu.Item fitted={"vertically"} position="right" onClick={handleClear}>
          <Icon name="trash" size="large" color="black" />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Board;
