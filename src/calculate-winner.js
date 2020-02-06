const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const calculateWinner = squares => {
  const winningLine = lines.find(line =>
    line.map(i => squares[i]).every((v, _, a) => v && v === a[0])
  );

  return winningLine ? squares[winningLine[0]] : null;
};
export default calculateWinner;
