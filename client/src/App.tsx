import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";

import socketIoClient from "socket.io-client";

interface Position {
  horizontal: number;
  vertical: number;
}

interface Player {
  id: string;
  position: Position;
}

const socket = socketIoClient("http://localhost:8080");

export default () => {
  const [myPosition, setMyPosition] = useState<Position>({
    horizontal: 0,
    vertical: 0,
  });
  const [userPositions, setUserPositions] = useState<{ [id: string]: Player }>(
    {}
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("called startup useEffect");
    socket.on(
      "playerPositions",
      (playerPositions: { [id: string]: Player }) => {
        setUserPositions(playerPositions);
      }
    );

    socket.on("positionUpdate", (player: Player) => {
      const newUserPositions = { ...userPositions };
      newUserPositions[player.id] = player;
      setUserPositions(newUserPositions);
    });

    socket.on("playerJoined", (player: Player) => {
      const newUserPositions = { ...userPositions };
      newUserPositions[player.id] = player;
      setUserPositions(newUserPositions);
    });

    socket.on("playerLeft", (player: Player) => {
      const newUserPositions = { ...userPositions };
      delete newUserPositions[player.id];
      setUserPositions(newUserPositions);
    });
  }, []);

  useEffect(() => {
    console.log("called useEffect for canvas draw");
    const canvas = canvasRef.current;
    if (!canvas) throw "canvas not found.";

    const context = canvas.getContext("2d");
    if (!context) throw "canvas context could not be got.";

    context.clearRect(0, 0, window.innerHeight, window.innerWidth);

    // draw
    drawPlayer(context, myPosition, true);
    // Object.values(userPositions).forEach((user) =>
    //   drawPlayer(context, user.position, false)
    // );
  }, [myPosition]);

  const drawPlayer = (
    context: CanvasRenderingContext2D,
    position: Position,
    isMe: boolean
  ) => {
    const positionX = 250 + 10 * position.horizontal;
    const positionY = 250 + 10 * position.vertical;

    const radius = isMe ? 20 : 10;

    context.beginPath();
    context.arc(positionX, positionY, radius, 0, 2 * Math.PI);
    context.stroke();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    console.log("handleKeyPress");
    let positionUpdate: Position = { horizontal: 0, vertical: 0 };

    if (event.keyCode === 39) {
      positionUpdate = { horizontal: 1, vertical: 0 };
    } else if (event.keyCode === 38) {
      positionUpdate = { horizontal: 0, vertical: -1 };
    } else if (event.keyCode === 37) {
      positionUpdate = { horizontal: -1, vertical: 0 };
    } else if (event.keyCode === 40) {
      positionUpdate = { horizontal: 0, vertical: 1 };
    }

    console.log(positionUpdate);
    socket.emit("positionUpdate", positionUpdate);
    setMyPosition({
      horizontal: myPosition.horizontal + positionUpdate.horizontal,
      vertical: myPosition.vertical + positionUpdate.vertical,
    });
  };

  return (
    <>
      <h1>Hello!</h1>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        tabIndex={0}
        onKeyDown={handleKeyPress}
      />
    </>
  );
};
