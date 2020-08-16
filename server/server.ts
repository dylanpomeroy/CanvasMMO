import * as express from "express";

var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const userPositions = {};

io.on("connection", (socket) => {
  console.log("a user connected!");
  socket.broadcast.emit("playerJoined", socket.id);
  socket.emit("playerPositions", userPositions);

  console.log(`user id is ${socket.id}`);
  userPositions[socket.id] = [0, 0];

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("playerLeft", socket.id);
  });

  socket.on("positionUpdate", (positionAdjustment) => {
    userPositions[socket.id] = [
      userPositions[socket.id][0] + positionAdjustment[0],
      userPositions[socket.id][1] + positionAdjustment[1],
    ];
    console.log(
      `User ${socket.id} moved to position ${userPositions[socket.id]}`
    );

    socket.broadcast.emit(
      "positionUpdate",
      socket.id,
      userPositions[socket.id]
    );
  });
});

http.listen(8080, () => {
  console.log("listening on *:8080");
});
