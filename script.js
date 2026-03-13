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
      if (this.board[row][col] && this.result.winner) return;

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
})();
