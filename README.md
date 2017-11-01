# thaw-reversi-engine

[![build status](https://secure.travis-ci.org/tom-weatherhead/thaw-reversi-engine.svg)](http://travis-ci.org/tom-weatherhead/thaw-reversi-engine)  [![downloads](https://img.shields.io/npm/dt/thaw-reversi-engine.svg)](https://www.npmjs.com/package/thaw-reversi-engine)

A Node.js Reversi (Othello) game engine with alpha-beta pruning and a heuristic, packaged for npm.

Git installation instructions:

	$ git clone https://github.com/tom-weatherhead/thaw-reversi-engine.git
	$ cd thaw-reversi-engine
	$ npm install -g grunt
	$ npm install
	$ grunt

npm Installation Instructions:

	$ npm install [--save] thaw-reversi-engine

Note: The command "grunt" runs lint, unit tests, and security tests.

Sample usage of the npm package:

	let engine = require('thaw-reversi-engine');

	let boardString = engine.createInitialBoard();
	let player = 'X';
	let maxPly = 5;

	try {
		let result = engine.findBestMove(boardString, player, maxPly);

		console.log(result);
	} catch (error) {
		console.error('engine.findBestMove() threw an exception:', error);
	}

Output: E.g.

	{ bestRow: 4,
	  bestColumn: 2,
	  bestScore: 3,
	  bestMoves:
	   [ { row: 2, column: 4 },
		 { row: 3, column: 5 },
		 { row: 4, column: 2 },
		 { row: 5, column: 3 } ] }
