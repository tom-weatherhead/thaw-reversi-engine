// thaw-reversi-engine/test/engine_spec.js

// Chai.js cheat sheet: See http://ricostacruz.com/cheatsheets/chai.html
const chai = require('chai');
const expect = chai.expect;

const engine = require('..');

describe('App', function () {
	describe('SmokeTest00FirstMove', function () {
		it('Rocks!', function (done) {
			// Arrange
			// . . .
			// . . .
			// . . .
			const boardString = engine.createInitialBoard();
			const player = 'X';
			const maxPly = 5;

			// Act
			let result = engine.findBestMove(boardString, player, maxPly);

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
});
