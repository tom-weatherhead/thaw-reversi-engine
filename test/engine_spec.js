// thaw-reversi-engine/test/engine_spec.js

// Chai.js cheat sheet: See http://ricostacruz.com/cheatsheets/chai.html
const chai = require('chai');

const engine = require('..');

describe('App', () => {
	engine.testDescriptors.forEach(testDescriptor => {
		describe(testDescriptor.name, () => {
			it('Rocks!', done => {
				// Arrange
				const initialData = testDescriptor.arrangeFunction(engine);

				// Act
				const result = testDescriptor.actFunction(engine, initialData);

				// Assert
				testDescriptor.assertFunction(engine, initialData, chai.expect, result);
				done();
			});
		});
	});
});
