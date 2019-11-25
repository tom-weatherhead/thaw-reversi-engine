// thaw-reversi-engine/test/engine_spec.js

// Chai.js cheat sheet: See http://ricostacruz.com/cheatsheets/chai.html
// const chai = require('chai');

// Unit test specifications for Jest or Mocha

'use strict';

require('babel-mixin')({
	includeRegeneratorRuntime: true
});

const assert = require('assert').strict;

const engine = require('..');
// import * as engine from '../src/engine';

describe('App', () => {
	engine.testDescriptors.forEach(testDescriptor => {
		describe(testDescriptor.name, () => {
			it('Rocks!', done => {
				// Arrange
				const initialData = testDescriptor.arrangeFunction(engine);

				// Act
				const result = testDescriptor.actFunction(engine, initialData);

				// Assert
				// testDescriptor.assertFunction(engine, initialData, chai.expect, result);
				testDescriptor.assertFunction(engine, initialData, assert, result);
				done();
			});
		});
	});
});
