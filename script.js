let hScore = document.querySelector("#high-score");
let score = document.querySelector("#score");
score.innerText = 0;
let timer = document.querySelector("#time");
let highScoreLocal = localStorage.getItem("highScore") || 0;
hScore.innerText = highScoreLocal;
let snake = [{ x: 3, y: 6 }];
let timerInterId = null;
let intervalId = null;
let direction = "down";
let sec = 0;
let min = 0;

const board = document.querySelector(".board");
const start = document.querySelector("#start");
const startModel = document.querySelector(".model-start-game");
const restart = document.querySelector("#restart");
const gameOverModel = document.querySelector(".model-game-over");
const blockSize = 30;
const blocks = [];

const cols = Math.floor(board.clientWidth / blockSize);
const rows = Math.floor(board.clientHeight / blockSize);

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

// carete blocks
const createBlocks = () => {
  gameOverModel.style.display = "none";
  board.style.gridTemplateColumns = `repeat(auto-fill, minmax(${blockSize}px, 1fr))`;
  board.style.gridTemplateRows = `repeat(auto-fill, minmax(${blockSize}px, 1fr))`;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const block = document.createElement("div");
      block.classList.add("block");
      board.appendChild(block);
      blocks[`${i}-${j}`] = block;
    }
  }
};

// Timer Function
const startTimer = () => {
  timerInterId = setInterval(() => {
    sec++;
    if (sec === 60) {
      min++;
      sec = 0;
    }
    const formattedMinutes = min.toString().padStart(2, "0");
    const formattedSeconds = sec.toString().padStart(2, "0");
    timer.textContent = `${formattedMinutes}:${formattedSeconds}`;
  }, 1000);
};

// Snake render function
const render = () => {
  let head = { x: null, y: null };

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
  if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  }
  if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    gameOverModel.style.display = "flex";

    clearInterval(intervalId);
    clearInterval(timerInterId);

    let currentScore = Number(score.innerText);
    let newHighScore = Math.max(Number(highScoreLocal), currentScore);

    if (currentScore > highScoreLocal) {
      localStorage.setItem("highScore", newHighScore);
      highScoreLocal = newHighScore;
      hScore.innerText = newHighScore;
    }
  }

  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    snake.unshift(food);
    score.innerText = Number(score.innerText) + 10;
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
};
// Game start event
start.addEventListener("click", () => {
  startModel.style.display = "none";
  startTimer();
  intervalId = setInterval(() => {
    render();
  }, 300);
});

// Game restart event
const reStartGame = () => {
  clearInterval(intervalId);
  clearInterval(timerInterId);
  sec = 0;
  min = 0;
  timer.innerText = "00:00";
  score.innerText = 0;
  snake = [{ x: 3, y: 6 }];

  gameOverModel.style.display = "none";
  timerInterId = setInterval(startTimer, 1000);
  intervalId = setInterval(render, 300);
};
restart.addEventListener("click", reStartGame);

// Keydown function
const isKeyDown = () => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      direction = "down";
    } else if (e.key === "ArrowUp") {
      direction = "up";
    } else if (e.key === "ArrowLeft") {
      direction = "left";
    } else {
      direction = "right";
    }
  });
};

// On load
isKeyDown();
createBlocks();
