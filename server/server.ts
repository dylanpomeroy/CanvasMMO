import { PlayerDictionary } from "../client/src/types/types";

import * as express from "express";

import { createServer } from "http";
import * as SocketIO from "socket.io";
import { setupSocketIOServer } from "./socketIOConnector";

const app = express();
const http = createServer(app);
const server = SocketIO(http);

const users: PlayerDictionary = {};
setupSocketIOServer(server, users);

http.listen(8080, () => {
  console.log("listening on http://localhost:8080");
});
