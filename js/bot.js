// --- Chess Bot AI (Minimax with Alpha-Beta Pruning) ---

const BOT_PIECE_SCORES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// Piece-square tables for positional evaluation
const PAWN_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

const PIECE_TABLES = {
  pawn: PAWN_TABLE,
  knight: KNIGHT_TABLE,
  bishop: BISHOP_TABLE,
  rook: ROOK_TABLE,
  queen: QUEEN_TABLE,
  king: KING_TABLE
};

function getBoardSnapshot() {
  const squares = document.querySelectorAll('.square');
  const board = [];
  squares.forEach(sq => {
    const squareId = Number(sq.getAttribute('square-id'));
    const piece = sq.querySelector('.pieces');
    if (piece) {
      const svg = piece.querySelector('svg');
      const color = svg.classList.contains('black') ? 'black' : 'white';
      board.push({
        squareId: squareId,
        type: piece.id,
        color: color,
        element: piece,
        squareElement: sq
      });
    } else {
      board.push({
        squareId: squareId,
        type: null,
        color: null,
        element: null,
        squareElement: sq
      });
    }
  });
  return board;
}

function evaluateBoard() {
  const squares = document.querySelectorAll('.square');
  let score = 0;

  squares.forEach(sq => {
    const piece = sq.querySelector('.pieces');
    if (!piece) return;

    const squareId = Number(sq.getAttribute('square-id'));
    const type = piece.id;
    const svg = piece.querySelector('svg');
    const isWhite = svg.classList.contains('white');

    const materialValue = BOT_PIECE_SCORES[type] || 0;
    const table = PIECE_TABLES[type];
    const tableIndex = isWhite ? (63 - squareId) : squareId;
    const positionalValue = table ? table[tableIndex] : 0;

    if (isWhite) {
      score += materialValue + positionalValue;
    } else {
      score -= materialValue + positionalValue;
    }
  });

  return score;
}

function getAllValidMoves(color) {
  const moves = [];
  const squares = document.querySelectorAll('.square');
  const opponentColor = color === 'white' ? 'black' : 'white';

  squares.forEach(fromSq => {
    const piece = fromSq.querySelector('.pieces');
    if (!piece) return;

    const svg = piece.querySelector('svg');
    if (!svg.classList.contains(color)) return;

    const fromId = Number(fromSq.getAttribute('square-id'));
    const pieceType = piece.id;

    for (let toId = 0; toId < 64; toId++) {
      if (fromId === toId) continue;
      if (!checkIfValid(fromId, toId, pieceType)) continue;

      const toSq = document.querySelector(`[square-id="${toId}"]`);
      const targetPiece = toSq.querySelector('.pieces');

      if (targetPiece) {
        const targetSvg = targetPiece.querySelector('svg');
        if (targetSvg.classList.contains(color)) continue;
        if (targetSvg.classList.contains(opponentColor)) {
          moves.push({
            fromId: fromId,
            toId: toId,
            pieceType: pieceType,
            capture: targetPiece.id,
            pieceElement: piece,
            fromSquare: fromSq,
            toSquare: toSq,
            capturedElement: targetPiece
          });
        }
      } else {
        moves.push({
          fromId: fromId,
          toId: toId,
          pieceType: pieceType,
          capture: null,
          pieceElement: piece,
          fromSquare: fromSq,
          toSquare: toSq,
          capturedElement: null
        });
      }
    }
  });

  // Order moves: captures first for better alpha-beta pruning
  moves.sort((a, b) => {
    if (a.capture && !b.capture) return -1;
    if (!a.capture && b.capture) return 1;
    return 0;
  });

  return moves;
}

function makeTemporaryMove(move) {
  const saved = {
    parentNode: move.pieceElement.parentNode,
    capturedElement: move.capturedElement,
    capturedParent: move.capturedElement ? move.capturedElement.parentNode : null
  };

  if (move.capturedElement) {
    move.capturedElement.remove();
  }
  move.toSquare.appendChild(move.pieceElement);

  return saved;
}

function undoTemporaryMove(move, saved) {
  saved.parentNode.appendChild(move.pieceElement);
  if (saved.capturedElement && saved.capturedParent) {
    saved.capturedParent.appendChild(saved.capturedElement);
  }
}

function minimax(depth, isMaximizing, alpha, beta) {
  if (depth === 0) {
    return evaluateBoard();
  }

  const color = isMaximizing ? 'white' : 'black';
  const moves = getAllValidMoves(color);

  if (moves.length === 0) {
    return isMaximizing ? -19000 : 19000;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const saved = makeTemporaryMove(move);
      const evalScore = minimax(depth - 1, false, alpha, beta);
      undoTemporaryMove(move, saved);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const saved = makeTemporaryMove(move);
      const evalScore = minimax(depth - 1, true, alpha, beta);
      undoTemporaryMove(move, saved);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function findBestMove() {
  // Bot plays white, so it's maximizing
  const moves = getAllValidMoves('white');
  if (moves.length === 0) return null;

  let bestMove = null;
  let bestScore = -Infinity;
  const depth = 2;

  for (const move of moves) {
    const saved = makeTemporaryMove(move);
    const score = minimax(depth - 1, false, -Infinity, Infinity);
    undoTemporaryMove(move, saved);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
