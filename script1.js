"use strict";
////////////////////////////////
//  Initial Game Objects
////////////////////////////////

//Game Current State
const gameState = {
  whoseTurn: "white",
};

///type of piecedetereee

const pieceDetermineConfig = {
  pawn: "determinePawn",
  knight: "determineKnight",
  rook: "determineRook",
  bishop: "determineBishop",
  queen: "determineQueen",
  king: "determineKing",
};

//help in  the logic of the game when is comes to the letter  of the id
const alphPosIn = {
  a: "1",
  b: "2",
  c: "3",
  d: "4",
  e: "5",
  f: "6",
  g: "7",
  h: "8",
};

const alphPosOut = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
  6: "f",
  7: "g",
  8: "h",
};

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
//  Generate Chess Board
////////////////////////////////

function generateBoard() {
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

////////////////////////////////
//  Generate Pieces based on Object called 'initialPos'
////////////////////////////////

function generatePieceBasedOnObject(object) {
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

////////////////////////////////
//  function to getPossibleMove
////////////////////////////////

//initialise possibleMoves as an object
const possibleMoves = {};
//initialise currentParams as an object
const currentParams = {};

function getPossibleMoves() {
  [...document.querySelectorAll(".piece-box")].map((squareArray) => {
    //get the square id
    const squareArrayId = squareArray.getAttribute("id");
    //get the img element of individual pieces
    const pieceElement = squareArray.querySelector(".piece");
    //get the value of the 'piece-type' attribute => 'color_nameOfPiece'
    const piece = pieceElement?.getAttribute("piece-type") ?? null;
    //initialise possibleMoves obj with multiple empty obj with key of the square id
    const pieceType = piece?.slice(piece.indexOf("_") + 1) ?? null;

    const pieceColor = piece?.slice(0, piece.indexOf("_")) ?? null;
    possibleMoves[squareArrayId] = {};

    const idCol = alphPosIn[squareArrayId[0]];
    const idRow = squareArrayId[1];
    if (pieceColor === "white") {
    }

    switch (pieceType) {
      case "pawn":
        {
          // console.log(
          //   `I am a ${pieceType} that is on ${squareArrayId} which is ${idCol} and ${idRow}`
          // );
        }
        break;
      case "knight":
        break;
      case "rook":
        {
          for (let i = 1; i <= 8; i++) {
            let possMovCol = `${alphPosOut[idCol]}${i}`;
            let possMovRow = `${alphPosOut[i]}${idRow}`;
            // console.log(possMovCol);
            // console.log(possMovRow);
            // console.log(currentParams[possMovCol].pieceColor);

            if (possMovCol !== squareArrayId) {
              // if (currentParams.possMovCol.pieceColor.value !== pieceColor)
              possibleMoves[squareArrayId][possMovCol] = true;
            }
            if (possMovRow !== squareArrayId) {
              possibleMoves[squareArrayId][possMovRow] = true;
            }
          }

          // console.log(possibleMoves);
        }

        break;
      case "bishop":
        break;
      case "queen":
        break;
      case "king":
        break;
    }
  });
}

////////////////////////////////
//  update updateCurrParam Obj
////////////////////////////////

//update currentPrams Object
function updateCurrParam() {
  //selectAll div with class ".piece-box and and map it to a variable called "squareArray"
  [...document.querySelectorAll(".piece-box")].map((squareArray) => {
    //get the square id
    const squareArrayId = squareArray.getAttribute("id");
    //get the img element of individual pieces
    const pieceElement = squareArray.querySelector(".piece");
    //get the value of the 'piece-type' attribute => 'color_nameOfPiece'
    const piece = pieceElement?.getAttribute("piece-type") ?? null;
    //initialise possibleMoves obj with multiple empty obj with key of the square id
    const pieceType = piece?.slice(piece.indexOf("_") + 1) ?? null;

    const pieceColor = piece?.slice(0, piece.indexOf("_")) ?? null;

    currentParams[squareArrayId] = {};
    currentParams[squareArrayId].squareArray = squareArray;
    currentParams[squareArrayId].squareArrayId = squareArrayId;
    currentParams[squareArrayId].pieceElement = pieceElement;
    currentParams[squareArrayId].pieceType = pieceType;
    currentParams[squareArrayId].pieceColor = pieceColor;

    // console.log(squareArray);
    // console.log(squareArrayId);
    // console.log(pieceElement);
    // console.log(pieceType);

    console.log(currentParams);

    // return handleParams;
  });
}

////////////////////////////////
// Event Listeners Obj
////////////////////////////////

const EventListenerObj = {
  eventListenerStuff() {
    [...document.querySelectorAll(".piece-box")].map((squareArray) => {
      //get the square id
      const squareArrayId = squareArray.getAttribute("id");
      //get the img element of individual pieces
      const pieceElement = squareArray.querySelector(".piece");
      //get the value of the 'piece-type' attribute => 'color_nameOfPiece'
      const piece = pieceElement?.getAttribute("piece-type") ?? null;
      //initialise possibleMoves obj with multiple empty obj with key of the square id
      const pieceType = piece?.slice(piece.indexOf("_") + 1) ?? null;

      const pieceColor = piece?.slice(0, piece.indexOf("_")) ?? null;

      //insert an object with within the 'piecesEventListeners' object
      //=> Key: position id, value: another Object(=> Key: Event, value: function

      //click on squarearray, if squarearray have img and is piece selected

      squareArray.addEventListener("mouseenter", () => {
        switch (gameState.whoseTurn) {
          case "white":
            switch (pieceColor) {
              case "white":
                squareArray.classList.add("piece-selected");
                break;
              case "black":
                squareArray.classList.add("piece-not-allowed");
                break;
            }

            break;
          case "black":
            switch (pieceColor) {
              case "black":
                squareArray.classList.add("piece-selected");
                break;
              case "white":
                squareArray.classList.add("piece-not-allowed");
                break;
            }
            break;
        }
      });
      squareArray.addEventListener("mouseleave", () => {
        squareArray.classList.remove("piece-selected");
        squareArray.classList.remove("piece-not-allowed");
        // squareArray.classList.remove("piece-ready");
      });
      squareArray.addEventListener("click", (e) => {
        //function to recognise the first press of button
        //if there are no ready button
        //then selected button can be ready
        //else remove chesspiece and append it to e.target
        // e.preventDefault();

        const img = pieceElement;
        const newLoc = e.target;

        newLoc.parentNode.getAttribute("id");
        console.log(newLoc.parentNode.getAttribute("id"));
        //square array is piece-selected & .piece-ready does not exist
        if (
          squareArray.classList.contains("piece-selected") &&
          document.querySelector(".piece-ready") === null
        ) {
          // console.log(document.querySelector(".piece-ready"));
          squareArray.classList.add("piece-ready");
        } else if (pieceElement === e.target) {
          squareArray.classList.remove("piece-ready");
        } /*if (e.target !== )*/ else {
          const img = document.querySelector(".piece-ready img");

          const readySquare = document.querySelector(".piece-ready");
          // console.log(newId);
          // console.log(oldId);
          // pieceElement.remove();

          newLoc.insertAdjacentElement("beforeend", img);
          readySquare.classList.remove("piece-ready");

          updateCurrParam();
        }
      });
    });
  },
};

// const chessBoard = document.querySelector(".chess-board");

// chessBoard.addEventListener("mouseenter", () => {
//   [...document.querySelectorAll(".piece-box")].map((squareArray) => {
//     //get the square id
//     const squareArrayId = squareArray.getAttribute("id");
//     //get the img element of individual pieces
//     const pieceElement = squareArray.querySelector(".piece");
//     //get the value of the 'piece-type' attribute => 'color_nameOfPiece'
//     const piece = pieceElement?.getAttribute("piece-type") ?? null;
//     //initialise possibleMoves obj with multiple empty obj with key of the square id
//     const pieceType = piece?.slice(piece.indexOf("_") + 1) ?? null;

//     const pieceColor = piece?.slice(0, piece.indexOf("_")) ?? null;
//   });
// });

////////////////////////////////
//  Start Chess Game
////////////////////////////////

// let isPlayerWhite = true;
generateBoard();
generatePieceBasedOnObject(initialPos);

updateCurrParam();
EventListenerObj.eventListenerStuff();
// EventListenerObj.resetPiecesBoxListeners();
// console.log(piecesEventListeners);
getPossibleMoves();
