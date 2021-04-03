const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
  },
});

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Chess game server created by https://ritvyk.netlify.app");
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  io.emit("connected", "server connected successfully...");
  socket.on("selectBlock", (data) => {
    socket.broadcast.emit("selectBlock:server", data);
  });
  socket.on("deselectBlock", (data) => {
    socket.broadcast.emit("deselectBlock:server", data);
  });
  socket.on("moveChessPiece", (data) => {
    socket.broadcast.emit("moveChessPiece:server", data);
  });

  socket.on("setPlayerStack", (data) => {
    socket.broadcast.emit("setPlayerStack:server", data);
  });
});
