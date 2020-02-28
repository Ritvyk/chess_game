//DATE : 28-02-2020 | Ritvik
//function to set the board to a matrix by giving them index
var playerStack = {
    from: "",
    to: "",
    moved: false
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
    }
    else {
        window.playerTurn = "player1";
        resetPlayerStack();
    }
}
class UIControl {
    setPath(cellid) {
        playerStack.from = cellid;
    }
    static getChessBlocks() {
        return document.getElementsByClassName("chess-block");
    }
    static setPlayerTurn(player) {
        if (getPlayerTurn() === "player1") {
            document.getElementById("player1-box").style.backgroundColor = "green";
            document.getElementById("player2-box").style.backgroundColor = "white";
        }
        else {
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
    playerWinsPiece(player,piece)
    {
        var winningBox=document.getElementById("winings-"+player);
        var el=document.createElement("img");
        el.src=piece.src;
        winningBox.appendChild(el);
    }
    removePiece = (cell, piece) => {
        // console.log("removing");
        var block = document.getElementById(cell);
        block.removeChild(piece);
        deselectBlock(block);
    }
    addPiece = (cell, piece) => {
        // console.log("addpeice")
        if (document.getElementById(cell).children.length === 0) {
            document.getElementById(cell).appendChild(piece);
            UIControl.changePlayer();
        }
        else{
            //removing the prvios price if the "To" block contains 
            var block = document.getElementById(cell);
            var prevPiece=block.children[0];
            block.removeChild(block.children[0]);
            block.appendChild(piece);
            //let the current player win a chess piece...
            this.playerWinsPiece(getPlayerTurn(),prevPiece);
            UIControl.changePlayer();
        }
    }
    static moveChessPiece() {
        var moves = getPlayerStack();
        var chessPiece = document.getElementById(moves.from).children[0];
        var control = new ChessPiece();
        control.removePiece(moves.from, chessPiece);
        control.addPiece(moves.to, chessPiece);
        setPlayerStack("moved", true);
    }
    static seeIfMove(block) {
        var stack = getPlayerStack();
        if (stack.from != "") {
            var stack = getPlayerStack();
            if (block.children.length === 0) {
                setPlayerStack("to", block.id);
                this.moveChessPiece();
            }
            else {
                // console.log("block has a piece");
                var playerPieceInBlock = $(block.children[0]).data("player");
                if (playerPieceInBlock != getPlayerTurn()) {
                    setPlayerStack("to", block.id);
                    this.moveChessPiece();
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
    }
}
var rows = document.getElementsByClassName("chess-row")
for (var i = 1; i <= rows.length; i++) {
    SetChessBoard(rows[i - 1], i)
}

function selectBlock(obj) {
    var chessBlocks = UIControl.getChessBlocks();
    for (var i = 0; i < chessBlocks.length; i++) {
        deselectBlock(chessBlocks[i]);
    }
    $(obj).css({
        "border": "3px solid orangered"
    });
    $(obj).data("selected", "yes");
    var chessMove = new UIControl();
    //passing the cell to set the from path in the player stack by verifyin gal the conditions 
    chessMove.setPath(obj.id);
}
function deselectBlock(obj) {
    $(obj).css({
        "border": "1px solid black"
    });
    $(obj).data("selected", "no");
}
document.getElementById("chess-board").addEventListener("click", function (e) {
    // console.log("clicked");
    var state = getPlayerStack();
    if (state.from != "") {
        if (e.target.classList.contains("chess-piece")) {
            ChessPiece.seeIfMove(e.target.parentElement);
        }
        else {
            ChessPiece.seeIfMove(e.target);
        }
    }
    if (e.target.classList.contains("chess-piece")) {
        var chessBlock = e.target.parentElement;
        var chessPiece = e.target;
        var selected = $(chessBlock).data("selected");
        if (selected === "no") {
            var player = $(chessPiece).data("player");
            if (player === getPlayerTurn()) {
                // console.log("matjced")
                selectBlock(chessBlock);
            }
        }
        else if (selected === "yes") {
            deselectBlock(chessBlock);
        }
        // ChessPiece.seeIfMove(chessBlock);
    } 
})

// function startAMove(e)
// {
//     var state = getPlayerStack();
//     if (state.from != "") {
//         if (e.target.classList.contains("chess-piece")) {
//             ChessPiece.seeIfMove(e.target.parentElement);
//         }
//         else {
//             ChessPiece.seeIfMove(e.target);
//         }
//     }
//     if (e.target.classList.contains("chess-piece")) {
//         var chessBlock = e.target.parentElement;
//         var chessPiece = e.target;
//         var selected = $(chessBlock).data("selected");
//         if (selected === "no") {
//             var player = $(chessPiece).data("player");
//             if (player === getPlayerTurn()) {
//                 // console.log("matjced")
//                 selectBlock(chessBlock);
//             }
//         }
//         else if (selected === "yes") {
//             deselectBlock(chessBlock);
//         }
//         // ChessPiece.seeIfMove(chessBlock);
//     } //if the block doesn't contains a piece it means the player either trying to move a peice or clicking bychanc
// }

//fuctions 
UIControl.setPlayerTurn();