import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Position, Player, PlayerDictionary, MessageName } from "./types/types";

import socketIoClient from "socket.io-client";
import { setupSocketIOClient, emitPositionUpdate } from "./socketIOConnector";
import { useControls } from "./hooks/useControls";

const socket = socketIoClient("http://localhost:8080");

export default () => {
  const [myPosition, setMyPosition] = useState<Position>({
    horizontal: 0,
    vertical: 0,
  });
  const [players, setPlayers] = useState<PlayerDictionary>({});

  const { left, right, up, down } = useControls();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frame = () => {
    let horizontal = 0,
      vertical = 0;

    if (up.current) vertical--;
    if (down.current) vertical++;
    if (left.current) horizontal--;
    if (right.current) horizontal++;

    if (horizontal != 0 && vertical != 0) {
      horizontal = horizontal * 0.6;
      vertical = vertical * 0.6;
    }

    if (horizontal || vertical) {
      setMyPosition((prev) => ({
        vertical: prev.vertical + vertical,
        horizontal: prev.horizontal + horizontal,
      }));
    }
  };

  useEffect(() => {
    setupSocketIOClient(socket, players, setPlayers);
    setInterval(frame, 1000 / 60);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) throw "canvas not found.";

    const context = canvas.getContext("2d");
    if (!context) throw "canvas context could not be got.";

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // draw
    drawPlayer(context, myPosition, true);
    Object.values(players).forEach((player) =>
      drawPlayer(context, player.position, false)
    );
  }, [myPosition, players]);

  useEffect(() => {
    emitPositionUpdate(socket, myPosition);
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

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth - 10}
      height={window.innerHeight - 10}
      tabIndex={0}
    />
  );
};
