import React, { useState } from 'react';
import './App.css';

function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onClick, winningSquares }) {
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        highlight={winningSquares.includes(i)}
      />
    );
  }

  const boardSize = 3;
  let board = [];
  for (let row = 0; row < boardSize; row++) {
    let boardRow = [];
    for (let col = 0; col < boardSize; col++) {
      boardRow.push(renderSquare(row * boardSize + col));
    }
    board.push(
      <div key={row} className="board-row">
        {boardRow}
      </div>
    );
  }

  return <div>{board}</div>;
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

function getLocation(index) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return { row, col };
}

function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAscending, setIsAscending] = useState(true);

  const current = history[stepNumber];
  const winnerInfo = calculateWinner(current.squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.line : [];

  function handleClick(i) {
    const historyUpToCurrentStep = history.slice(0, stepNumber + 1);
    const current = historyUpToCurrentStep[historyUpToCurrentStep.length - 1];
    const squares = current.squares.slice();
    if (winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(
      historyUpToCurrentStep.concat([
        { squares: squares, location: getLocation(i) },
      ])
    );
    setStepNumber(historyUpToCurrentStep.length);
    setXIsNext(!xIsNext);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} (${step.location.row}, ${step.location.col})`
      : 'Go to game start';
    return (
      <li key={move}>
        <button className="history" onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (stepNumber === 9) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={handleClick}
          winningSquares={winningSquares}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button onClick={toggleSortOrder}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;
