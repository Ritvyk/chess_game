const http = require("http");
const io = require("socket.io")(3030, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
  },
});

const port = 3000;

const server = http
  .createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World");
  })
  .listen(3000);

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
