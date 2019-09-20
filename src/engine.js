// thaw-reversi-engine/src/engine.js

'use strict';

const boardWidth = 8;
const boardHeight = boardWidth;

const eightDirections = [
	{ dx: -1, dy: -1 },
	{ dx:  0, dy: -1 },			// eslint-disable-line key-spacing
	{ dx:  1, dy: -1 },			// eslint-disable-line key-spacing
	{ dx: -1, dy:  0 },			// eslint-disable-line key-spacing
	{ dx:  1, dy:  0 },			// eslint-disable-line key-spacing
	{ dx: -1, dy:  1 },			// eslint-disable-line key-spacing
	{ dx:  0, dy:  1 },			// eslint-disable-line key-spacing
	{ dx:  1, dy:  1 }			// eslint-disable-line key-spacing
];

const emptySquareToken = ' ';

function isDefined (arg) { // TODO: Import isDefined from thaw-common-utilities.js instead.
	return typeof arg !== 'undefined';
}

class Game {
	constructor (boardString) {
		this.boardWidth = boardWidth;
		this.boardHeight = boardHeight;
		this.boardArea = this.boardWidth * this.boardHeight;
		this.initialBestScore = -2 * this.boardArea;

		this.victoryScore = this.boardArea;
		// this.defeatScore = -this.boardArea;

		if (!boardString) {
			boardString = Game.initialBoardAsString;
		}

		if (typeof boardString !== 'string') {
			throw new Error('boardString is not a string.');
		} else if (boardString.length !== this.boardArea) {
			throw new Error(`The length of boardString is not ${this.boardArea}.`);
		}

		this.directions = eightDirections;
		this.emptySquareToken = emptySquareToken;

		this.players = {
			X: {
				piecePopulation: (boardString.match(/X/g) || []).length,
				token: 'X',
				opponentToken: 'O'
			},
			O: {
				piecePopulation: (boardString.match(/O/g) || []).length,
				token: 'O',
				opponentToken: 'X'
			},
			' ': {
				piecePopulation: (boardString.match(/ /g) || []).length
			}
		};

		// Split a string into an array of characters:
		// see https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript/34717402#34717402
		// this.boardArray = boardString.split('');
		this.boardArray = [...boardString];
		// this.boardArray = Array.from(boardString);

		// Note: the following lines construct a circular data structure.
		this.players.X.opponent = this.players.O;
		this.players.O.opponent = this.players.X;

		// this.noAutomatedMovePossible = 0;
	}

	getBoardAsString () {
		return this.boardArray.join('');
	}

	getOpponentToken (playerToken) {
		return playerToken === 'X' ? 'O' : 'X';
	}

	getSquareState (row, column) {

		if (row < 0 || row >= this.boardHeight || column < 0 || column >= this.boardWidth) {
			// throw new Error('getSquareState() : Coordinates are off the board.');

			return null;
		}

		return this.boardArray[row * this.boardWidth + column];
	}

	setSquareState (row, column, imageNumber) {

		if (row < 0 || row >= this.boardHeight || column < 0 || column >= this.boardWidth) {
			throw new Error('getSquareState() : Coordinates are off the board.');
		}

		this.boardArray[row * this.boardWidth + column] = imageNumber;
	}

	squareScore (row, column) {		// Calculate a useful heuristic.
		const cornerSquareScore = 8;
		const edgeSquareScore = 2;
		let nScore = 1;
		const isInEdgeColumn = column === 0 || column === this.boardWidth - 1;

		if (row === 0 || row === this.boardHeight - 1) {

			if (isInEdgeColumn) {
				nScore = cornerSquareScore;
			} else {
				nScore = edgeSquareScore;
			}
		} else if (isInEdgeColumn) {
			nScore = edgeSquareScore;
		}

		return nScore;
	}

	placePiece (player, row, column) {
		const returnObject = {
			score: 0,
			flippedPieces: []
		};

		if (row < 0 || row >= this.boardHeight || column < 0 || column >= this.boardWidth ||
			this.getSquareState(row, column) !== this.emptySquareToken) {

			return returnObject;
		}

		this.directions.forEach(direction => {
			// Pass 1: Scan.

			let canFlipInThisDirection = null;
			const undoBuffer = [];
			/*
			let squareState = this.getSquareState(row + direction.dy, column + direction.dx);

			for (let row2 = row + direction.dy, column2 = column + direction.dx;
				canFlipInThisDirection === null && row2 >= 0 && row2 < this.boardHeight && column2 >= 0 && column2 < this.boardWidth; // && squareState === opponentToken;
				row2 += direction.dy, column2 += direction.dx) {

				if (squareState === player) {
					canFlipInThisDirection = true;
				} else if (squareState === this.emptySquareToken) {
					canFlipInThisDirection = false;
				} else { // squareState === opponentToken
					undoBuffer.push({ row: row2, column: column2 });
				}

				squareState = this.getSquareState(row + direction.dy, column + direction.dx);
			}
			 */
			let row2 = row;
			let column2 = column;

			for (;;) {
				row2 += direction.dy;
				column2 += direction.dx;

				if (canFlipInThisDirection !== null || row2 < 0 || row2 >= this.boardHeight || column2 < 0 || column2 >= this.boardWidth) {
					break;
				}

				const squareState = this.getSquareState(row2, column2);

				if (squareState === player) {
					canFlipInThisDirection = true;
				} else if (squareState === this.emptySquareToken) {
					canFlipInThisDirection = false;
				} else { // squareState === opponentToken
					undoBuffer.push({ row: row2, column: column2 });
				}
			}

			if (canFlipInThisDirection) {
				// console.log('undoBuffer is', undoBuffer);
				returnObject.flippedPieces = returnObject.flippedPieces.concat(undoBuffer);
			}
		});

		// console.log('returnObject.flippedPieces is', returnObject.flippedPieces);

		returnObject.numPiecesFlipped = returnObject.flippedPieces.length;

		if (returnObject.numPiecesFlipped) {
			// Pass 2: Flip.

			returnObject.flippedPieces.forEach(coord => {
				this.setSquareState(coord.row, coord.column, player);
				returnObject.score += 2 * this.squareScore(coord.row, coord.column);
			});

			this.setSquareState(row, column, player);
			returnObject.score += this.squareScore(row, column);
			this.players[player].piecePopulation += returnObject.numPiecesFlipped + 1;
			this.players[player].opponent.piecePopulation -= returnObject.numPiecesFlipped;
		}
		// Else no opposing pieces were flipped, and the move fails.

		return returnObject;
	}

	findBestMove (
		player, nPly,
		nParentScore = 0, nBestUncleRecursiveScore) {	// nParentScore and nBestUncleRecursiveScore are for alpha-beta pruning.

		if (!isDefined(nBestUncleRecursiveScore)) {
			nBestUncleRecursiveScore = this.initialBestScore;
		}

		const returnObject = {
			bestRow: -1,
			bestColumn: -1,
			numberOfLegalMoves: 0
		};
		const opponent = this.players[player].opponent.token;
		let nBestScore = this.initialBestScore;
		let bestMoves = [];
		let doneSearching = false;

		for (let row = 0; row < this.boardHeight && !doneSearching; ++row) {

			for (let column = 0; column < this.boardWidth; ++column) {
				// let undoBuffer = [];	// Replace this with the declaration two lines below.
				const placePieceResult = this.placePiece(player, row, column);
				// let undoBuffer = placePieceResult.undoBuffer;
				// let nUndoSize = placePieceResult.numPiecesFlipped;
				const numPiecesFlipped = placePieceResult.flippedPieces.length;

				if (!numPiecesFlipped) {
					// Is the "continue" keyword "bad" in JavaScript?
					// See e.g. https://stackoverflow.com/questions/11728757/why-are-continue-statements-bad-in-javascript
					continue;			// eslint-disable-line no-continue
				}

				returnObject.numberOfLegalMoves++;

				let nScore = placePieceResult.score;

				// this.players[player].piecePopulation += numPiecesFlipped + 1;
				// this.players[player].opponent.piecePopulation -= numPiecesFlipped;

				if (this.players[player].opponent.piecePopulation === 0) {
					// The opposing player has been annihilated.
					nScore = this.victoryScore;
				} else if (nPly > 1 &&
					this.players.X.piecePopulation + this.players.O.piecePopulation < this.boardArea) {

					const childReturnObject = this.findBestMove(opponent, nPly - 1, nScore, nBestScore);

					nScore -= childReturnObject.bestScore;
				}

				this.setSquareState(row, column, this.emptySquareToken);
				this.players[player].piecePopulation -= numPiecesFlipped + 1;
				this.players[player].opponent.piecePopulation += numPiecesFlipped;

				placePieceResult.flippedPieces.forEach(squareCoordinates => {
					this.boardArray[squareCoordinates.row * this.boardWidth + squareCoordinates.column] = opponent;
				});

				if (nScore > nBestScore) {
					nBestScore = nScore;
					bestMoves = [];
					bestMoves.push({ row: row, column: column });

					if (nParentScore - nBestScore < nBestUncleRecursiveScore) {
						// *** Here is where the alpha-beta pruning happens ****
						// Because of the initial parameters for the top-level move, this break is never executed for the top-level move.
						doneSearching = true;
						break; // ie. return.
					}
				} else if (nScore === nBestScore) {
					bestMoves.push({ row: row, column: column });
				}
			}
		}

		// bestMoves.sort((move1, move2) => {

		// 	if (move1.row !== move2.row) {
		// 		return move1.row - move2.row;
		// 	} else {
		// 		return move1.column - move2.column;
		// 	}
		// });

		if (bestMoves.length) { // I.e. if (returnObject.numberOfLegalMoves === 0) {
			// TODO: Use Math.floor() instead of parseInt(), assuming 0 <= Math.random() < 1 :
			// const j = parseInt(Math.random() * bestMoves.length, 10);
			const j = Math.floor(Math.random() * bestMoves.length);

			/*
			const r = Math.random();
			const l = bestMoves.length;
			const rl = r * l;
			const rl1 = parseInt(rl, 10);
			const rl2 = Math.floor(rl);

			if (rl1 !== rl2) {
				console.error('Oh bugger 1: parseInt !== Math.floor');
				console.error('Math.random() is', typeof r, r);
				console.error('bestMoves is', typeof bestMoves, bestMoves);
				console.error('bestMoves.length is', typeof bestMoves.length, bestMoves.length);
				console.error('product is', typeof rl, rl);
				console.error('parseInt(product) is', typeof rl1, rl1);
				console.error('Math.floor(product) is', typeof rl2, rl2);
			}
			 */

			const selectedBestMove = bestMoves[j];

			if (!selectedBestMove) {
				console.error('Oh bugger 2: selectedBestMove is', typeof selectedBestMove, selectedBestMove);
				console.error('j is', typeof j, j);
				console.error('bestMoves is', typeof bestMoves, bestMoves);
				console.error('bestMoves.length is', typeof bestMoves.length, bestMoves.length);
				console.error('numberOfLegalMoves is', typeof returnObject.numberOfLegalMoves, returnObject.numberOfLegalMoves);
				console.error('nBestScore is', typeof nBestScore, nBestScore);
				console.error('initialBestScore is', typeof this.initialBestScore, this.initialBestScore);
				throw new Error('selectedBestMove is not.');
			}

			returnObject.bestRow = selectedBestMove.row;
			returnObject.bestColumn = selectedBestMove.column;
		} else {
			nBestScore = 0;
		}

		returnObject.bestScore = nBestScore;
		returnObject.bestMoves = bestMoves;

		return returnObject;
	}

	noLegalMovesForPlayer (player) {
		const result = this.findBestMove(player, 1);

		// return result.numberOfLegalMoves === 0;

		// Or: return result.bestRow < 0; // bestColumn would work as well as bestRow

		return result.bestRow < 0;
	}

	isGameDeadlocked () {
		return this.noLegalMovesForPlayer('X') && this.noLegalMovesForPlayer('O');
	}

	isGameNotOver () {
		return this.players.X.piecePopulation > 0 &&
			this.players.O.piecePopulation > 0 &&
			this.players.X.piecePopulation + this.players.O.piecePopulation < this.boardArea && //;
			// && this.noAutomatedMovePossible < 2;
			!this.isGameDeadlocked();
	}
}

Game.initialBoardAsString = '                           XO      OX                           ';

// TODO: Pass an optional 'descriptor = {}' parameter? See avoidwork's filesize.js

function findBestMove (boardString, player, maxPly) {
	const game = new Game(boardString); // Use a temporary game object?

	// return game.findBestMove(player, maxPly, 0, game.initialBestScore);

	return game.findBestMove(player, maxPly);
}

// BEGIN Version 0.2.0 API

function createInitialState (boardAsString, player) {
	boardAsString = boardAsString || Game.initialBoardAsString;

	const game = new Game(boardAsString);

	return {
		game: game,
		boardAsString: boardAsString,
		populations: {
			X: game.players.X.piecePopulation,
			O: game.players.O.piecePopulation
		},
		player: player === 'O' ? player : 'X',
		isGameOver: false
	};
}

function moveManually (gameState, row, column) {
	const resultOfPlacePiece = gameState.game.placePiece(gameState.player, row, column);

	return {
		game: gameState.game,
		boardAsString: gameState.game.getBoardAsString(),
		populations: {
			X: gameState.game.players.X.piecePopulation,
			O: gameState.game.players.O.piecePopulation
		},
		player: gameState.player === 'X' ? 'O' : 'X',
		isGameOver: !gameState.game.isGameNotOver(),
		numPiecesFlippedInLastMove: resultOfPlacePiece.numPiecesFlipped
	};
}

function moveAutomatically (gameState, maxPly) {
	const result = findBestMove(gameState.boardAsString, gameState.player, maxPly);

	result.gameState = moveManually(gameState, result.bestRow, result.bestColumn);

	return result;
}

// END Version 0.2.0 API

module.exports = {
	// minMaxPly: minMaxPly,
	// maxMaxPly: maxMaxPly,
	// victoryScore: victoryScore,
	// defeatScore: defeatScore,
	// errorMessages: errorMessages,
	// testDescriptors: testDescriptors,

	// Pre-0.2.0 API:
	// createInitialBoard: createInitialBoard,
	createInitialBoard: () => Game.initialBoardAsString,
	findBestMove: findBestMove,

	// Version 0.2.0 API:
	createInitialState: createInitialState,
	moveManually: moveManually,
	moveAutomatically: moveAutomatically
};

// **** End of File ****
