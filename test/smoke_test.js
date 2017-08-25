// thaw-reversi-engine/test/smoke_test.js

'use strict';

const engine = require('..');

console.log('engine is', engine);

function smokeTest (boardString, player, maxPly) {

	try {
		console.log('smokeTest: boardString is', boardString);

		let result = engine.findBestMove(boardString, player, maxPly);

		console.log('engine.findBestMove() returned:', result);

		return result;
	} catch (error) {
		console.error('engine.findBestMove() threw an exception:', error);

		return null;
	}
}

let boardString = engine.createInitialBoard();
// let boardString = '                           XO      OX                           ';
let player = 'X';
let maxPly = 5;

smokeTest(boardString, player, maxPly);
