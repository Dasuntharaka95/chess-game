const gameBoard = $('<div id="gameBoard"></div>');
const playerDisplay = $("#player");
const infoDisplay = $("#info-display");
const lastPageInfo = $('#winner');
const btnGameStartAgain = $('#try-again');
const gameBody = $('#gameBody');
const gameOver = $('#gameOver');
const modeSelect = $('#modeSelect');

const WIDTH = 8;
const TOTAL_SQUARES = WIDTH * WIDTH;

let playerGo = 'black';
playerDisplay.text('black');
let winner = "";
let blackScore = 0;
let whiteScore = 0;
let gameMode = '2player';
let botThinking = false;

const PIECE_VALUES = {
  pawn: 10,
  rook: 50,
  knight: 30,
  bishop: 30,
  queen: 90,
  king: 900
};

const startPieces = [
  rook, knight, bishop, queen, king, bishop, knight, rook,
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  rook, knight, bishop, queen, king, bishop, knight, rook
];

gameOver.addClass("hide");

// --- Mode Selection ---

$('#btn-2player').on('click', function() {
  gameMode = '2player';
  startGame();
});

$('#btn-bot').on('click', function() {
  gameMode = 'bot';
  startGame();
});

function startGame() {
  modeSelect.addClass('hide');
  gameBody.removeClass('hide');
}

let startPositionId;
let draggedElement;
let startPositionSquare;

// --- Board Setup ---

function createBoard() {
  startPieces.forEach((piece, i) => {
    const square = $('<div class="square"></div>');
    square.html(piece);
    square.attr("square-id", i);
    square.find("div")?.attr('draggable', true);

    const row = Math.floor(i / WIDTH) + 1;
    if (row % 2 !== 0) {
      square.addClass(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.addClass(i % 2 === 0 ? "brown" : "beige");
    }

    if (i <= 15) {
      square.find("div svg").addClass("black");
    }
    if (i >= 48) {
      square.find("div svg").addClass("white");
    }

    gameBoard.append(square);
  });

  gameBody.prepend(gameBoard);
}

createBoard();

const allSquares = $(".square");

Array.from(allSquares).forEach(square => {
  $(square).on('dragstart', dragStart);
  $(square).on('dragover', dragOver);
  $(square).on('drop', dragDrop);
  $(square).on('click', clickView);
});

// --- Drag & Click Handlers ---

function clickView(e) {
  if (!(e.target.children[0]?.className.animVal === playerGo)) return;

  const pieceName = $(e.target).attr("id");
  const startPosition = Number($(e.target.parentNode).attr("square-id"));
  const validMoves = [];

  for (let i = 0; i < TOTAL_SQUARES; i++) {
    if (checkIfValid(startPosition, i, pieceName)) {
      const targetSquare = document.querySelector(`[square-id="${i}"]`);
      const taken = targetSquare.firstElementChild?.classList.contains("pieces");
      const opponentGo = playerGo === 'white' ? 'black' : 'white';
      const takenByOpponent = targetSquare.firstElementChild?.firstElementChild.classList.contains(opponentGo);

      if (!taken || (taken && takenByOpponent)) {
        validMoves.push(i);
      }
    }
  }

  if (validMoves.length) {
    validMoves.forEach(squareId => {
      const targetSquare = document.querySelector(`[square-id="${squareId}"]`);
      targetSquare.classList.add("targetPath");
      setTimeout(() => {
        targetSquare.classList.remove("targetPath");
      }, 2000);
    });
  }
}

function dragStart(e) {
  if (botThinking) return;
  if (gameMode === 'bot' && playerGo === 'white') return;
  clickView(e);
  startPositionId = e.target.parentNode.getAttribute('square-id');
  startPositionSquare = e.target.parentNode;
  draggedElement = e.target;
  if (draggedElement.children[0].className.animVal === playerGo) {
    startPositionSquare.classList.add('startPosition');
  }
}

function dragOver(e) {
  e.preventDefault();
}

// --- Move Validation Helpers ---

function getSquare(id) {
  return document.querySelector(`[square-id="${id}"]`);
}

function isSquareEmpty(id) {
  return !getSquare(id).firstChild;
}

function isStraightPathClear(startId, targetId) {
  const startCol = startId % WIDTH;
  const startRow = Math.floor(startId / WIDTH);
  const targetCol = targetId % WIDTH;
  const targetRow = Math.floor(targetId / WIDTH);

  if (startCol !== targetCol && startRow !== targetRow) return false;

  if (startCol === targetCol) {
    const minRow = Math.min(startRow, targetRow);
    const maxRow = Math.max(startRow, targetRow);
    for (let row = minRow + 1; row < maxRow; row++) {
      if (!isSquareEmpty(row * WIDTH + startCol)) return false;
    }
  } else {
    const minCol = Math.min(startCol, targetCol);
    const maxCol = Math.max(startCol, targetCol);
    for (let col = minCol + 1; col < maxCol; col++) {
      if (!isSquareEmpty(startRow * WIDTH + col)) return false;
    }
  }

  return true;
}

function isDiagonalPathClear(startId, targetId) {
  const startCol = startId % WIDTH;
  const startRow = Math.floor(startId / WIDTH);
  const targetCol = targetId % WIDTH;
  const targetRow = Math.floor(targetId / WIDTH);

  const colDiff = Math.abs(targetCol - startCol);
  const rowDiff = Math.abs(targetRow - startRow);

  if (colDiff !== rowDiff || colDiff === 0) return false;

  const colStep = targetCol > startCol ? 1 : -1;
  const rowStep = targetRow > startRow ? 1 : -1;

  for (let step = 1; step < colDiff; step++) {
    const intermediateId = (startRow + step * rowStep) * WIDTH + (startCol + step * colStep);
    if (!isSquareEmpty(intermediateId)) return false;
  }

  return true;
}

function isValidKnightMove(startId, targetId) {
  const startCol = startId % WIDTH;
  const startRow = Math.floor(startId / WIDTH);
  const targetCol = targetId % WIDTH;
  const targetRow = Math.floor(targetId / WIDTH);

  const colDiff = Math.abs(targetCol - startCol);
  const rowDiff = Math.abs(targetRow - startRow);

  return (colDiff === 1 && rowDiff === 2) || (colDiff === 2 && rowDiff === 1);
}

function isValidKingMove(startId, targetId) {
  const startCol = startId % WIDTH;
  const startRow = Math.floor(startId / WIDTH);
  const targetCol = targetId % WIDTH;
  const targetRow = Math.floor(targetId / WIDTH);

  const colDiff = Math.abs(targetCol - startCol);
  const rowDiff = Math.abs(targetRow - startRow);

  return colDiff <= 1 && rowDiff <= 1 && (colDiff + rowDiff > 0);
}

// --- Main Validation ---

function checkIfValid(startId, targetId, piece) {
  startPositionSquare?.classList.remove("startPosition");

  if (startId === targetId) return false;

  switch (piece) {
    case 'pawn': {
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (starterRow.includes(startId) && startId + WIDTH * 2 === targetId && isSquareEmpty(startId + WIDTH) && isSquareEmpty(startId + WIDTH * 2)) ||
        (startId + WIDTH === targetId && isSquareEmpty(startId + WIDTH)) ||
        (startId + WIDTH - 1 === targetId && !isSquareEmpty(startId + WIDTH - 1)) ||
        (startId + WIDTH + 1 === targetId && !isSquareEmpty(startId + WIDTH + 1))
      ) {
        return true;
      }
      break;
    }
    case 'rook':
      return isStraightPathClear(startId, targetId);

    case 'knight':
      return isValidKnightMove(startId, targetId);

    case 'bishop':
      return isDiagonalPathClear(startId, targetId);

    case 'queen':
      return isDiagonalPathClear(startId, targetId) || isStraightPathClear(startId, targetId);

    case 'king':
      return isValidKingMove(startId, targetId);
  }

  return false;
}

// --- Drag Drop ---

function dragDrop(e) {
  e.preventDefault();
  Array.from(document.querySelectorAll(".square")).forEach(square => {
    square.classList.remove("targetPath");
  });

  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains('pieces');
  const opponentGo = playerGo === 'white' ? 'black' : 'white';
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
  const targetId = Number(e.target.getAttribute('square-id')) || Number(e.target.parentNode.getAttribute('square-id'));
  const startId = Number(startPositionId);
  const piece = draggedElement.id;
  const valid = checkIfValid(startId, targetId, piece);

  if (correctGo) {
    if (takenByOpponent && valid) {
      addScore($(e.target).attr("id"));
      $('#black_score').text(blackScore);
      $('#white_score').text(whiteScore);
      e.target.parentNode.append(draggedElement);
      e.target.remove();
      changePlayer();
      if (!checkWin()) {
        triggerBotMove();
      }
      return;
    }
    if (taken && !takenByOpponent) {
      infoDisplay.text("You cannot go here!");
      setTimeout(() => infoDisplay.text(""), 2000);
      return;
    }
    if (valid) {
      e.currentTarget.append(draggedElement);
      changePlayer();
      if (!checkWin()) {
        triggerBotMove();
      }
    }
  }
}

// --- Player & Score ---

function changePlayer() {
  if (playerGo === 'black') {
    reverseIds();
    playerGo = "white";
  } else {
    revertIds();
    playerGo = "black";
  }
  playerDisplay.text(playerGo);
}

function reverseIds() {
  Array.from(allSquares).forEach((square, i) => {
    square.setAttribute('square-id', (TOTAL_SQUARES - 1) - i);
  });
}

function revertIds() {
  Array.from(allSquares).forEach((square, i) => {
    square.setAttribute('square-id', i);
  });
}

function getPieceValue(piece) {
  return PIECE_VALUES[piece] || 0;
}

function addScore(piece) {
  if (playerGo === "black") {
    blackScore += getPieceValue(piece);
  } else if (playerGo === "white") {
    whiteScore += getPieceValue(piece);
  }
}

// --- Win Detection ---

function checkWin() {
  const kings = Array.from(document.querySelectorAll('#king'));

  if (!kings.some(k => k.firstChild.classList.contains('white'))) {
    infoDisplay.html("BLACK PLAYER WINS!");
    playerDisplay.text("Game Over");
    winner = 'BLACK';
    playerDisplay.parent().css("visibility", "hidden");
    disableAllDragging();
    lastPage();
    return true;
  }

  if (!kings.some(k => k.firstChild.classList.contains('black'))) {
    infoDisplay.html("WHITE PLAYER WINS!");
    winner = 'WHITE';
    playerDisplay.parent().addClass("hide");
    playerDisplay.text("Game Over");
    disableAllDragging();
    lastPage();
    return true;
  }

  return false;
}

function disableAllDragging() {
  document.querySelectorAll('.square').forEach(sq => {
    sq.firstChild?.setAttribute('draggable', false);
  });
}

// --- Bot Move ---

function triggerBotMove() {
  if (gameMode !== 'bot') return;
  if (playerGo !== 'white') return;

  botThinking = true;
  infoDisplay.text("Bot is thinking...");

  setTimeout(() => {
    const move = findBestMove();
    if (!move) {
      botThinking = false;
      infoDisplay.text("");
      return;
    }

    const fromSquare = move.fromSquare;
    const toSquare = move.toSquare;
    const piece = move.pieceElement;

    if (move.capturedElement) {
      addScore(move.capturedElement.id);
      $('#black_score').text(blackScore);
      $('#white_score').text(whiteScore);
      move.capturedElement.remove();
    }

    toSquare.appendChild(piece);

    changePlayer();
    botThinking = false;
    infoDisplay.text("");
    checkWin();
  }, 600);
}

// --- Game Over Screen ---

btnGameStartAgain.on("click", () => {});

function lastPage() {
  setTimeout(() => {
    gameBody.addClass("hide");
    gameOver.removeClass("hide");
  }, 500);

  $('#last-page').addClass("animate__pulse animate__infinite infinite");
  lastPageInfo.text(winner === "BLACK" ? "BLACK PLAYER" : "WHITE PLAYER");
}
