"use strict";
////////////////////////////////
//  Initial Game Objects
////////////////////////////////

//create an Object for initial piece position => Key: position id, value: piece type
const initialPos = {
  a8: "black_rook",
  b8: "black_knight",
  c8: "black_bishop",
  d8: "black_queen",
  e8: "black_king",
  f8: "black_bishop",
  g8: "black_knight",
  h8: "black_rook",
  a7: "black_pawn",
  b7: "black_pawn",
  c7: "black_pawn",
  d7: "black_pawn",
  e7: "black_pawn",
  f7: "black_pawn",
  g7: "black_pawn",
  h7: "black_pawn",

  a1: "white_rook",
  b1: "white_knight",
  c1: "white_bishop",
  d1: "white_queen",
  e1: "white_king",
  f1: "white_bishop",
  g1: "white_knight",
  h1: "white_rook",
  a2: "white_pawn",
  b2: "white_pawn",
  c2: "white_pawn",
  d2: "white_pawn",
  e2: "white_pawn",
  f2: "white_pawn",
  g2: "white_pawn",
  h2: "white_pawn",
};

// create an object for current piece position => Key: position id, value: piece type
const currPos = {
  a8: "black_rook",
  b8: "black_knight",
  c8: "black_bishop",
  d8: "black_queen",
  e8: "black_king",
  f8: "black_bishop",
  g8: "black_knight",
  h8: "black_rook",
  a7: "black_pawn",
  b7: "black_pawn",
  c7: "black_pawn",
  d7: "black_pawn",
  e7: "black_pawn",
  f7: "black_pawn",
  g7: "black_pawn",
  h7: "black_pawn",

  a1: "white_rook",
  b1: "white_knight",
  c1: "white_bishop",
  d1: "white_queen",
  e1: "white_king",
  f1: "white_bishop",
  g1: "white_knight",
  h1: "white_rook",
  a2: "white_pawn",
  b2: "white_pawn",
  c2: "white_pawn",
  d2: "white_pawn",
  e2: "white_pawn",
  f2: "white_pawn",
  g2: "white_pawn",
  h2: "white_pawn",
};

//create an Object for piece images => Key: piece type, value: img src
const piecesImg = {
  white_pawn: "./img/wp.png",
  white_rook: "./img/wr.png",
  white_knight: "./img/wn.png",
  white_bishop: "./img/wb.png",
  white_king: "./img/wk.png",
  white_queen: "./img/wq.png",
  black_pawn: "./img/bp.png",
  black_rook: "./img/br.png",
  black_knight: "./img/bn.png",
  black_bishop: "./img/bb.png",
  black_king: "./img/bk.png",
  black_queen: "./img/bq.png",
};

////////////////////////////////
//  Create Game Class
////////////////////////////////

class Game {
  constructor(isPlayerWhite) {
    this.isPlayerWhite;
  }
  //======================================================== Function to Generate Chess Board Element
  generateBoard() {
    const container = document.querySelector(".container");
    const row_col = 8;
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let index = 0;
    let dark = false;
    let num = 1;

    //Create a div containing the whole chess-board
    const chessBoard = document.createElement("div");
    chessBoard.className = "chess-board";

    //Create the squares in the board
    for (let i = row_col; i > 0; i--) {
      for (let j = 0; j < row_col; j++) {
        const square = document.createElement("div");
        square.className = "piece-box";
        //alternate the creations of dark and light squares
        if (dark) {
          square.classList.add("dark-box");
          square.id = `${letters[j]}${i}`;
          square.innerHTML = `<span class="piece-box-text">${square.id}</span>`;
          dark = !dark;
        } else {
          square.classList.add("light-box");
          square.id = `${letters[j]}${i}`;
          square.innerHTML = `<span class="piece-box-text">${square.id}</span>`;
          dark = !dark;
        }
        chessBoard.appendChild(square);
      }
      dark = !dark;
    }

    container.appendChild(chessBoard);
  }
  //======================================================== Generate Chess Pieces on the board based on objects
  //function to place pieces at the allocated position from 'object'pos
  generatePieceBasedOnObject(object) {
    //comb through the keys in an object
    for (const piecePos in object) {
      //get the key value (piece type) and assign it to 'pieceType'
      const pieceType = object[piecePos];
      //since pieceType is the key in piecesImg(object), use it to access the individual src and assign it to 'imgLoc'
      const imgLoc = piecesImg[pieceType];
      //create img element with class="piece", piece-type= piceType and src of the individual img base on the pieceType
      const imgElement = document.createElement("img");
      imgElement.classList.add("piece");
      imgElement.setAttribute("piece-type", pieceType);
      imgElement.src = `${imgLoc}`;
      //img Element is appended to the the square id that is given by the key from the object
      document.querySelector(`#${piecePos}`).append(imgElement);
    }
  }
}

////////////////////////////////
//  Create ChessPiece Class
////////////////////////////////

class ChessPiece {
  constructor(name, id, color, isSelected, isAttacked) {
    this.name, this.id, this.isSelected, this.isAttacked;
  }

  setSquare(square) {}

  getSquare() {}
}

////////////////////////////////
//  Add Event Listeners
////////////////////////////////

const posArray = [];
//select box
function AddSquareListeners() {
  const squareArrays = document.querySelectorAll(".piece-box");
  console.log(squareArrays);
  for (const squareArray of squareArrays) {
    console.log(squareArray);
    console.log(squareArray.getAttribute("id"));
    // console.log(squareArray.querySelector("img").getAttribute("piece-type"));
    // // console.log([...squareArray.getAttribute("piece-type")]);
    posArray.push(squareArray.getAttribute("id"));

    squareArray.addEventListener("mousedown", () => {
      const clicked = document.querySelector(
        `#${squareArray.getAttribute("id")}`
      );
      console.log(squareArray.getAttribute("id"));
      clicked.classList.add("piece-ready");
    });
    squareArray.addEventListener("mouseup", () => {
      const clicked = document.querySelector(
        `#${squareArray.getAttribute("id")}`
      );
      clicked.classList.remove("piece-ready");
    });
    squareArray.addEventListener("mouseenter", () => {
      const currMousePos = document.querySelector(
        `#${squareArray.getAttribute("id")}`
      );
      currMousePos.classList.add("piece-selected");
    });
    squareArray.addEventListener("mouseleave", () => {
      const lastMousePos = document.querySelector(
        `#${squareArray.getAttribute("id")}`
      );
      lastMousePos.classList.remove("piece-selected");
      lastMousePos.classList.remove("piece-ready");
    });
  }
}

////////////////////////////////
//  Start Chess Game
////////////////////////////////

let isPlayerWhite = true;
const chessGame = new Game(isPlayerWhite);
chessGame.generateBoard();
chessGame.generatePieceBasedOnObject(initialPos);
AddSquareListeners();
