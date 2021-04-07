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

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

const rooms = {
  gupta: {
    name: "gupta",
    scope: "public",
    creator: "ritvik",
    users: [
      { name: "ritvik", isCreator: true, isAudience: false, isOpponent: true },
    ],
  },
};

app.get("/", (req, res) => {
  res.render("welcome", { rooms: rooms });
});

app.post("/room/join/opponent", (req, res) => {
  const roomId = req.body.roomId;
  const opponentName = req.body.name;
  const roomDetails = rooms[req.body.roomId];

  rooms[req.body.roomId] = {
    ...roomDetails,
    users: [
      ...roomDetails.users,
      {
        name: req.body.name,
        isCreator: false,
        isAudience: false,
        isOpponent: true,
      },
    ],
  };

  res.redirect("/" + req.body.roomId + "?opponent=true");

  io.emit("opponent-joined", { name: req.body.name, roomId: req.body.roomId });
});

app.post("/room/audience", (req, res) => {
  const roomDetails = rooms[req.body.roomId];
  rooms[req.body.roomId] = {
    ...roomDetails,
    users: [
      ...roomDetails.users,
      {
        name: req.body.name,
        isCreator: false,
        isAudience: true,
        isOpponent: false,
      },
    ],
  };
  let audience = rooms[req.body.roomId]["users"];
  audience = audience.filter((user) => {
    return user.isAudience;
  });

  res.redirect("/" + req.body.roomId + "?audience=true");
  io.emit("audience-joined", {
    name: req.body.name,
    roomId: req.body.roomId,
    audience: audience.length,
  });
});

app.get("/room/create", (req, res) => {
  res.render("create_room", { rooms: rooms });
});

app.get("/room/join", (req, res) => {
  res.render("join_room", { rooms: rooms });
});

app.get("/:room", (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect("/");
  }
  const currentRoom = rooms[req.params.room];
  const creator = currentRoom.users.filter((user) => {
    return user.isCreator;
  })[0];
  const opponent = currentRoom.users.filter((user) => {
    return user.isCreator === false && user.isOpponent;
  })[0];

  const audience = currentRoom.users.filter((user) => {
    return user.isAudience;
  });

  res.render("index", {
    rooms: rooms,
    creator: creator,
    opponent: opponent,
    audience: audience.length,
    au: audience,
    roomName: req.params.room,
    currentRoom: currentRoom,
  });
});

app.post("/room", (req, res) => {
  const roomName = req.body.roomName;
  const creatorName = req.body.name;
  const scope = req.body.scope;

  console.log(req.body);
  if (rooms[roomName] != null) {
    return res.redirect("/");
  }

  if (rooms[roomName] == null) {
    rooms[roomName] = {
      name: roomName,
      scope: scope,
      creator: creatorName,
      users: [{ name: creatorName, isCreator: true }],
    };
  }
  res.redirect(req.body.roomName + "?creator=true");
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  io.emit("connected", "server connected successfully...");
  socket.on("selectBlock", (data) => {
    console.log(data);
    socket.broadcast.emit("selectBlock:server", data);
  });

  socket.on("abc", (data) => {
    console.log(data);
  });
  socket.on("deselectBlock", (data) => {
    console.log(data);

    socket.broadcast.emit("deselectBlock:server", data);
  });
  socket.on("moveChessPiece", (data) => {
    console.log(data);

    socket.broadcast.emit("moveChessPiece:server", data);
  });

  socket.on("setPlayerStack", (data) => {
    console.log(data);

    socket.broadcast.emit("setPlayerStack:server", data);
  });
});
