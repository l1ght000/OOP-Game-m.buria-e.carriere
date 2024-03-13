import { createApp } from 'vue';

const app = createApp({
  data() {
      return {
          board: [
              ['', '', ''],
              ['', '', ''],
              ['', '', '']
          ],
          currentPlayer: 'X',
          isGameOver: false
      };
  },
  computed: {
      statusMessage() {
          if (this.isGameOver) {
              const winner = this.getWinner();
              if (winner === 'X') {
                  return "YOU WERE INCREDIBLE!";
              } else if (winner === 'O') {
                  return "Play again?";
              } else if (this.isBoardFull()) {
                  return "It's a tie!";
              }
          }
      }
  },
    methods: {
      
        handleCellClick(rowIndex, cellIndex) {
			//if the cell is already taken, or the game is over, ignore the click
			if (this.board[rowIndex][cellIndex] !== '' || this.isGameOver) {
			  return;
			}
		  
			//user move
			this.board[rowIndex][cellIndex] = this.currentPlayer;
		  
			//animation
			this.$nextTick(() => {
			  const cell = this.$refs[`cell-${rowIndex}-${cellIndex}`][0];
			  const sign = cell.querySelector('.cross, .circle'); //select classes from html for our x and o
			  if (sign) {
				gsap.fromTo(sign, { scale: 0 }, { scale: 1, duration: 0.5 });
			  }
			});
		  
			if (this.checkGameOver()) return;
		  
			//ai turn with delay
			setTimeout(() => {
			  this.aiMove();
			}, 400); //delay time
		  },
		  
		  aiMove() {
			let move = this.findWinningMove('O'); //try to find way to win user
			if (!move) {
			  move = this.findWinningMove('X'); //try to find way to block user 
			}
			if (!move) {
			  move = this.getRandomMove(); //random move
			}
		  
			if (move) {
			  this.board[move.row][move.col] = 'O';
		  
			  //animation
			  this.$nextTick(() => {
				const cell = this.$refs[`cell-${move.row}-${move.col}`][0];
				const sign = cell.querySelector('.circle'); //select class for our 'o' sign
				if (sign) {
				  gsap.fromTo(sign, { scale: 0 }, { scale: 1, duration: 0.5 });
				}
			  });
			}
		  
			this.checkGameOver();
			this.currentPlayer = 'X'; //come back to user who start the game
		  },
		  
        findWinningMove(player) {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[i][j] === '') {
                        //try a move
                        this.board[i][j] = player;
                        if (this.getWinner() === player) {
                            this.board[i][j] = ''; // undo the move
                            return { row: i, col: j };
                        }
                        this.board[i][j] = '';
                    }
                }
            }
            return null;
        },
        getRandomMove() {
            const availableMoves = this.board
                .flatMap((row, rowIndex) => row.map((cell, cellIndex) => ({ rowIndex, cellIndex, value: cell })))
                .filter(cell => cell.value === '')
                .map(cell => ({ row: cell.rowIndex, col: cell.cellIndex }));

            if (availableMoves.length === 0) {
                return null;
            }

            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        },
        checkGameOver() {
            //check for winner
            const winner = this.getWinner();
            if (winner) {
                this.isGameOver = true;
                return true;
            }

            //check if noone won the game
            if (this.isBoardFull()) {
                this.isGameOver = true;
                return true;
            }

            return false;
        },
        getWinner() {
             //all wining combo
             const lines = [
              //row
              [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
              //column
              [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
              //diagonal
              [[0, 0], [1, 1], [2, 2]], [[2, 0], [1, 1], [0, 2]],
          ];

          for (const line of lines) {
              const [[a, b], [c, d], [e, f]] = line;
              if (this.board[a][b] && this.board[a][b] === this.board[c][d] && this.board[a][b] === this.board[e][f]) {
                  return this.board[a][b];
              }
          }

          return null;
        },
        isBoardFull() {
            return this.board.every(row => row.every(cell => cell !== ''));
        },
        startNewGame() {
            this.board = [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ];
            this.currentPlayer = 'X';
            this.isGameOver = false;
        }
        
    }
}).mount('#app');
