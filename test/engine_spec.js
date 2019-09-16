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

/* From CSharp/WPFTicTacToe :

#define USE_OPEN_LINES_HEURISTIC

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using Rhino.Mocks;
using WPFTicTacToe.GameEngine;
using GameEngine = WPFTicTacToe.GameEngine.GameEngine;

namespace WPFTicTacToe.GameEngine.Tests
{
    [TestFixture]
    public class GameEngineTests
    {
        private IGameWindow gameWindow;
#if USE_OPEN_LINES_HEURISTIC
        private const int victoryValue = 100;
#else
        private const int victoryValue = 1;
#endif

        [SetUp]
        public void SetupTest()
        {
            // See http://wrightthisblog.blogspot.ca/2011/03/using-rhinomocks-quick-guide-to.html
            gameWindow = MockRepository.GenerateMock<IGameWindow>();
        }

        [Test]
        public void EngineCreationTest()
        {
            // Arrange
            var boardDimension = 3;

            // Act
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            // Assert
            Assert.IsNotNull(gameEngine.board);
            Assert.AreEqual(boardDimension * boardDimension, gameEngine.board.Length);

            foreach (var squareContent in gameEngine.board)
            {
                Assert.AreEqual(SquareContentType.EmptySquare, squareContent);
            }

            Assert.AreEqual(0, gameEngine.boardPopulation);
            Assert.AreEqual(SquareContentType.X, gameEngine.currentPlayer);
        }

        [Test]
        public void VictoryTest1()
        {
            // X X .
            // . . .
            // O O .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 0, 0, false);
            gameEngine.PlacePiece(SquareContentType.O, 2, 0, false);
            gameEngine.PlacePiece(SquareContentType.X, 0, 1, false);
            gameEngine.PlacePiece(SquareContentType.O, 2, 1, false);

            // Act
            int bestRow;
            int bestColumn;
            var bestMoveList = new List<int>();
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.X, 3, true, bestMoveList, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(4, gameEngine.boardPopulation);
            Assert.AreEqual(victoryValue, bestMoveValue);
            Assert.AreEqual(2, bestMoveList.Count);
            Assert.IsTrue(bestMoveList.Contains(2));
            Assert.IsTrue(bestMoveList.Contains(8));
        }

        [Test]
        public void VictoryTest2()
        {
            // O . .
            // . O X
            // . X .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 1, 2, false);
            gameEngine.PlacePiece(SquareContentType.O, 1, 1, false);
            gameEngine.PlacePiece(SquareContentType.X, 2, 1, false);
            gameEngine.PlacePiece(SquareContentType.O, 0, 0, false);

            // Act
            int bestRow;
            int bestColumn;
            var bestMoveList = new List<int>();
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.X, 3, true, bestMoveList, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(4, gameEngine.boardPopulation);
            Assert.AreEqual(victoryValue, bestMoveValue);
            Assert.AreEqual(1, bestMoveList.Count);
            Assert.IsTrue(bestMoveList.Contains(8));
        }

        [Test]
        public void VictoryTest3()
        {
            // X . .
            // . . .
            // . O .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 0, 0, false);
            gameEngine.PlacePiece(SquareContentType.O, 2, 1, false);

            // Act
            int bestRow;
            int bestColumn;
            var bestMoveList = new List<int>();
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.X, 5, true, bestMoveList, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(2, gameEngine.boardPopulation);
            Assert.AreEqual(victoryValue, bestMoveValue);
            Assert.AreEqual(3, bestMoveList.Count);
            Assert.IsTrue(bestMoveList.Contains(2));
            Assert.IsTrue(bestMoveList.Contains(4));
            Assert.IsTrue(bestMoveList.Contains(6));
        }

        [Test]
        public void VictoryTest4()
        {
            // . X .    X X .    X X O    X X O
            // . . . -> . . . -> . . . -> . X .
            // O . .    O . .    O . .    O . .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 0, 1, false);
            gameEngine.PlacePiece(SquareContentType.O, 2, 0, false);

            // Act
            int bestRow;
            int bestColumn;
            var bestMoveList = new List<int>();
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.X, 5, true, bestMoveList, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(2, gameEngine.boardPopulation);
            Assert.AreEqual(victoryValue, bestMoveValue);
            Assert.AreEqual(1, bestMoveList.Count);
            Assert.IsTrue(bestMoveList.Contains(0));
        }

        [Test]
        public void VictoryTest5()
        {
            // X O .
            // . . .
            // . . .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 0, 0, false);
            gameEngine.PlacePiece(SquareContentType.O, 0, 1, false);

            // Act
            int bestRow;
            int bestColumn;
            var bestMoveList = new List<int>();
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.X, 5, true, bestMoveList, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(2, gameEngine.boardPopulation);
            Assert.AreEqual(victoryValue, bestMoveValue);
            Assert.AreEqual(3, bestMoveList.Count);
            Assert.IsTrue(bestMoveList.Contains(3));
            Assert.IsTrue(bestMoveList.Contains(4));
            Assert.IsTrue(bestMoveList.Contains(6));
        }

        [Test]
        public void NoVictoryTest1()
        {
            // O X .
            // . . .
            // . . .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 0, 1, false);
            gameEngine.PlacePiece(SquareContentType.O, 0, 0, false);

            // Act
            int bestRow;
            int bestColumn;
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.X, 5, false, null, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(2, gameEngine.boardPopulation);
            Assert.IsTrue(bestMoveValue > GameEngine.defeatValue);
            Assert.IsTrue(bestMoveValue < GameEngine.victoryValue);
        }

        [Test]
        public void VictoryTest6()
        {
            // O X .
            // . . X
            // . . .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 0, 1, false);
            gameEngine.PlacePiece(SquareContentType.O, 0, 0, false);
            gameEngine.PlacePiece(SquareContentType.X, 1, 2, false);

            // Act
            int bestRow;
            int bestColumn;
            var bestMoveList = new List<int>();
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.O, 5, true, bestMoveList, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(3, gameEngine.boardPopulation);
            Assert.AreEqual(victoryValue, bestMoveValue);
            Assert.AreEqual(1, bestMoveList.Count);
            Assert.IsTrue(bestMoveList.Contains(6));
        }

        [Test]
        public void NoVictoryTest2()
        {
            // O X .
            // . . .
            // . . .

            // Arrange
            var boardDimension = 3;
            var gameEngine = new GameEngine(gameWindow, boardDimension);

            gameEngine.PlacePiece(SquareContentType.X, 0, 1, false);
            gameEngine.PlacePiece(SquareContentType.O, 0, 0, false);

            // Act
            int bestRow;
            int bestColumn;
            var bestMoveList = new List<int>();
            int bestMoveValue = gameEngine.FindBestMove(SquareContentType.X, 6, true, bestMoveList, out bestRow, out bestColumn);

            // Assert
            Assert.AreEqual(2, gameEngine.boardPopulation);
            Assert.AreEqual(0, bestMoveValue);
            Assert.IsFalse(bestMoveList.Contains(5));    // This would be a losing move.
            Assert.IsFalse(bestMoveList.Contains(7));    // This would be a losing move.
        }

        [Test]
        public void BoardSerializationTest()
        {
            // Arrange
            var boardDimension = 3;
            var boardArea = boardDimension * boardDimension;
            var sb = new StringBuilder();
            var r = new Random();
            var boardPopulation = 0;

            for (int i = 0; i < boardArea; ++i)
            {
                char c;

                switch (r.Next(3))
                {
                    case 1:
                        c = 'X';
                        ++boardPopulation;
                        break;

                    case 2:
                        c = 'O';
                        ++boardPopulation;
                        break;

                    default:
                        c = ' ';
                        break;
                }

                sb.Append(c);
            }

            var inputBoardAsString = sb.ToString();

            // Act
            var gameEngine = new GameEngine(gameWindow, boardDimension, inputBoardAsString);
            var outputBoardAsString = gameEngine.GetBoardAsString();

            // Assert
            Assert.AreEqual(inputBoardAsString, outputBoardAsString);
            Assert.AreEqual(boardPopulation, gameEngine.boardPopulation);
        }
    }
}
 */
