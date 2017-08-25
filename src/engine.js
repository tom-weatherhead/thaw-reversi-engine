// thaw-reversi-engine/src/engine.js

// npm install --save-dev babel-cli babel-preset-env chai grunt grunt-cli grunt-contrib-watch grunt-eslint grunt-mocha-test grunt-nsp mocha

'use strict';

// const victoryScore = 100;
// const defeatScore = -victoryScore;

class Game {
	constructor (boardString, maxPly) {
		this.nBoardWidth = 8;
		this.nBoardHeight = 8;
		this.nBoardArea = this.nBoardWidth * this.nBoardHeight;
		this.boardString = boardString;
		console.log('this.boardString is', this.boardString);

		if (typeof this.boardString !== 'string') {
			throw new Error('boardString is not a string.');
		// } else if (this.boardString.length !== this.boardArea) {
			// throw new Error('The length of boardString is not ' + this.boardArea + '.');
		}

		this.nNumDirections = 8;
		this.adx = [-1, 0, 1, -1, 1, -1, 0, 1];          // adx.length == nNumDirections
		this.ady = [-1, -1, -1, 0, 0, 1, 1, 1];          // ady.length == nNumDirections

		// this.aBoardImageNumbers = null;  // new Array(nBoardArea);

		// this.EmptyNumber = -1;
		this.EmptyNumber =  ' ';

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
		this.players['X'].opponent = this.players['O'];
		this.players['O'].opponent = this.players['X'];
		
		this.noAutomatedMovePossible = 0;	// Is this correct?
	}

	getSquareState(row, col) {

		if (row < 0 || row >= this.nBoardHeight || col < 0 || col >= this.nBoardWidth) {
			// TODO? : throw new Error('getSquareState() : Coordinates are off the board.');
			return this.EmptyNumber;
		}

		return this.boardArray[row * this.nBoardWidth + col];
	}

	setSquareState(row, col, imageNumber) {

		if (row < 0 || row >= this.nBoardHeight || col < 0 || col >= this.nBoardWidth) {
			// TODO? : throw new Error('getSquareState() : Coordinates are off the board.');
			return;
		}

		this.boardArray[row * this.nBoardWidth + col] = imageNumber;
	}

	isGameNotOver() {
		// return this.PiecePopulations[0] > 0 &&
			// this.PiecePopulations[1] > 0 &&
			// this.PiecePopulations[0] + this.PiecePopulations[1] < this.nBoardArea &&
			// this.noAutomatedMovePossible < 2;
		return this.players['X'].piecePopulation > 0 &&
			this.players['O'].piecePopulation > 0 &&
			this.players['X'].piecePopulation + this.players['O'].piecePopulation < this.nBoardArea &&
			this.noAutomatedMovePossible < 2;
	}

	squareScore(nRow, nCol) {
		var cornerSquareScore = 8;
		var edgeSquareScore = 2;
		var nScore = 1;
		var isInEdgeColumn = nCol == 0 || nCol == this.nBoardWidth - 1;

		if (nRow == 0 || nRow == this.nBoardHeight - 1) {

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

	// function PlacePieceData() {
		// this.numPiecesFlipped = 0;
		// this.score = 0;
	// }

	placePiece(player, nRow, nCol, undoBuffer) {
		// var returnObject = new PlacePieceData();
		var returnObject = {
			numPiecesFlipped: 0,
			score: 0
		};
		var nUndoSize = 0;
		var nScore = 0;

		if (nRow < 0 || nRow >= this.nBoardHeight ||
			nCol < 0 || nCol >= this.nBoardWidth ||
			this.getSquareState(nRow, nCol) != this.EmptyNumber) {
			//alert("(row, col) == (" + nRow + ", " + nCol + ") is invalid.");
			return returnObject;
		}

		for (var i = 0; i < this.nNumDirections; ++i) {
			var bOwnPieceFound = false;
			var nRow2 = nRow;
			var nCol2 = nCol;
			var nSquaresToFlip = 0;

			// Pass 1: Scan and count.

			for (; ; ) {
				nRow2 += this.ady[i];
				nCol2 += this.adx[i];

				if (nRow2 < 0 || nRow2 >= this.nBoardHeight ||
					nCol2 < 0 || nCol2 >= this.nBoardWidth ||
					this.getSquareState(nRow2, nCol2) == this.EmptyNumber) {
					break;
				}

				if (this.getSquareState(nRow2, nCol2) == player) {
					bOwnPieceFound = true;
					break;
				}

				nSquaresToFlip++;
			}

			if (!bOwnPieceFound) {
				continue;
			}

			// Pass 2: Flip.
			nRow2 = nRow;
			nCol2 = nCol;

			for (var j = 0; j < nSquaresToFlip; ++j) {
				nRow2 += this.ady[i];
				nCol2 += this.adx[i];

				this.setSquareState(nRow2, nCol2, player);
				nScore += 2 * this.squareScore(nRow2, nCol2);

				if (undoBuffer != null) {
					// Add (nRow2, nCol2) to the undo queue.
					undoBuffer.push(nRow2 * this.nBoardWidth + nCol2);
				}

				nUndoSize++;
			}
		}

		if (nUndoSize > 0) {
			this.setSquareState(nRow, nCol, player);
			returnObject.numPiecesFlipped = nUndoSize;
			returnObject.score = nScore + this.squareScore(nRow, nCol);
		}
		// Else no opposing pieces were flipped, and the move fails.

		return returnObject;
	}

	// function BestMoveData() {
		// this.bestRow = -1;
		// this.bestCol = -1;
		// this.bestScore = 0;
	// }

	findBestMove(
		player, nPly,
		nParentScore, nBestUncleRecursiveScore	// For alpha-beta pruning.
		) {

		var opponent = this.players[player].opponent.token;
		var nBestScore = -2 * this.nBoardArea;
		var bestMoveIndices = [];

		for (var nSquare = 0; nSquare < this.nBoardArea; ++nSquare) {
			var undoBuffer = [];

			var nRow = parseInt(nSquare / this.nBoardWidth, 10);
			var nCol = nSquare % this.nBoardWidth;
			var placePieceResult = this.placePiece(player, nRow, nCol, undoBuffer);
			var nUndoSize = placePieceResult.numPiecesFlipped;

			//alert("(" + nRow + "," + nCol + "): undo size == " + nUndoSize + "; score == " + placePieceResult.score);

			if (nUndoSize <= 0) {
				continue;
			}

			//m_nMovesTried++;

			var nScore = placePieceResult.score;

			// this.PiecePopulations[nPlayer] += nUndoSize + 1;
			// this.PiecePopulations[1 - nPlayer] -= nUndoSize;
			this.players[player].piecePopulation += nUndoSize + 1;
			this.players[player].opponent.piecePopulation -= nUndoSize;

			// if (this.PiecePopulations[1 - nPlayer] <= 0) {
			if (this.players[player].opponent.piecePopulation <= 0) {
				// The opposing player has been annihilated.
				nScore = this.nBoardArea; // I.e. victoryScore;
			} else if (nPly > 1 &&
				// this.PiecePopulations[0] + this.PiecePopulations[1] < this.nBoardArea) {
				this.players['X'].piecePopulation + this.players['O'].piecePopulation < this.nBoardArea) {

				// var childReturnObject = this.bestMove(1 - nPlayer, nPly - 1, nScore, nBestScore);
				var childReturnObject = this.findBestMove(opponent, nPly - 1, nScore, nBestScore);

				nScore -= childReturnObject.bestScore;
			}

			this.setSquareState(nRow, nCol, this.EmptyNumber);
			// this.PiecePopulations[nPlayer] -= nUndoSize + 1;
			// this.PiecePopulations[1 - nPlayer] += nUndoSize;
			this.players[player].piecePopulation -= nUndoSize + 1;
			this.players[player].opponent.piecePopulation += nUndoSize;

			for (var i = 0; i < undoBuffer.length; ++i) {
				// this.aBoardImageNumbers[undoBuffer[i]] = 1 - nPlayer;
				this.boardArray[undoBuffer[i]] = opponent;
			}

			if (nScore > nBestScore) {
				nBestScore = nScore;
				bestMoveIndices = [];
				bestMoveIndices.push(nSquare);

				if (nParentScore - nBestScore < nBestUncleRecursiveScore) {
					// Alpha-beta pruning.  Because of the initial parameters for the top-level move, this break is never executed for the top-level move.
					break; // ie. return.
				}
			} else if (nScore == nBestScore) {
				bestMoveIndices.push(nSquare);
			}
		}

		// var returnObject = new BestMoveData();
		var returnObject = {
			bestRow: -1,
			bestCol: -1,
			bestScore: 0
		};

		if (bestMoveIndices.length > 0) {
			var i = parseInt(Math.random() * bestMoveIndices.length, 10);
			var nBestIndex = bestMoveIndices[i];

			returnObject.bestRow = parseInt(nBestIndex / this.nBoardWidth, 10);
			returnObject.bestCol = nBestIndex % this.nBoardWidth;
		}

		returnObject.bestScore = nBestScore;
		return returnObject;
	}
}

// function WorkerParameters(nPlayer, nPly) {
    // this.aBoardImageNumbers = aBoardImageNumbers;
    // this.PiecePopulations = PiecePopulations;
    // this.nPlayer = nPlayer;
    // this.nPly = nPly;
// }

function createInitialBoard() {
	// const emptyRow = '        ';
	// return
		// emptyRow + 					// Row 0
		// emptyRow + 					// Row 1
		// emptyRow + 					// Row 2
		// '   XO   ' +				// Row 3
		// '   OX   ' +				// Row 4
		// emptyRow + 					// Row 5
		// emptyRow + 					// Row 6
		// emptyRow; 					// Row 7
	return '                           XO      OX                           ';
}

function findBestMove (boardString, player, maxPly) {
	let game = new Game(boardString, maxPly);

	// The third parameter helps to initialize the alpha-beta pruning.
	return game.findBestMove(player, game.maxPly, 0, -2 * game.nBoardArea);
}

module.exports = {
	// victoryScore: victoryScore,
	// defeatScore: defeatScore,
	createInitialBoard: createInitialBoard,
	findBestMove: findBestMove
};

// **** End of File ****
