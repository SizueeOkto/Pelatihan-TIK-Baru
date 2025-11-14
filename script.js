const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");
const howto = document.getElementById("howto");

const BOX = 20;
let snake, food, dir, nextDir, score, gameOver = false;
let gameInterval;
let playing = false; // NEW — game belum dimulai

function startGame() {
  howto.style.display = "none"; // hilangkan layar howto
  playing = true;
  init();
}

function init() {
  snake = [{ x: 200, y: 200 }];
  dir = null;
  nextDir = null;
  score = 0;
  gameOver = false;
  food = spawnFood();
  updateScore();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 120);
}

function updateScore() {
  scoreEl.textContent = "Score: " + score;
}

document.addEventListener("keydown", (e) => {
  if (!playing) return; // cegah input sebelum PLAY ditekan
  
  const key = e.key.toUpperCase();
  if (key === "W") trySetDir("UP");
  else if (key === "S") trySetDir("DOWN");
  else if (key === "A") trySetDir("LEFT");
  else if (key === "D") trySetDir("RIGHT");
});

function trySetDir(d) {
  const opposite = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
  if (!dir) {
    dir = d;
    return;
  }
  if (d !== opposite[dir]) nextDir = d;
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 20) * BOX,
    y: Math.floor(Math.random() * 20) * BOX
  };
}

function drawBoard() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 400, 400);
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#3cff00" : "#7aff5c";
    ctx.fillRect(snake[i].x, snake[i].y, BOX, BOX);
  }
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, BOX, BOX);
}

function showGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("GAME OVER", 95, 200);
}

function gameLoop() {
  if (!playing) return;

  if (gameOver) return showGameOver();

  if (nextDir) {
    dir = nextDir;
    nextDir = null;
  }

  if (!dir) {
    drawBoard();
    drawSnake();
    drawFood();
    return;
  }

  let head = { x: snake[0].x, y: snake[0].y };

  if (dir === "UP") head.y -= BOX;
  if (dir === "DOWN") head.y += BOX;
  if (dir === "LEFT") head.x -= BOX;
  if (dir === "RIGHT") head.x += BOX;

  // wall collision
  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
    gameOver = true;
    return;
  }

  // self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      return;
    }
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);

  drawBoard();
  drawSnake();
  drawFood();
}

restartBtn.addEventListener("click", init);
