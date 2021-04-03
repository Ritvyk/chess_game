const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
  },
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
