const GameController = (() => {
  const gameState = {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    result: {
      winner: null,
      winType: null,
      text: null,
      winIndex: null,
      isRunning: true,
    },

    playerX: {
      type: 'X',
      score: 0,
      turn: true,
    },
    player0: {
      type: '0',
      score: 0,
      turn: false,
    },

    restartRound() {
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];

      this.result = {
        winner: null,
        winType: null,
        text: null,
        winIndex: null,
        isRunning: true,
      };
      this.playerX.turn = true;
      this.player0.turn = false;
    },

    toggleTurn() {
      if (this.playerX.turn) {
        this.playerX.turn = false;
        this.player0.turn = true;
      } else {
        this.playerX.turn = true;
        this.player0.turn = false;
      }
    },

    get turnPlayer() {
      if (this.playerX.turn) {
        return this.playerX;
      } else {
        return this.player0;
      }
    },

    updateWinType(type, i = 0) {
      this.result.winIndex = i;
      this.result.winType = type;
    },

    makeMove(row, col) {
      if (this.board[row][col] || this.result.winner) return;

      const turnPlayer = this.turnPlayer;

      this.board[row][col] = turnPlayer.type;
      this.checkWin(turnPlayer);
      this.toggleTurn();
    },

    updateResult(player, hasWinner) {
      if (hasWinner) {
        player.score += 1;
        this.result.winner = player;
        this.result.text = `${player.type} winner!`;
        console.log(this.result);
      } else {
        this.result.text = `Draw!`;
      }

      this.result.isRunning = false;
    },

    checkWin(player) {
      for (let i = 0; i < 3; i++) {
        const horizontal = this.board[i].every((c) => c === player.type);

        const vertical =
          this.board[0][i] === player.type &&
          this.board[1][i] === player.type &&
          this.board[2][i] === player.type;

        const diagonalOne =
          this.board[0][0] === player.type &&
          this.board[1][1] === player.type &&
          this.board[2][2] === player.type;

        const diagonalTwo =
          this.board[0][2] === player.type &&
          this.board[1][1] === player.type &&
          this.board[2][0] === player.type;

        const hasWinner = vertical || horizontal || diagonalOne || diagonalTwo;

        if (hasWinner) {
          if (vertical) this.updateWinType('vertical', i);
          if (horizontal) this.updateWinType('horizontal', i);
          if (diagonalOne) this.updateWinType('diagonal-left');
          if (diagonalTwo) this.updateWinType('diagonal-right');

          this.updateResult(player, hasWinner);
          break;
        }

        // Draw
        if (this.board.flat().every((col) => col !== '') && !hasWinner) {
          this.updateResult();
          break;
        }
      }
    },
  };

  return gameState;
})();

const UIController = (() => {
  const boardEl = document.querySelector('.board');
  const playerXEl = document.querySelector('.player-x');
  const player0El = document.querySelector('.player-0');
  const playerXScoreEl = playerXEl.querySelector('.score-x');
  const player0ScoreEl = player0El.querySelector('.score-0');
  const resultTextEl = document.querySelector('.result-text');
  const newGameBtn = document.querySelector('.new-game-btn');

  function gameInit() {
    newGameBtn.addEventListener('click', handleRestartRound);
    newGameBtn.classList.add('hidden');
    playerXEl.classList.add('turn');
  }

  const gameState = GameController;
  boardEl.addEventListener('click', handleCellClick);

  function handleRestartRound() {
    console.log('e');
    gameState.restartRound();
    newGameBtn.classList.add('hidden');
    boardEl
      .querySelectorAll('[data-column]')
      .forEach((col) => (col.textContent = ''));
    resultTextEl.textContent = '';
    playerXEl.classList.add('turn');
    player0El.classList.remove('turn');
  }

  function handleCellClick(e) {
    if (!e.target.dataset.column) return;

    const row = Number(e.target.closest('.row').dataset.row);
    const col = Number(e.target.dataset.column);

    if (!gameState.result.isRunning) return;

    gameState.makeMove(row, col);

    updateDisplay(row, col);
  }

  function handleTurnPlayer() {
    if (gameState.turnPlayer.type === 'X') {
      playerXEl.classList.add('turn');
      player0El.classList.remove('turn');
    } else {
      playerXEl.classList.remove('turn');
      player0El.classList.add('turn');
    }
  }

  function updateFinishGameDisplay() {
    if (!gameState.result.isRunning) {
      resultTextEl.textContent = gameState.result.text;
      newGameBtn.classList.toggle('hidden');
      playerXScoreEl.textContent = gameState.playerX.score;
      player0ScoreEl.textContent = gameState.player0.score;
    }
  }

  function updateDisplay(row, col) {
    const text = gameState.board[row][col];
    boardEl.querySelector(
      `.row[data-row='${row}'] button[data-column='${col}']`
    ).textContent = text;

    updateFinishGameDisplay();
    handleTurnPlayer();
  }

  return gameInit;
})();

UIController();
