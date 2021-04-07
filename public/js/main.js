//DATE : 28-02-2020 | Ritvik
//function to set the board to a matrix by giving them index

const socket = io("https://chessboard-game.herokuapp.com/");
// const socket = io("http://localhost:8000");

let you = "player1";

var pieceAllowedMovements = [];
function getCellId(string) {
  var arr = string.split("-");
  return parseInt(arr[1]);
}
function resetMovements() {
  pieceAllowedMovements = [];
}
function getValidMoves() {
  return pieceAllowedMovements;
}
var rules = {
  pawn: function (cell) {
    var blacksMove = 10;
    var step = 0;
    var whitesMove = -10;
    if (getPlayerTurn() === "player1") {
      step = whitesMove;
    } else {
      step = blacksMove;
    }
    var cellid = getCellId(cell.id);
    var nextRowCell = cellid + step;
    var movesArray = [];
    movesArray.push(nextRowCell);
    movesArray.push(cellid + 2 * step);
    movesArray.push(nextRowCell - 1);
    movesArray.push(nextRowCell + 1);
    pieceAllowedMovements = movesArray;
  },
  knight: function (cell) {
    var blacksMove = 20;
    var step = 0;
    var stepBack = 0;
    var whitesMove = -20;
    if (getPlayerTurn() === "player1") {
      step = whitesMove;
      stepBack = 20;
    } else {
      step = blacksMove;
      stepBack = -20;
    }
    var cellid = getCellId(cell.id);
    var nextRowCell = cellid + step;
    var movesArray = [];
    //ahead
    movesArray.push(nextRowCell + 1);
    movesArray.push(nextRowCell - 1);
    //left side for knight
    movesArray.push(cellid + 2 - 10);
    //right side for knight
    movesArray.push(cellid - 2 - 10);
    //downside
    movesArray.push(cellid + stepBack - 1);
    movesArray.push(cellid + stepBack + 1);
    pieceAllowedMovements = movesArray;
  },
  rook: function (cell) {
    var cellid = getCellId(cell.id);
    var movesArray = [];
    var step = 0;
    // var stepback=10;
    function rooksmove(direction, stepsAtATime) {
      if (direction === "f") {
        step = -10;
      } else if (direction === "b") {
        step = 10;
      } else if (direction === "l") {
        step = -1;
      } else if (direction === "r") {
        step = 1;
      }
      for (var i = 0; i <= 8; i++) {
        if (document.getElementById("cell-" + (cellid + step))) {
          var nextCell = document.getElementById("cell-" + (cellid + step));
          //    //console.log(nextCell);
          if (nextCell.children.length != 0) {
            movesArray.push(cellid + step);
            break;
          } else {
            movesArray.push(cellid + step);
          }
        }
        step -= stepsAtATime;
      }
    }
    rooksmove("f", 10);
    rooksmove("b", -10);
    rooksmove("l", 1);
    rooksmove("r", 1);
    pieceAllowedMovements = movesArray;
  },
  bishop: function (cell) {
    var cellid = getCellId(cell.id);
    var movesArray = [];
    var step = 0;
    function bishopsMove(direction, stepsAtATime, diag) {
      if (direction === "fr") {
        step = -10;
      } else if (direction === "br") {
        step = 10;
      } else if (direction === "fl") {
        step = -10;
      } else if (direction === "bl") {
        step = 10;
      }
      for (var i = 0; i <= 8; i++) {
        if (document.getElementById("cell-" + (cellid + step + diag))) {
          var nextCell = document.getElementById(
            "cell-" + (cellid + step + diag)
          );
          //    //console.log(nextCell);
          if (nextCell.children.length != 0) {
            //console.log(nextCell);
            movesArray.push(cellid + step + diag);
            break;
          } else {
            //console.log(nextCell);
            movesArray.push(cellid + step + diag);
          }
        }
        step -= stepsAtATime;
        if (direction.includes("r")) {
          diag -= 1;
        } else if (direction.includes("l")) {
          diag += 1;
        }
      }
    }
    //movinf....
    bishopsMove("fr", 10, -1);
    bishopsMove("fl", 10, 1);
    bishopsMove("br", -10, -1);
    bishopsMove("bl", -10, 1);
    pieceAllowedMovements = movesArray;
  },
  queen: function (cell) {},
  king: function (cell) {
    var cellid = getCellId(cell.id);
    var movesArray = [];
    movesArray.push(cellid + 10);
    movesArray.push(cellid - 10);
    movesArray.push(cellid + 10 + 1);
    movesArray.push(cellid + 10 - 1);
    movesArray.push(cellid - 10 - 1);
    movesArray.push(cellid - 10 + 1);
    movesArray.push(cellid - 1);
    movesArray.push(cellid + 1);
    pieceAllowedMovements = movesArray;
  },
};
var playerStack = {
  from: "",
  to: "",
  moved: false,
};
var playerTurn = "player1";
function getPlayerStack() {
  return playerStack;
}
function setPlayerStack(prop, value) {
  playerStack[prop] = value;
}
function resetPlayerStack() {
  playerStack.from = "";
  playerStack.to = "";
  playerStack.moved = false;
}
function getPlayerTurn() {
  return playerTurn;
}
function setTurn(player) {
  if (playerTurn === "player1") {
    window.playerTurn = "player2";
    resetPlayerStack();
  } else {
    window.playerTurn = "player1";
    resetPlayerStack();
  }
}
class UIControl {
  static getChessBlocks() {
    return document.getElementsByClassName("chess-block");
  }
  static setPlayerTurn(player) {
    if (getPlayerTurn() === "player1") {
      document.getElementById("player1-box").style.backgroundColor = "green";
      document.getElementById("player2-box").style.backgroundColor = "white";
    } else {
      document.getElementById("player2-box").style.backgroundColor = "green";
      document.getElementById("player1-box").style.backgroundColor = "white";
    }
  }
  static changePlayer() {
    setTurn();
    this.setPlayerTurn();
  }
}
class ChessPiece {
  playerWinsPiece(player, piece) {
    var winningBox = document.getElementById("winings-" + player);

    var el = document.createElement("img");
    el.src = piece.src;
    winningBox.appendChild(el);
    const pieceName = piece.alt;
    if (pieceName == "king") {
      $("#modal").removeClass("d-none");
      $("#who-wins").text(`${player} Wins !`);
    }
  }
  removePiece = (cell, piece) => {
    var block = document.getElementById(cell);
    block.removeChild(piece);
    deselectBlock(block);
  };
  addPiece = (cell, piece) => {
    // //console.log("addpeice")
    if (document.getElementById(cell).children.length === 0) {
      document.getElementById(cell).appendChild(piece);
      UIControl.changePlayer();
    } else {
      //removing the prvios price if the "To" block contains
      var block = document.getElementById(cell);
      var prevPiece = block.children[0];
      block.removeChild(block.children[0]);
      block.appendChild(piece);
      //let the current player win a chess piece...
      this.playerWinsPiece(getPlayerTurn(), prevPiece);
      UIControl.changePlayer();
    }
  };
  static moveChessPiece() {
    var moves = getPlayerStack();
    var chessPiece = document.getElementById(moves.from).children[0];
    var control = new ChessPiece();
    control.removePiece(moves.from, chessPiece);
    control.addPiece(moves.to, chessPiece);
    setPlayerStack("moved", true);
    resetMovements();
    document.getElementById("step").play();
  }
  static seeIfMove(block) {
    var stack = getPlayerStack();
    if (stack.from != "") {
      var stack = getPlayerStack();
      var validMove = false;
      if (block.children.length === 0) {
        setPlayerStack("to", block.id);
        socket.emit("setPlayerStack", {
          key: "to",
          id: block.id,
          roomId: currentRoomId,
        });
        var moves = getValidMoves();
        moves.forEach((cellid) => {
          if ("cell-" + cellid === block.id) {
            validMove = true;
          }
        });
        if (validMove) {
          this.moveChessPiece();
          socket.emit("moveChessPiece", {
            ...getPlayerStack(),
            roomId: currentRoomId,
          });
        }
      } else {
        var playerPieceInBlock = $(block.children[0]).data("player");
        if (playerPieceInBlock != getPlayerTurn()) {
          setPlayerStack("to", block.id);
          socket.emit("setPlayerStack", {
            key: "to",
            id: block.id,
            roomId: currentRoomId,
          });
          var moves = getValidMoves();
          moves.forEach((cellid) => {
            if ("cell-" + cellid === block.id) {
              validMove = true;
            }
          });
          if (validMove) {
            this.moveChessPiece();
            socket.emit("moveChessPiece", {
              ...getPlayerStack(),
              roomId: currentRoomId,
            });
          }
        }
      }
    }
  }
}
function SetChessBoard(row, index) {
  var chessBlocks = row.children;
  for (var j = 1; j <= chessBlocks.length; j++) {
    chessBlocks[j - 1].id = `cell-${index}${j}`;
    $(chessBlocks[j - 1]).data("selected", "no");
    $(chessBlocks[j - 1]).css("border", "none");
  }
}
var rows = document.getElementsByClassName("chess-row");
for (var i = 1; i <= rows.length; i++) {
  SetChessBoard(rows[i - 1], i);
}

function selectBlock(obj) {
  var chessBlocks = UIControl.getChessBlocks();
  for (var i = 0; i < chessBlocks.length; i++) {
    deselectBlock(chessBlocks[i]);
  }

  $(obj).css({
    border: "4px dashed #d0d413",
  });

  $(obj).data("selected", "yes");
  setPlayerStack("from", obj.id);
}
function deselectBlock(obj) {
  $(obj).css({
    border: "none",
  });

  $(obj).data("selected", "no");
}

const getSetGo = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isCreator = urlParams.get("creator");
  const isOpponent = urlParams.get("opponent");
  const isAudience = urlParams.get("audience");

  console.log(isCreator, isOpponent, isAudience);
  if (isOpponent) {
    $("#chess-board").addClass("rotate-right");
    $("#chess-board").removeClass("rotate-left");
    you = "player2";

    $("#board-main-container").removeClass("rotate-parent-right");
    $("#board-main-container").addClass("rotate-parent-left");
  }
  if (isAudience) {
    $("#audience-hid").removeClass("d-none");
  }

  $("#chess-board").on("click", function (e) {
    var state = getPlayerStack();
    if (state.from != "") {
      if (e.target.classList.contains("chess-piece")) {
        ChessPiece.seeIfMove(e.target.parentElement);
      } else {
        ChessPiece.seeIfMove(e.target);
      }
    }
    if (e.target.classList.contains("chess-piece")) {
      var chessBlock = e.target.parentElement;
      var chessPiece = e.target;
      var selected = $(chessBlock).data("selected");
      if (selected === "no") {
        var player = $(chessPiece).data("player");
        if (player === getPlayerTurn() && player === you) {
          var pieceName = chessPiece.alt;

          if (pieceName === "pawn") {
            rules.pawn(chessBlock);
          } else if (pieceName === "knight") {
            rules.knight(chessBlock);
          } else if (pieceName === "rook") {
            rules.rook(chessBlock);
          } else if (pieceName === "bishop") {
            rules.bishop(chessBlock);
          } else if (pieceName === "queen") {
            rules.queen(chessBlock);
          } else if (pieceName === "king") {
            rules.king(chessBlock);
          }
          selectBlock(chessBlock);
          socket.emit("selectBlock", {
            block: { id: chessBlock.id },
            roomId: currentRoomId,
          });
          socket.emit("setPlayerStack", {
            key: "from",
            id: chessBlock.id,
            roomId: currentRoomId,
          });
        }
      } else if (selected === "yes") {
        deselectBlock(chessBlock);
        socket.emit("deselectBlock", {
          block: { id: chessBlock.id },
          roomId: currentRoomId,
        });
      }
      // ChessPiece.seeIfMove(chessBlock);
    } //if the block doesn't conta
  });
};

if (socket !== null) {
  socket.on("connected", (data) => {
    socket.emit("abc", { name: "hello" });
    console.log("Chess game Connected to socket witht server...");
  });
  socket.on("selectBlock:server", (data) => {
    if (currentRoomId === data.roomId) {
      const checkBlock = $("#" + data.block.id);
      selectBlock(checkBlock);
    }
  });

  socket.on("deselectBlock:server", (data) => {
    if (currentRoomId === data.roomId) {
      const checkBlock = $("#" + data.block.id);
      deselectBlock(checkBlock);
    }
  });

  socket.on("moveChessPiece:server", (data) => {
    if (currentRoomId === data.roomId) {
      ChessPiece.moveChessPiece();
    }
  });

  socket.on("setPlayerStack:server", (data) => {
    if (currentRoomId === data.roomId) {
      setPlayerStack(data.key, data.id);
    }
  });

  socket.on("opponent-joined", (data) => {
    if (data.roomId === currentRoomId) {
      $("#opponent-name").text(data.name);
    }
  });

  socket.on("audience-joined", (data) => {
    if (data.roomId === currentRoomId) {
      $("#audience-count").text(data.audience);
      $("#audience-alert").removeClass("d-none");
      $("#audience-name").text(`${data.name} Just joined as audience.`);
      const d = new Date(),
        dformat =
          [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/") +
          " " +
          [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

      let box = document.createElement("div");
      box.classList =
        "shadow-md mt-2 mb-2 p-2 rounded-md border border-gray-200 flex justify-between items-center flex-wrap";
      box.innerHTML = `
                <div class="text-sm text-gray-800 font-bold text-left">
                ${data.name} <span class="ml-2 text-gray-400 font-semibold">(watching)</span>
                </div>
                <div class="text-xs text-gray-500 font-bold text-left p-2">
                ${d}
                </div>
      `;
      $("#audience-box").append(box);
      setTimeout(() => {
        $("#audience-name").text("");
        $("#audience-alert").addClass("d-none");
      }, 2000);
    }
  });
}

//starting from here
$(document).ready(function () {
  UIControl.setPlayerTurn();

  getSetGo();
});
