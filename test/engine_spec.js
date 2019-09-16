// thaw-reversi-engine/test/engine_spec.js

// Chai.js cheat sheet: See http://ricostacruz.com/cheatsheets/chai.html
const chai = require('chai');
const expect = chai.expect;

const engine = require('..');

describe('App', () => {
	describe('SmokeTest00FirstMove', () => {
		it('Rocks!', done => {
			// Arrange
			// . . . . . . . .
			// . . . . . . . .
			// . . . . . . . .
			// . . . X O . . .
			// . . . O X . . .
			// . . . . . . . .
			// . . . . . . . .
			// . . . . . . . .
			const gameState = engine.createInitialState();
			const maxPly = 5;

			// Act
			const result = engine.moveAutomatically(gameState, maxPly);

			// Assert

			// Chai.js has a flexible, fluent syntax for "expect" :
			// expect(result).not.null;			// eslint-disable-line no-unused-expressions
			// expect(result).to.not.be.null;	// eslint-disable-line no-unused-expressions
			expect(result).to.be.not.null;		// eslint-disable-line no-unused-expressions

			expect(result.bestScore).to.equal(3);
			expect(result.bestMoves).to.be.deep.equal([
				{ row: 2, column: 4 },
				{ row: 3, column: 5 },
				{ row: 4, column: 2 },
				{ row: 5, column: 3 }
			]);

			done();
		});
	});

	describe('UndoTest', () => {
		it('Rocks!', done => {
			// Arrange
			const gameState = engine.createInitialState();
			const maxPly = 5;
			const expectedBoardAsString = gameState.game.getBoardAsString();

			// Act
			const result = gameState.game.findBestMove(gameState.player, maxPly, 0, gameState.game.initialBestScore);
			const actualBoardAsString = gameState.game.getBoardAsString();

			// Assert
			expect(result).to.be.not.null;		// eslint-disable-line no-unused-expressions
			expect(actualBoardAsString).to.equal(expectedBoardAsString);

			done();
		});
	});
});
