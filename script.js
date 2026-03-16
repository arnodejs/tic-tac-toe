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
      winRow: null,
    };
  }

  function getResult() {
    return result;
  }

  return { getResult, resetResult };
})();

const Player = (() => {
  function CreatePlayer(type) {
    this.type = type;
    this.score = 0;
    this.name = `Player ${this.type}`;

    return this;
  }

  CreatePlayer.prototype.updateName = function (value) {
    if (!value) return;

    this.name = value;
  };

  return { CreatePlayer };
})();

const GameController = (() => {
  const playerX = new Player.CreatePlayer('X');
  const playerO = new Player.CreatePlayer('O');
  let currentPlayer = playerX;

  function isWinnerFound() {
    return Result.getResult().winner !== null;
  }

  function toggleTurn() {
    currentPlayer = currentPlayer.type === 'X' ? playerO : playerX;
  }

  function updateWinnerResult(player, type, winIndex) {
    Result.getResult().winner = player;
    Result.getResult().roundText = `${player.name} winner!`;
    Result.getResult().winType = type;
    Result.getResult().winIndex = winIndex;
  }

  function updateDrawResult() {
    Result.getResult().winner = null;
    Result.getResult().roundText = `It's a tie!`;
    Result.getResult().winType = 'Tie';
  }

  function updateWinnerScore(player) {
    player.score++;
  }

  function isBoardFull() {
    return (
      Board.getBoard()
        .flat()
        .every((col) => col !== '') && !isWinnerFound()
    );
  }

  function makeMove(row, col) {
    if (Board.getBoard()[row][col] || isWinnerFound()) return;

    Board.getBoard()[row][col] = currentPlayer.type;
    const gameOver = checkWin(currentPlayer.type);

    if (!gameOver) toggleTurn();
  }

  function restartRound() {
    Board.resetBoard();
    Result.resetResult();
    currentPlayer = playerX;
  }

  function checkDiagonalWin(move) {
    const board = Board.getBoard();

    const diagonalDownLeft =
      board[0][0] === move && board[1][1] === move && board[2][2] === move;
    const diagonalUpRight =
      board[0][2] === move && board[1][1] === move && board[2][0] === move;
    const isDiagonalWin = diagonalDownLeft || diagonalUpRight;

    if (isDiagonalWin) {
      const diagonalWinType = diagonalDownLeft
        ? 'diagonal-down-left'
        : 'diagonal-up-right';
      updateWinnerResult(currentPlayer, diagonalWinType);
      updateWinnerScore(currentPlayer);

      return true;
    }

    return false;
  }

  function checkWin(move) {
    const board = Board.getBoard();

    if (checkDiagonalWin(move)) return true;

    for (let i = 0; i < 3; i++) {
      const isHorizontalWin = board[i].every((c) => c === move);
      const isVerticalWin =
        board[0][i] === move && board[1][i] === move && board[2][i] === move;

      if (isHorizontalWin) {
        updateWinnerResult(currentPlayer, 'horizontal', i);
        updateWinnerScore(currentPlayer);
        return true;
      }

      if (isVerticalWin) {
        updateWinnerResult(currentPlayer, 'vertical', i);
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

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getPlayerX() {
    return playerX;
  }

  function getPlayerO() {
    return playerO;
  }

  return {
    makeMove,
    restartRound,
    getCurrentPlayer,
    getPlayerX,
    getPlayerO,
  };
})();

// Display Controller

const DisplayController = (() => {
  const resultEl = document.querySelector('.result');
  const playerXScore = document.getElementById('score-x');
  const playerOScore = document.getElementById('score-o');
  const playerTurnEl = document.getElementById('player-turn');
  const boardBtns = document.querySelectorAll('.board-column');
  const newRoundBtn = document.getElementById('new-round');
  const playerXInput = document.getElementById('playerX');
  const playerOInput = document.getElementById('playerO');

  const playerX = GameController.getPlayerX();
  const playerO = GameController.getPlayerO();

  function renderBoard() {
    const board = Board.getBoard();

    boardBtns.forEach((boardBtn) => {
      const row = Number(boardBtn.dataset.row);
      const column = Number(boardBtn.dataset.col);

      boardBtn.textContent = board[row][column];
    });
  }

  function styleHorizontalVerticalCols(type, index) {
    const columns =
      type === 'vertical'
        ? document.querySelectorAll(`button[data-col='${index}'`)
        : document.querySelectorAll(`button[data-row='${index}'`);

    columns.forEach((col) => col.classList.add('win'));
  }

  function styleDiagonalsCols(type) {
    if (type === 'diagonal-down-left') {
      for (let i = 0; i < 3; i++) {
        document
          .querySelector(`button[data-row='${i}'][data-col='${i}']`)
          .classList.add('win');
      }
    } else {
      let col = 0;
      for (let row = 2; row >= 0; row--) {
        document
          .querySelector(`button[data-row='${row}'][data-col='${col}']`)
          .classList.add('win');
        col++;
      }
    }
  }

  function styleWin(type, index) {
    switch (type) {
      case 'horizontal':
        styleHorizontalVerticalCols(type, index);
        return;
      case 'vertical':
        styleHorizontalVerticalCols(type, index);
        return;

      case 'diagonal-down-left':
        styleDiagonalsCols(type);
        return;

      case 'diagonal-up-right':
        styleDiagonalsCols(type);
        return;

      default:
        return;
    }
  }

  function updateScoreDisplay() {
    playerXScore.textContent = playerX.score;
    playerOScore.textContent = playerO.score;
  }

  function updateFinishDisplay(text) {
    resultEl.textContent = text;
  }

  function gameInit() {
    boardBtns.forEach((boardBtn) => {
      boardBtn.addEventListener('click', (e) => {
        const row = Number(e.target.dataset.row);
        const column = Number(e.target.dataset.col);

        GameController.makeMove(row, column);
        const winType = Result.getResult().winType;

        if (winType !== null) {
          const winIndex = Result.getResult().winIndex;
          updateFinishDisplay(Result.getResult().roundText);
          updateScoreDisplay();
          styleWin(winType, winIndex);
        }

        const currentPlayer = GameController.getCurrentPlayer();
        updatePlayerTurnDisplay(currentPlayer);
        renderBoard();
      });
    });
    // Change players name
    playerXInput.addEventListener('input', (e) => {
      playerX.updateName(e.target.value);
    });
    playerOInput.addEventListener('input', (e) => {
      playerO.updateName(e.target.value);
    });

    newRoundBtn.addEventListener('click', handleRestart);
  }

  function handleRestart() {
    GameController.restartRound();
    renderBoard();
    updatePlayerTurnDisplay(GameController.getCurrentPlayer());
    resultEl.textContent = '';
    boardBtns.forEach((boardBtn) => boardBtn.classList.remove('win'));
  }

  function updatePlayerTurnDisplay(currentPlayer) {
    playerTurnEl.textContent = `${currentPlayer.type} turn`;
  }

  return { gameInit };
})();

DisplayController.gameInit();
