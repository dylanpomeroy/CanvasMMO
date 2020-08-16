// Note: as number of interfaces/types increase, we should break up this file into multiple

export interface Position {
  horizontal: number;
  vertical: number;
}

export interface Player {
  id: string;
  position: Position;
}

export interface PlayerDictionary {
  [id: string]: Player;
}

export enum MessageName {
  PlayerJoined = "playerJoined",
  PlayerLeft = "playerLeft",
  PlayerPositions = "playerPositions",
  PositionUpdate = "positionUpdate",
}
