// thaw-reversi-engine/src/engine.js

'use strict';

const defaultPlayer = 'X';
const defaultMaxPly = 5;

// function getURLFriendlyBoardStringFromGameState (gameState) {
// 	return gameState.game.getBoardAsString().replace(/ /g, 'E');
// }

module.exports = [
	{
		name: 'FirstMoveTest',
		// . . . . . . . .
		// . . . . . . . .
		// . . . . . . . .
		// . . . X O . . .
		// . . . O X . . .
		// . . . . . . . .
		// . . . . . . . .
		// . . . . . . . .
		arrangeFunction: engine => {
			const gameState = engine.createInitialState();

			return {
				gameState: gameState,
				player: defaultPlayer,
				maxPly: defaultMaxPly,
				boardAsString: engine.getURLFriendlyBoardStringFromGameState(gameState)
			};
		},
		actFunction: (engine, initialData) => {
			return engine.moveAutomatically(initialData.gameState, initialData.maxPly);
		},
		assertFunction: (engine, initialData, assert, result) => {
			// expect(result.bestScore).to.satisfy(bestScore => bestScore < engine.victoryScore);
			// expect(result.bestScore).to.satisfy(bestScore => bestScore > engine.defeatScore);
			// console.log('SmokeTest00Bogus result:', result);

			// expect(result).is.not.null;	// eslint-disable-line no-unused-expressions
			// expect(result.bestRow).is.not.null;	// eslint-disable-line no-unused-expressions
			// expect(result.bestColumn).is.not.null;	// eslint-disable-line no-unused-expressions
			assert.ok(result);
			assert.ok(result.bestRow);
			assert.ok(result.bestColumn);

			// expect(result.bestScore).to.equal(3);
			assert.equal(result.bestScore, 3);

			// expect(result.bestMoves).to.be.deep.equal([
			// 	{ row: 2, column: 4 },
			// 	{ row: 3, column: 5 },
			// 	{ row: 4, column: 2 },
			// 	{ row: 5, column: 3 }
			// ]);
			assert.deepEqual(result.bestMoves, [
				{ row: 2, column: 4 },
				{ row: 3, column: 5 },
				{ row: 4, column: 2 },
				{ row: 5, column: 3 }
			]);
		}
	},
	{
		name: 'UndoTest',
		doNotTestThroughWebService: true,
		arrangeFunction: engine => {
			const gameState = engine.createInitialState();

			return {
				gameState: gameState,
				player: defaultPlayer,
				maxPly: defaultMaxPly,
				boardAsString: engine.getURLFriendlyBoardStringFromGameState(gameState)
			};
		},
		actFunction: (engine, initialData) => {
			return initialData.gameState.game.findBestMove(initialData.gameState.player, initialData.maxPly);
		},
		assertFunction: (engine, initialData, assert, result) => {
			const actualBoardAsString = engine.getURLFriendlyBoardStringFromGameState(initialData.gameState);

			// expect(result).to.be.not.null;		// eslint-disable-line no-unused-expressions
			assert.ok(result); // This asserts that the value of 'result' is truthy.

			// expect(actualBoardAsString).to.equal(initialData.boardAsString);
			assert.equal(actualBoardAsString, initialData.boardAsString);
		}
	}
];
