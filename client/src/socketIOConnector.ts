import { MessageName, PlayerDictionary, Player, Position } from "./types/types";

export const setupSocketIOClient = (
  socket: SocketIOClient.Socket,
  players: PlayerDictionary,
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDictionary>>
) => {
  setupOnPlayerPositions(socket, setPlayers);
  setupOnPositionUpdate(socket, players, setPlayers);
  setupOnPlayerJoined(socket, players, setPlayers);
  setupOnPlayerLeft(socket, players, setPlayers);
};

export const emitPositionUpdate = (
  socket: SocketIOClient.Socket,
  position: Position
) => {
  socket.emit(MessageName.PositionUpdate, position);
};

const setupOnPlayerPositions = (
  socket: SocketIOClient.Socket,
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDictionary>>
) => {
  socket.on(MessageName.PlayerPositions, (newPlayers: PlayerDictionary) => {
    setPlayers(newPlayers);
  });
};

const setupOnPositionUpdate = (
  socket: SocketIOClient.Socket,
  players: PlayerDictionary,
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDictionary>>
) => {
  socket.on(MessageName.PositionUpdate, (player: Player) => {
    const newPlayers = { ...players };
    newPlayers[player.id] = player;
    setPlayers(newPlayers);
  });
};

const setupOnPlayerJoined = (
  socket: SocketIOClient.Socket,
  players: PlayerDictionary,
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDictionary>>
) => {
  socket.on(MessageName.PlayerJoined, (player: Player) => {
    const newPlayers = { ...players };
    newPlayers[player.id] = player;
    setPlayers(newPlayers);
  });
};

const setupOnPlayerLeft = (
  socket: SocketIOClient.Socket,
  players: PlayerDictionary,
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDictionary>>
) => {
  socket.on(MessageName.PlayerLeft, (player: Player) => {
    const newPlayerPositions = { ...players };
    delete newPlayerPositions[player.id];
    setPlayers(newPlayerPositions);
  });
};
