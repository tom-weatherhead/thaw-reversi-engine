# thaw-reversi-engine
A Node.js Reversi (Othello) game engine with alpha-beta pruning and a heuristic, packaged for npm.

[![Build Status](https://secure.travis-ci.org/tom-weatherhead/thaw-reversi-engine.svg)](https://travis-ci.org/tom-weatherhead/thaw-reversi-engine)
[![npm](https://img.shields.io/npm/v/thaw-reversi-engine.svg)](https://www.npmjs.com/package/thaw-reversi-engine)
[![npm](https://img.shields.io/npm/dm/thaw-reversi-engine.svg)](https://www.npmjs.com/package/thaw-reversi-engine)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tom-weatherhead/thaw-reversi-engine/blob/master/LICENSE)
[![Maintainability](https://api.codeclimate.com/v1/badges/547c20d9044f10b69c44/maintainability)](https://codeclimate.com/github/tom-weatherhead/thaw-reversi-engine/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/tom-weatherhead/thaw-reversi-engine/badge.svg?targetFile=package.json&package-lock.json)](https://snyk.io/test/github/tom-weatherhead/thaw-reversi-engine?targetFile=package.json&package-lock.json)

### Git Installation Instructions

```
git clone https://github.com/tom-weatherhead/thaw-reversi-engine.git
cd thaw-reversi-engine
npm install -g grunt
npm install
grunt
```

### npm Installation Instructions

```
npm install [--save] thaw-reversi-engine
```

Note: The command "grunt" runs lint and unit tests.

### Sample Usage of the npm Package

```js
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
```
Output: E.g.

```js
{
	bestRow: 4,
	bestColumn: 2,
	bestScore: 3,
	bestMoves: [
		{ row: 2, column: 4 },
		{ row: 3, column: 5 },
		{ row: 4, column: 2 },
		{ row: 5, column: 3 }
	]
}
```

## License
MIT
