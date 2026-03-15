const Board = (() => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  function resetBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = '';
      }
    }
  }

  function getBoard() {
    return board;
  }

  return { getBoard, resetBoard };
})();

const Result = (() => {
  let result = {
    winner: null,
    roundText: null,
    winType: null,
  };

  function resetResult() {
    result = {
      winner: null,
      roundText: null,
      winType: null,
    };
  }

  function getResult() {
    return result;
  }

  return { getResult, resetResult };
})();

const Player = (() => {
  function createPlayer(type) {
    const player = {
      type,
      score: 0,
    };

    return player;
  }

  return { createPlayer };
})();

const GameController = (() => {
  const playerX = Player.createPlayer('X');
  const playerO = Player.createPlayer('O');
  const board = Board.getBoard();
  let currentPlayer = playerX;
  const result = Result.getResult();

  function isWinnerFound() {
    return result.winner !== null;
  }

  function toggleTurn() {
    currentPlayer = currentPlayer.type === 'X' ? playerO : playerX;
  }

  function updateWinnerResult(player, type) {
    result.winner = player;
    result.roundText = `${player.type} winner!`;
    result.winType = type;
  }

  function updateDrawResult() {
    result.winner = null;
    result.roundText = `It's a tie!`;
    result.winType = 'Tie';
  }

  function updateWinnerScore(player) {
    player.score++;
  }

  function isBoardFull() {
    return board.flat().every((col) => col !== '') && !isWinnerFound();
  }

  function makeMove(row, col) {
    if (board[row][col] || isWinnerFound()) return;

    board[row][col] = currentPlayer.type;
    const gameOver = checkWin(currentPlayer.type);

    if (!gameOver) toggleTurn();
  }

  function restartRound() {
    Board.resetBoard();
    Result.resetResult();
    currentPlayer = playerX;
  }

  function checkWin(move) {
    const isDiagonalWin =
      (board[0][0] === move && board[1][1] === move && board[2][2] === move) ||
      (board[0][2] === move && board[1][1] === move && board[2][0] === move);

    if (isDiagonalWin) {
      updateWinnerResult(currentPlayer, 'diagonal');
      updateWinnerScore(currentPlayer);
      return true;
    }

    for (let i = 0; i < 3; i++) {
      const isHorizontalWin = board[i].every((c) => c === move);
      const isVerticalWin =
        board[0][i] === move && board[1][i] === move && board[2][i] === move;

      if (isHorizontalWin) {
        updateWinnerResult(currentPlayer, 'horizontal');
        updateWinnerScore(currentPlayer);
        return true;
      }

      if (isVerticalWin) {
        updateWinnerResult(currentPlayer, 'vertical');
        updateWinnerScore(currentPlayer);
        return true;
      }
    }

    if (isBoardFull() && !isWinnerFound()) {
      updateDrawResult();
      return true;
    }

    return false;
  }

  return { makeMove, restartRound };
})();
