"use strict";
////////////////////////////////
//  Initial Game Objects
////////////////////////////////

//Game Current State
const gameState = {
  isWhiteTurn: true,
  storedPieceElement: null,
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
//  Initialise Chess Game
////////////////////////////////

//========================================================== Generate Chess Board

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
  container.insertAdjacentElement("afterbegin", chessBoard);
}

//========================================================== Generate Pieces on Chess Board based on 'initialPos Obj

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
  updateCurrParam();
}

//========================================================== initialise currentParams as an object
const currentParams = {};
//========================================================== initialise possibleMoves as an object
const possibleMoves = {};

////////////////////////////////
//  update currentParams Obj
////////////////////////////////

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

    //initialise currentParams for every square
    currentParams[squareArrayId] = {};
    //input all params in the currentParams obj
    currentParams[squareArrayId].squareArray = squareArray;
    currentParams[squareArrayId].squareArrayId = squareArrayId;
    currentParams[squareArrayId].pieceElement = pieceElement;
    currentParams[squareArrayId].pieceType = pieceType;
    currentParams[squareArrayId].pieceColor = pieceColor;

    // console.log(currentParams);
  });
}

////////////////////////////////
// Event Listeners Obj
////////////////////////////////

function eventListenerStuff() {
  [...document.querySelectorAll(".piece-box")].map((squareArray) => {
    //get the square id
    const squareArrayId = squareArray.getAttribute("id");

    updateCurrParam();

    squareArray.addEventListener("click", (e) => {
      clickFunc(squareArray, squareArrayId, e);
    });
    squareArray.addEventListener("mouseenter", () => {
      mouseenterFunc(squareArray, squareArrayId);
    });
    squareArray.addEventListener("mouseleave", () => {
      mouseleaveFunc(squareArray, squareArrayId);
    });
  });
}

////////////////////////////////
// Event Listeners Obj: clickFunc
////////////////////////////////

function clickFunc(squareArray, squareArrayId, e) {
  if (
    //========================================================== if img exist and there is no piece selected and stored piece element is null
    currentParams[squareArrayId].pieceElement &&
    document.querySelector(".piece-selected") === null &&
    gameState.storedPieceElement === null &&
    squareArray.classList.contains("piece-allowed")
    // && Object.keys(possibleMoves[squareArray]).length !== 0
  ) {
    squareArray.classList.add("piece-selected");
    gameState.storedPieceElement = currentParams[squareArrayId].pieceElement; //use the gamestate.storedPieceElement to store selected img
    // updateCurrParam();
    getPossibleMoves();
    // console.log(gameState.storedPieceElement);
    showPossibleMoves(e.currentTarget);
  } else if (
    //========================================================== if img doesn't exist and there is piece selected
    currentParams[squareArrayId].pieceElement === null &&
    document.querySelector(".piece-selected") !== null &&
    currentParams[squareArrayId].squareArray.classList.contains(
      "piece-possible-move"
    )
  ) {
    const oldId = document.querySelector(".piece-selected").getAttribute("id");
    e.currentTarget.appendChild(currentParams[oldId].pieceElement);
    currentParams[oldId].squareArray.classList.remove("piece-selected");
    gameState.storedPieceElement = null;

    gameState.isWhiteTurn = !gameState.isWhiteTurn;
    // switch (gameState.isWhiteTurn) {
    //   case true:
    //     document.querySelector("body").style.backgroundColor = "white";
    //   case false:
    //     document.querySelector("body").style.backgroundColor = "grey";
    // }

    [...document.querySelectorAll(".piece-possible-move")].map(
      (possibledBox) => {
        possibledBox.classList.remove("piece-possible-move");
      }
    );
  } else if (
    //========================================================== if e.currentTarget is equal to the .selected
    document.querySelector(".piece-selected") === e.currentTarget
  ) {
    // console.log(e.currentTarget);
    e.currentTarget.classList.remove("piece-selected");
    gameState.storedPieceElement = null;
    [...document.querySelectorAll(".piece-possible-move")].map(
      (possibledBox) => {
        possibledBox.classList.remove("piece-possible-move");
      }
    );
  } else if (
    //========================================================== if img exist and there is piece selected
    currentParams[squareArrayId].pieceElement &&
    document.querySelector(".piece-selected") !== null &&
    // currentParams[document.querySelector(".piece-selected").getAttribute("id")]
    //   .pieceColor !== currentParams[squareArrayId].pieceColor &&
    currentParams[squareArrayId].squareArray.classList.contains(
      "piece-possible-move"
    )
  ) {
    const attackerId = document
      .querySelector(".piece-selected")
      .getAttribute("id");
    const attacker = currentParams[attackerId].pieceElement;
    const eaten = currentParams[squareArrayId].pieceElement;
    const eatenColor = currentParams[squareArrayId].pieceColor;
    const eatensquare = currentParams[squareArrayId].squareArray;
    const whiteGraveyard = document.querySelector(".white-graveyard");
    const blackGraveyard = document.querySelector(".black-graveyard");

    switch (eatenColor) {
      case "white":
        whiteGraveyard.appendChild(eaten);
        break;
      case "black":
        blackGraveyard.appendChild(eaten);
        break;
    }
    eatensquare.appendChild(attacker);

    const selected = document.querySelector(".piece-selected");
    selected.classList.remove("piece-selected");
    gameState.storedPieceElement = null;
    gameState.isWhiteTurn = !gameState.isWhiteTurn;

    [...document.querySelectorAll(".piece-possible-move")].map(
      (possibledBox) => {
        possibledBox.classList.remove("piece-possible-move");
      }
    );
  }
  //update current parameters after every click
  updateCurrParam();
  getPossibleMoves();
}
////////////////////////////////
// Event Listeners Obj: mouseenterFunc
////////////////////////////////

function mouseenterFunc(squareArray, squareArrayId) {
  if (document.querySelector(".piece-possible-move") === null) {
    switch (gameState.isWhiteTurn) {
      case true:
        switch (currentParams[squareArrayId].pieceColor) {
          case "white":
            squareArray.classList.add("piece-allowed");

            break;
          case "black":
            squareArray.classList.add("piece-not-allowed");
            break;
        }
        break;
      case false:
        switch (currentParams[squareArrayId].pieceColor) {
          case "black":
            squareArray.classList.add("piece-allowed");
            break;
          case "white":
            squareArray.classList.add("piece-not-allowed");
            break;
        }
        break;
    }
  }
}

////////////////////////////////
// Event Listeners Obj: mouseleaveFunc
////////////////////////////////

function mouseleaveFunc(squareArray, squareArrayId) {
  squareArray.classList.remove("piece-allowed");
  squareArray.classList.remove("piece-not-allowed");
}

////////////////////////////////
//  function to getPossibleMove
////////////////////////////////

function getPossibleMoves() {
  [...document.querySelectorAll(".piece-box")].map((squareArray) => {
    const squareArrayId = squareArray.getAttribute("id");

    //initialise possibleMoves Obj for every square
    possibleMoves[squareArrayId] = {};

    //seperate id to columns(change alphabets to numbers) and rows

    // console.log(`${idCol}${idRow}`);
    switch (currentParams[squareArrayId].pieceType) {
      case "pawn":
        pawnPossMove(squareArrayId);
        break;
      case "knight":
        knightPossMove(squareArrayId);
        break;
      case "rook":
        rookPossMove(squareArrayId);
        break;
      case "bishop":
        bishopPossMove(squareArrayId);
        break;
      case "queen":
        rookPossMove(squareArrayId);
        bishopPossMove(squareArrayId);
        break;
      case "king":
        kingPossMove(squareArrayId);
        break;
    }
  });
}

//========================================================== Function for Rook Possible move

function rookPossMove(squareArrayId) {
  const idCol = alphPosIn[squareArrayId[0]];
  const idRow = squareArrayId[1];
  //================== For up Direction

  for (let detRow = Number(idRow) + 1; detRow <= 8; detRow++) {
    if (currentParams[`${alphPosOut[idCol]}${detRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[idCol]}${detRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[idCol]}${detRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[idCol]}${detRow}`] = true;
      break;
    } else if (
      currentParams[`${alphPosOut[idCol]}${detRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      break;
    }
  }
  //================== For down Direction
  for (let detRow = Number(idRow) - 1; detRow >= 1; detRow--) {
    if (currentParams[`${alphPosOut[idCol]}${detRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[idCol]}${detRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[idCol]}${detRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[idCol]}${detRow}`] = true;
      break;
    } else if (
      currentParams[`${alphPosOut[idCol]}${detRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      break;
    }
  }

  //================== For right Direction
  for (let detCol = Number(idCol) + 1; detCol <= 8; detCol++) {
    if (currentParams[`${alphPosOut[detCol]}${idRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${idRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[detCol]}${idRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${idRow}`] = true;
      break;
    } else if (
      currentParams[`${alphPosOut[detCol]}${idRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      break;
    }
  }
  //================== For left Direction
  for (let detCol = Number(idCol) - 1; detCol >= 1; detCol--) {
    if (currentParams[`${alphPosOut[detCol]}${idRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${idRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[detCol]}${idRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${idRow}`] = true;
      break;
    } else if (
      currentParams[`${alphPosOut[detCol]}${idRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      break;
    }
  }
}
//========================================================== Function for Bishop Possible move
function bishopPossMove(squareArrayId) {
  const idCol = alphPosIn[squareArrayId[0]];
  const idRow = squareArrayId[1];
  let detCol = idCol;
  let detRow = idRow;

  //================== For North-East Direction
  for (let i = 1; i <= 8; i++) {
    detCol++;
    detRow++;
    // console.log(`${detCol} and ${detRow}`);
    if (detCol > 8 || detRow > 8) {
      detCol = idCol;
      detRow = idRow;
      break;
    }
    if (currentParams[`${alphPosOut[detCol]}${detRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
      break;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      break;
    }
  }
  detCol = idCol;
  detRow = idRow;
  //================== For South-East Direction
  for (let i = 1; i <= 8; i++) {
    detCol++;
    detRow--;
    if (detCol > 8 || detRow < 1) {
      detCol = idCol;
      detRow = idRow;
      break;
    }
    if (currentParams[`${alphPosOut[detCol]}${detRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
      detCol = idCol;
      detRow = idRow;
      break;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      detCol = idCol;
      detRow = idRow;
      break;
    }
  }
  //================== For South-West Direction

  for (let i = 1; i <= 8; i++) {
    detCol--;
    detRow--;
    if (detCol < 1 || detRow < 1) {
      detCol = idCol;
      detRow = idRow;
      break;
    }
    if (currentParams[`${alphPosOut[detCol]}${detRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
      detCol = idCol;
      detRow = idRow;
      break;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      detCol = idCol;
      detRow = idRow;
      break;
    }
  }
  //================== For North-West Direction

  for (let i = 1; i <= 8; i++) {
    detCol--;
    detRow++;
    if (detCol < 1 || detRow > 8) {
      detCol = idCol;
      detRow = idRow;
      break;
    }
    if (currentParams[`${alphPosOut[detCol]}${detRow}`].pieceElement === null) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
      detCol = idCol;
      detRow = idRow;
      break;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor ===
      currentParams[squareArrayId].pieceColor
    ) {
      detCol = idCol;
      detRow = idRow;
      break;
    }
  }
}
//========================================================== Function for Knight Possible move
function knightPossMove(squareArrayId) {
  const idCol = alphPosIn[squareArrayId[0]];
  const idRow = squareArrayId[1];
  let detCol = Number(idCol);
  let detRow = Number(idRow);
  //================== For Up Direction
  detCol = Number(idCol) + 1;
  detRow = Number(idRow) + 2;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);

  detCol = Number(idCol) - 1;
  detRow = Number(idRow) + 2;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);

  //================== For Right Direction
  detCol = Number(idCol) + 2;
  detRow = Number(idRow) + 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);

  detCol = Number(idCol) + 2;
  detRow = Number(idRow) - 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);

  //================== For Down Direction
  detCol = Number(idCol) + 1;
  detRow = Number(idRow) - 2;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);

  detCol = Number(idCol) - 1;
  detRow = Number(idRow) - 2;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);

  //================== For Left Direction
  detCol = Number(idCol) - 2;
  detRow = Number(idRow) + 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);

  detCol = Number(idCol) - 2;
  detRow = Number(idRow) - 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
}
//========================================================== Function for King Possible move
function kingPossMove(squareArrayId) {
  const idCol = alphPosIn[squareArrayId[0]];
  const idRow = squareArrayId[1];
  let detCol = Number(idCol);
  let detRow = Number(idRow);
  //================== For Up, Down, Left, Right Direction
  detCol = Number(idCol);
  detRow = Number(idRow) + 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
  detCol = Number(idCol);
  detRow = Number(idRow) - 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
  detCol = Number(idCol) + 1;
  detRow = Number(idRow);
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
  detCol = Number(idCol) - 1;
  detRow = Number(idRow);
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
  //================== Diagonals
  detCol = Number(idCol) + 1;
  detRow = Number(idRow) + 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
  detCol = Number(idCol) + 1;
  detRow = Number(idRow) - 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
  detCol = Number(idCol) - 1;
  detRow = Number(idRow) + 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
  detCol = Number(idCol) - 1;
  detRow = Number(idRow) - 1;
  knightAndKingHelperFunc(detCol, detRow, squareArrayId);
}
//========================================================== knight & King Helper Function
function knightAndKingHelperFunc(detCol, detRow, squareArrayId) {
  if (detCol <= 8 && detCol >= 1 && detRow <= 8 && detRow >= 1) {
    if (currentParams[`${alphPosOut[detCol]}${detRow}`].pieceElement === null) {
      //if no piece on square then the move is possible
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
    } else if (
      currentParams[`${alphPosOut[detCol]}${detRow}`].pieceColor !==
      currentParams[squareArrayId].pieceColor //if the piece is not of the same color then move is possible
    ) {
      possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
    }
  }
}
//========================================================== Function for Pawn Possible move
function pawnPossMove(squareArrayId) {
  const idCol = alphPosIn[squareArrayId[0]];
  const idRow = squareArrayId[1];
  let detCol = Number(idCol);
  let detRow = Number(idRow);
  switch (currentParams[squareArrayId].pieceColor) {
    case "white":
      {
        //To move without eating
        if (
          idRow === "2" &&
          currentParams[`${alphPosOut[detCol]}${Number(idRow) + 1}`]
            .pieceElement === null &&
          currentParams[`${alphPosOut[detCol]}${Number(idRow) + 2}`]
            .pieceElement === null
        ) {
          detRow = Number(idRow) + 1;
          possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
          detRow = Number(idRow) + 2;
          possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
        } else if (
          idRow !== "8" &&
          currentParams[`${alphPosOut[detCol]}${Number(idRow) + 1}`]
            .pieceElement === null
        ) {
          detRow = Number(idRow) + 1;
          possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
        }

        //To only eat diagonally
        detCol = Number(idCol);
        if (
          Number(idCol) + 1 <= 8 &&
          currentParams[`${alphPosOut[Number(idCol) + 1]}${Number(idRow) + 1}`]
            .pieceElement !== null &&
          currentParams[`${alphPosOut[Number(idCol) + 1]}${Number(idRow) + 1}`]
            .pieceColor === "black"
        ) {
          possibleMoves[squareArrayId][
            `${alphPosOut[Number(idCol) + 1]}${Number(idRow) + 1}`
          ] = true;
        } else if (
          Number(idCol) - 1 >= 1 &&
          currentParams[`${alphPosOut[Number(idCol) - 1]}${Number(idRow) + 1}`]
            .pieceElement !== null &&
          currentParams[`${alphPosOut[Number(idCol) - 1]}${Number(idRow) + 1}`]
            .pieceColor === "black"
        ) {
          possibleMoves[squareArrayId][
            `${alphPosOut[Number(idCol) - 1]}${Number(idRow) + 1}`
          ] = true;
        }
      }
      break;
    case "black":
      {
        //To move without eating
        if (
          idRow === "7" &&
          currentParams[`${alphPosOut[detCol]}${Number(idRow) - 1}`]
            .pieceElement === null &&
          currentParams[`${alphPosOut[detCol]}${Number(idRow) - 2}`]
            .pieceElement === null
        ) {
          detRow = Number(idRow) - 1;
          possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
          detRow = Number(idRow) - 2;
          possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
        } else if (
          idRow !== "1" &&
          currentParams[`${alphPosOut[detCol]}${Number(idRow) - 1}`]
            .pieceElement === null
        ) {
          detRow = Number(idRow) - 1;
          possibleMoves[squareArrayId][`${alphPosOut[detCol]}${detRow}`] = true;
        }

        //To only eat diagonally
        detCol = Number(idCol);
        if (
          Number(idCol) - 1 >= 1 &&
          currentParams[`${alphPosOut[Number(idCol) - 1]}${Number(idRow) - 1}`]
            .pieceElement !== null &&
          currentParams[`${alphPosOut[Number(idCol) - 1]}${Number(idRow) - 1}`]
            .pieceColor === "white"
        ) {
          possibleMoves[squareArrayId][
            `${alphPosOut[Number(idCol) - 1]}${Number(idRow) - 1}`
          ] = true;
        } else if (
          Number(idCol) + 1 <= 8 &&
          currentParams[`${alphPosOut[Number(idCol) + 1]}${Number(idRow) - 1}`]
            .pieceElement !== null &&
          currentParams[`${alphPosOut[Number(idCol) + 1]}${Number(idRow) - 1}`]
            .pieceColor === "white"
        ) {
          possibleMoves[squareArrayId][
            `${alphPosOut[Number(idCol) + 1]}${Number(idRow) - 1}`
          ] = true;
        }
      }
      break;
  }
}

////////////////////////////////
//  Check for Mate Function
////////////////////////////////

function checkForCheckMate() {}

////////////////////////////////
//  functionshowPossibleMove
////////////////////////////////

function showPossibleMoves(clickedElement) {
  const clickedElementId = clickedElement.getAttribute("id");
  let keys = Object.keys(possibleMoves[clickedElementId]);
  for (const key of keys) {
    const possible = currentParams[key].squareArray.classList.add(
      "piece-possible-move"
    );
  }
}

////////////////////////////////
//  Reset button
////////////////////////////////

const resetButton = document.querySelector("button");
resetButton.addEventListener("click", () => {
  [...document.querySelectorAll(".piece")].map((img) => {
    if (img !== null) {
      img.remove();
    } else {
      return;
    }
  });
  const selectedBox = document.querySelector(".piece-selected");
  // const possibledBox = document.querySelectorAll(".piece-possible-move");
  if (selectedBox !== null) {
    selectedBox.classList.remove("piece-selected");
  }
  [...document.querySelectorAll(".piece-possible-move")].map((possibledBox) => {
    possibledBox.classList.remove("piece-possible-move");
  });

  gameState.storedPieceElement = null;
  gameState.isWhiteTurn = true;
  generatePieceBasedOnObject(initialPos);
});

////////////////////////////////
//  Start Chess Game
////////////////////////////////

generateBoard();
generatePieceBasedOnObject(initialPos);

updateCurrParam();
eventListenerStuff();
