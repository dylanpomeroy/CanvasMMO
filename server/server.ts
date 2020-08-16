import * as express from "express";

var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

interface Position {
  horizontal: number;
  vertical: number;
}

interface Player {
  id: string;
  position: Position;
}

const users: { [playerId: string]: Player } = {};

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected!`);

  console.log(`user id is ${socket.id}`);
  users[socket.id] = {
    id: socket.id,
    position: { horizontal: 0, vertical: 0 },
  };

  socket.broadcast.emit("playerJoined", users[socket.id]);
  socket.emit("playerPositions", users);

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
    socket.broadcast.emit("playerLeft", socket.id);
  });

  socket.on("positionUpdate", (newPosition: Position) => {
    users[socket.id] = {
      id: socket.id,
      position: {
        horizontal: newPosition.horizontal,
        vertical: newPosition.vertical,
      },
    };
    console.log(
      `User ${socket.id} moved to position [${
        users[socket.id].position.horizontal
      }, ${users[socket.id].position.vertical}]`
    );

    socket.broadcast.emit("positionUpdate", users[socket.id]);
  });
});

http.listen(8080, () => {
  console.log("listening on http://localhost:8080");
});
