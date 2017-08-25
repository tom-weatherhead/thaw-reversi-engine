// thaw-reversi-engine/src/engine.js

// npm install --save-dev babel-cli babel-preset-env chai grunt grunt-cli grunt-contrib-watch grunt-eslint grunt-mocha-test grunt-nsp mocha

'use strict';

// const victoryScore = 100;
// const defeatScore = -victoryScore;

class Game {
	constructor (boardString, maxPly) {
		this.boardWidth = 8;
		this.boardHeight = 8;
		this.boardArea = this.boardWidth * this.boardHeight;
		this.initialBestScore = -2 * this.boardArea;

		this.victoryScore = this.boardArea;
		this.defeatScore = -this.boardArea;
		this.boardString = boardString;
		this.maxPly = maxPly;

		if (typeof this.boardString !== 'string') {
			throw new Error('boardString is not a string.');
		} else if (this.boardString.length !== this.boardArea) {
			throw new Error('The length of boardString is not ' + this.boardArea + '.');
		}

		this.nNumDirections = 8;
		this.adx = [-1, 0, 1, -1, 1, -1, 0, 1];			// adx.length == nNumDirections
		this.ady = [-1, -1, -1, 0, 0, 1, 1, 1];			// ady.length == nNumDirections

		this.EmptyNumber = ' ';
		this.emptySquareToken = ' ';

		this.PiecePopulations = [0, 0];
		this.players = {
			X: {
				piecePopulation: (this.boardString.match(/X/g) || []).length,
				token: 'X'
			},
			O: {
				piecePopulation: (this.boardString.match(/O/g) || []).length,
				token: 'O'
			},
			' ': {
				piecePopulation: (this.boardString.match(/ /g) || []).length
			}
		};

		this.boardArray = this.boardString.split('');

		// Note: the following lines construct a circular data structure.
		this.players.X.opponent = this.players.O;
		this.players.O.opponent = this.players.X;

		// this.noAutomatedMovePossible = 0;
	}

	getSquareState (row, column) {

		if (row < 0 || row >= this.boardHeight || column < 0 || column >= this.boardWidth) {
			throw new Error('getSquareState() : Coordinates are off the board.');
			// return this.EmptyNumber;
		}

		return this.boardArray[row * this.boardWidth + column];
	}

	setSquareState (row, column, imageNumber) {

		if (row < 0 || row >= this.boardHeight || column < 0 || column >= this.boardWidth) {
			throw new Error('getSquareState() : Coordinates are off the board.');
			// return;
		}

		this.boardArray[row * this.boardWidth + column] = imageNumber;
	}

	isGameNotOver () {
		return this.players.X.piecePopulation > 0 &&
			this.players.O.piecePopulation > 0 &&
			this.players.X.piecePopulation + this.players.O.piecePopulation < this.boardArea;
		// && this.noAutomatedMovePossible < 2;
	}

	squareScore (row, column) {		// Calculate a useful heuristic.
		var cornerSquareScore = 8;
		var edgeSquareScore = 2;
		var nScore = 1;
		var isInEdgeColumn = column === 0 || column === this.boardWidth - 1;

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

	placePiece (player, row, column, undoBuffer) {
		var returnObject = {
			numPiecesFlipped: 0,
			score: 0
		};
		var nUndoSize = 0;
		var nScore = 0;

		if (row < 0 || row >= this.boardHeight ||
			column < 0 || column >= this.boardWidth ||
			this.getSquareState(row, column) !== this.EmptyNumber) {
			// throw new Error('placePiece() : Coordinates are off the board.');
			return returnObject;	// It is necessary to return a value here rather than throwing an exception.
		}

		for (var i = 0; i < this.nNumDirections; ++i) {
			var bOwnPieceFound = false;
			var row2 = row;
			var column2 = column;
			var nSquaresToFlip = 0;

			// Pass 1: Scan and count.

			for (;;) {
				row2 += this.ady[i];
				column2 += this.adx[i];

				if (row2 < 0 || row2 >= this.boardHeight ||
					column2 < 0 || column2 >= this.boardWidth ||
					this.getSquareState(row2, column2) === this.EmptyNumber) {
					break;
				}

				if (this.getSquareState(row2, column2) === player) {
					bOwnPieceFound = true;
					break;
				}

				nSquaresToFlip++;
			}

			if (!bOwnPieceFound) {
				// Is the "continue" keyword "bad" in JavaScript?
				// See e.g. https://stackoverflow.com/questions/11728757/why-are-continue-statements-bad-in-javascript
				continue;			// eslint-disable-line no-continue
			}

			// Pass 2: Flip.
			row2 = row;
			column2 = column;

			for (var j = 0; j < nSquaresToFlip; ++j) {
				row2 += this.ady[i];
				column2 += this.adx[i];

				this.setSquareState(row2, column2, player);
				nScore += 2 * this.squareScore(row2, column2);

				if (undoBuffer !== null) {
					// Add (row2, column2) to the undo queue.
					undoBuffer.push({ row: row2, column: column2 });
				}

				nUndoSize++;
			}
		}

		if (nUndoSize > 0) {
			this.setSquareState(row, column, player);
			returnObject.numPiecesFlipped = nUndoSize;
			returnObject.score = nScore + this.squareScore(row, column);
		}
		// Else no opposing pieces were flipped, and the move fails.

		return returnObject;
	}

	findBestMove (
		player, nPly,
		nParentScore, nBestUncleRecursiveScore) {	// nParentScore and nBestUncleRecursiveScore are for alpha-beta pruning.

		var opponent = this.players[player].opponent.token;
		var nBestScore = this.initialBestScore;
		var bestMoves = [];
		var doneSearching = false;

		for (var row = 0; row < this.boardHeight && !doneSearching; ++row) {

			for (var column = 0; column < this.boardWidth; ++column) {
				var undoBuffer = [];	// Replace this with the declaration two lines below.
				var placePieceResult = this.placePiece(player, row, column, undoBuffer);
				// var undoBuffer = placePieceResult.undoBuffer;
				var nUndoSize = placePieceResult.numPiecesFlipped;

				if (nUndoSize <= 0) {
					continue;			// eslint-disable-line no-continue
				}

				//m_nMovesTried++;

				var nScore = placePieceResult.score;

				this.players[player].piecePopulation += nUndoSize + 1;
				this.players[player].opponent.piecePopulation -= nUndoSize;

				if (this.players[player].opponent.piecePopulation <= 0) {
					// The opposing player has been annihilated.
					nScore = this.victoryScore;
				} else if (nPly > 1 &&
					this.players.X.piecePopulation + this.players.O.piecePopulation < this.boardArea) {

					var childReturnObject = this.findBestMove(opponent, nPly - 1, nScore, nBestScore);

					nScore -= childReturnObject.bestScore;
				}

				this.setSquareState(row, column, this.EmptyNumber);
				this.players[player].piecePopulation -= nUndoSize + 1;
				this.players[player].opponent.piecePopulation += nUndoSize;

				for (var i = 0; i < undoBuffer.length; ++i) {	// forEach
					this.boardArray[undoBuffer[i].row * this.boardWidth + undoBuffer[i].column] = opponent;
				}

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

		var returnObject = {
			bestRow: -1,
			bestColumn: -1,
			bestScore: 0,
			bestMoves: bestMoves
		};

		if (bestMoves.length > 0) {
			var j = parseInt(Math.random() * bestMoves.length, 10);
			var selectedBestMove = bestMoves[j];

			returnObject.bestRow = selectedBestMove.row;
			returnObject.bestColumn = selectedBestMove.column;
		}

		returnObject.bestScore = nBestScore;

		return returnObject;
	}
}

// function WorkerParameters(nPlayer, nPly) {
//	this.aBoardImageNumbers = aBoardImageNumbers;
//	this.PiecePopulations = PiecePopulations;
//	this.nPlayer = nPlayer;
//	this.nPly = nPly;
// }

// function moveHelper(row, column) {
//	var placePieceResult = placePiece(NumberOfCurrentPlayer, row, column, null, true);
//    var nPlacePieceEffect = placePieceResult.numPiecesFlipped;
//
//    if (nPlacePieceEffect > 0) {
//        PiecePopulations[NumberOfCurrentPlayer] += nPlacePieceEffect + 1;
//        PiecePopulations[1 - NumberOfCurrentPlayer] -= nPlacePieceEffect;
//    }
//
//    if (nPlacePieceEffect == 0 && PlayerIsAutomated[NumberOfCurrentPlayer]) {
//        ++noAutomatedMovePossible;
//    } else {
//        noAutomatedMovePossible = 0;
//    }
//
//    NumberOfCurrentPlayer = 1 - NumberOfCurrentPlayer;
//    displayTurnMessage();
//
//    if (isGameNotOver() && PlayerIsAutomated[NumberOfCurrentPlayer]) {
//        setTimeout("automatedMove()", 100);     // Wait for 100 ms before the next move to give the browser time to update the board.
//    }
// }

function createInitialBoard () {
	return '                           XO      OX                           ';
}

// TODO: Pass an optional 'descriptor = {}' parameter? See avoidwork's filesize.js

function findBestMove (boardString, player, maxPly) {
	let game = new Game(boardString, maxPly);

	// The third parameter helps to initialize the alpha-beta pruning.
	return game.findBestMove(player, game.maxPly, 0, game.initialBestScore);
}

module.exports = {
	// victoryScore: victoryScore,
	// defeatScore: defeatScore,
	createInitialBoard: createInitialBoard,
	findBestMove: findBestMove
};

// **** End of File ****
