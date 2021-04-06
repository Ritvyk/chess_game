const socket = io("https://chessboard-game.herokuapp.com/");

socket.on("connected", (data) => {
  console.log("connected to the socket with server...");
});
