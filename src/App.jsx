import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Square from "./components/Square";

const defualtSquares = () => new Array(9).fill(null);
// * winning lines
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [squares, setSquares] = useState(defualtSquares());
  const [winner, setWinner] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [draw, setDraw] = useState(false);

  const resetGame = () => {
    setSquares(defualtSquares());
    setWinner(null);
    setGameComplete(false);
    if (draw) {
      setDraw(!draw);
    }
    console.log("game reset!");
  };

  useEffect(() => {
    // * only returns the array matching the given parameters(a,b,c)
    const lineThatAre = (a, b, c) => {
      return lines.filter((squareIndexes) => {
        //looping throw each array inside the matrix
        const squareValue = squareIndexes.map((index) => squares[index]);
        return JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValue.sort());
      });
    };
    const playerWon = lineThatAre("x", "x", "x").length > 0;
    const computerWon = lineThatAre("o", "o", "o").length > 0;

    if (playerWon) {
      setWinner("x");
      setGameComplete(true);
      return;
    }
    if (computerWon) {
      setWinner("o");
      setGameComplete(true);
      return;
    }
    // * checks for draw condition
    if (!squares.includes(null) && !winner) {
      setDraw(true);
      setWinner(null);
      return;
    }
    // * everytime the length is odd, it's computer's turn
    const isComputerTurn = squares.filter((square) => square !== null).length % 2 !== 0;
    // * map to get all the indexes with null value and then filter to get array of index
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);
    const putComputerAt = (index) => {
      let newSquares = squares;
      newSquares[index] = "o";
      setSquares([...newSquares]);
    };
    if (isComputerTurn) {
      // * checks if the computer has a chance of winning
      const winningLines = lineThatAre("o", "o", null);
      if (winningLines.length > 0) {
        const winIndex = winningLines[0].filter((index) => squares[index] === null)[0];
        putComputerAt(winIndex);
        return;
      }
      // * checks if the computer can block me from winning
      const linesToBlock = lineThatAre("x", "x", null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter((index) => squares[index] === null)[0];
        putComputerAt(blockIndex);
        return;
      }
      // * checks where to put after first move
      const linesToContinue = lineThatAre("o", null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(linesToContinue[0].filter((index) => squares[index] === null)[0]);
        return;
      }
      // * executed at start of the game after player had played
      const randomIndex = emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      putComputerAt(randomIndex);
    }
  }, [squares, winner]);

  const handleSquareClick = (index) => {
    //everytime the length is even , its is player's turn
    const isPlayerTurn = squares.filter((square) => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = "x";
      setSquares([...newSquares]);
    }
  };

  return (
    <div>
      <main>
        <h1>Tic Tac Toe</h1>
        <Board>
          {squares.map((square, index) => (
            <Square
              x={square === "x" ? 1 : 0}
              o={square === "o" ? 1 : 0}
              key={index}
              onClick={() => {
                if (squares[index] === null && !gameComplete) {
                  handleSquareClick(index);
                }
              }}
            />
          ))}
        </Board>
        {gameComplete && winner === "x" && (
          <div className="result win">
            You Won!
            <div>
              <button onClick={resetGame}>Play Again</button>
            </div>
          </div>
        )}
        {gameComplete && winner === "o" && (
          <div className="result lost">
            You Lost!{" "}
            <div>
              <button onClick={resetGame}>Try Again</button>
            </div>
          </div>
        )}
        {draw && (
          <div className="result draw">
            Draw{" "}
            <div>
              <button onClick={resetGame}>Try Again</button>
            </div>
          </div>
        )}
      </main>
      <footer>Made with ❤️ by Bishal</footer>
    </div>
  );
}

export default App;
