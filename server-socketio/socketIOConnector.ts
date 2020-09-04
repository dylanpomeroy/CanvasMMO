import {
  PlayerDictionary,
  Position,
  MessageName,
} from "../client/src/types/types";
import { Server, Socket } from "socket.io";

/**
 * Sets up handler for when a player connects
 */
export const setupSocketIOServer = (
  server: Server,
  players: PlayerDictionary
) => {
  server.on("connection", (socket) => {
    console.log(`User ${socket.id} connected!`);

    players[socket.id] = {
      id: socket.id,
      position: { horizontal: 0, vertical: 0 },
    };

    broadcastPlayerJoined(socket, players);
    emitPlayers(socket, players);
    setupOnDisconnect(socket);

    setupOnPositionUpdate(socket, players);
  });
};

/**
 * Sets up handler for when a player disconnects
 */
const setupOnDisconnect = (socket: Socket) => {
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected.`);
    broadcastPlayerLeft(socket);
  });
};

/**
 * Broadcasts a message to all other players that a player joined
 */
const broadcastPlayerJoined = (
  socket: SocketIO.Socket,
  players: PlayerDictionary
) => {
  return socket.broadcast.emit(MessageName.PlayerJoined, players[socket.id]);
};

/**
 * Broadcasts a message to all other players that a player disconnected
 */
const broadcastPlayerLeft = (socket: Socket) => {
  return socket.broadcast.emit(MessageName.PlayerLeft, socket.id);
};

/**
 * Emits a message providing the connected players
 */
const emitPlayers = (socket: Socket, players: PlayerDictionary) => {
  socket.emit(MessageName.PlayerPositions, players);
};

/**
 *  Sets up handler for when a player's position is updated
 */
const setupOnPositionUpdate = (socket: Socket, players: PlayerDictionary) => {
  socket.on(MessageName.PositionUpdate, (newPosition: Position) => {
    players[socket.id] = {
      id: socket.id,
      position: {
        horizontal: newPosition.horizontal,
        vertical: newPosition.vertical,
      },
    };
    console.log(
      `User ${socket.id} moved to position [${
        players[socket.id].position.horizontal
      }, ${players[socket.id].position.vertical}]`
    );

    broadcastPositionUpdate(socket, players);
  });
};

/**
 * Broadcasts a message to all other players that a player has updated their position
 */
const broadcastPositionUpdate = (socket: Socket, players: PlayerDictionary) => {
  socket.broadcast.emit(MessageName.PositionUpdate, players[socket.id]);
};
