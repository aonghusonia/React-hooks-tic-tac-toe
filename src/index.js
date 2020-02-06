import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import calculateWinner from './calculate-winner';

const getStatus = (squares, xIsNext, winner) =>
  winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Draw`
    : `Next Player; ${xIsNext ? 'X' : 'O'}`;

const replaceAt = (array, index, value) => [
  ...array.slice(0, index),
  value,
  ...array.slice(index + 1)
];

const createReducer = handlers => (state, action) =>
  handlers.hasOwnProperty(action.type)
    ? handlers[action.type](state, action)
    : state;

const gameReducer = createReducer({
  SELECT_SQUARE: (state, {square, winner}) => {
    const {history, stepNumber, xIsNext} = state;
    const squares = history[stepNumber];

    return winner || squares[square]
      ? state
      : {
          history: [
            ...history.slice(0, stepNumber + 1),
            replaceAt(squares, square, xIsNext ? 'X' : 'O')
          ],
          stepNumber: stepNumber + 1,
          xIsNext: !xIsNext
        };
  },
  JUMP_TO: ({history}, {step}) => ({
    history,
    stepNumber: step,
    xIsNext: step % 2 === 0
  })
});

const Board = ({clickHandler, squares}) => {
  const renderSquare = index => (
    <button className="square" onClick={clickHandler(index)}>
      {squares[index]}
    </button>
  );

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game = () => {
  const [{history, stepNumber, xIsNext}, dispatch] = React.useReducer(
    gameReducer,
    {
      history: [Array(9).fill(null)],
      stepNumber: 0,
      xIsNext: true
    }
  );

  const moves = history.map((step, move) => (
    <li key={move}>
      <button onClick={() => dispatch({type: 'JUMP_TO', step: move})}>
        {move ? 'Go to move #' + move : 'Go to game start'}
      </button>
    </li>
  ));

  const squares = history[stepNumber];
  const winner = calculateWinner(squares);

  const clickHandler = index => () =>
    dispatch({type: 'SELECT_SQUARE', square: index, winner: winner});

  return (
    <div className="game">
      <div className="status">{getStatus(squares, xIsNext, winner)}</div>
      <Board className="board" clickHandler={clickHandler} squares={squares} />
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

ReactDOM.render(<Game />, document.getElementById('root'));
