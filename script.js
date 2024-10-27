const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart");
const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");
const soundToggle = document.getElementById("sound");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let isSinglePlayer = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const soundEffects = {
  win: new Audio("assets/you-win-sequence-2-183949.mp3"),
  move: new Audio("assets/point-smooth-beep-230573.mp3"),
  draw: new Audio("assets/energy-up-sound-effect-230472.mp3"),
};

modeSelect.addEventListener("change", toggleMode);
restartButton.addEventListener("click", restartGame);

function toggleMode() {
  isSinglePlayer = modeSelect.value === "single";
  difficultySelect.disabled = !isSinglePlayer;
  restartGame();
}

function createBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;

    if (cell === "X") {
      cellElement.style.color = "green";
    } else if (cell === "O") {
      cellElement.style.color = "red";
    }

    cellElement.addEventListener("click", () => handleCellClick(index));
    boardElement.appendChild(cellElement);
  });
}

function handleCellClick(index) {
  if (board[index] !== "" || !isGameActive) return;
  board[index] = currentPlayer;
  playSound("move");
  checkForWinner();
  if (isSinglePlayer && isGameActive) {
    currentPlayer = "O";
    setTimeout(() => aiMove(), 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
  createBoard();
}

function aiMove() {
  const availableCells = board
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);
  if (availableCells.length > 0) {
    const index = selectAIMove(availableCells);
    board[index] = currentPlayer;
    playSound("move");
    checkForWinner();
    currentPlayer = "X";
  }
  createBoard();
}

function selectAIMove(availableCells) {
  if (difficultySelect.value === "easy") {
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  } else if (difficultySelect.value === "medium") {
    return mediumAIMove(availableCells);
  } else {
    return hardAIMove(availableCells);
  }
}

function mediumAIMove(availableCells) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === "O" && board[b] === "O" && availableCells.includes(c))
      return c;
    if (board[a] === "X" && board[b] === "X" && availableCells.includes(c))
      return c;
  }
  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function hardAIMove(availableCells) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === "O" && board[b] === "O" && availableCells.includes(c))
      return c;
    if (board[a] === "X" && board[b] === "X" && availableCells.includes(c))
      return c;
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function checkForWinner() {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === "" || board[b] === "" || board[c] === "") continue;
    if (board[a] === board[b] && board[b] === board[c]) {
      isGameActive = false;
      displayWinner(board[a]);
      return;
    }
  }
  if (!board.includes("")) {
    isGameActive = false;
    displayDraw();
  }
}

function displayWinner(winner) {
  statusElement.textContent = `Player ${winner} wins!`;

  if (winner === "X") {
    statusElement.style.color = "green";
  } else if (winner === "O") {
    statusElement.style.color = "red";
  }

  playSound("win");
}

function displayDraw() {
  statusElement.textContent = "It's a draw!";
  statusElement.style.color = "white";
  playSound("draw");
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  statusElement.textContent = "";
  createBoard();
}

function playSound(action) {
  if (soundToggle.checked) {
    soundEffects[action].play();
  }
}

createBoard();
