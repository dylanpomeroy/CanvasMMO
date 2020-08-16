import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Position, Player, PlayerDictionary, MessageName } from "./types/types";

import socketIoClient from "socket.io-client";

const socket = socketIoClient("http://localhost:8080");

export default () => {
  const [myPosition, setMyPosition] = useState<Position>({
    horizontal: 0,
    vertical: 0,
  });
  const [users, userPositions] = useState<PlayerDictionary>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    socket.on(
      MessageName.PlayerPositions,
      (playerPositions: { [id: string]: Player }) => {
        userPositions(playerPositions);
      }
    );

    socket.on(MessageName.PositionUpdate, (player: Player) => {
      const newUsers = { ...users };
      newUsers[player.id] = player;
      userPositions(newUsers);
    });

    socket.on(MessageName.PlayerJoined, (player: Player) => {
      const newUsers = { ...users };
      newUsers[player.id] = player;
      userPositions(newUsers);
    });

    socket.on(MessageName.PlayerLeft, (player: Player) => {
      const newUserPositions = { ...users };
      delete newUserPositions[player.id];
      userPositions(newUserPositions);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) throw "canvas not found.";

    const context = canvas.getContext("2d");
    if (!context) throw "canvas context could not be got.";

    context.clearRect(0, 0, window.innerHeight, window.innerWidth);

    // draw
    drawPlayer(context, myPosition, true);
    Object.values(users).forEach((user) =>
      drawPlayer(context, user.position, false)
    );
  }, [myPosition, users]);

  useEffect(() => {
    socket.emit(MessageName.PositionUpdate, myPosition);
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
