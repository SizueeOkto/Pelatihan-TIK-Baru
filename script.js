const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");

const BOX = 20;
const COLS = canvas.width / BOX; // 20
const ROWS = canvas.height / BOX; // 20

let snake;
let food;
let dir; // "UP"|"DOWN"|"LEFT"|"RIGHT"|null
let nextDir; // to queue direction and prevent reverse-instant
let gameInterval;
let score = 0;
const SPEED = 120;

function init() {
  snake = [{ x: 9 * BOX, y: 9 * BOX }]; // head at center-ish
  dir = null;
  nextDir = null;
  score = 0;
  food = spawnFood();
  updateScore();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, SPEED);
}
function updateScore() {
  scoreEl.textContent = "Score: " + score;
}

function direction(e) {
  const key = e.key;
  if (key === "ArrowUp") trySetDir("UP");
  else if (key === "ArrowDown") trySetDir("DOWN");
  else if (key === "ArrowLeft") trySetDir("LEFT");
  else if (key === "ArrowRight") trySetDir("RIGHT");
}

function trySetDir(d) {
  // prevent 180deg reverse
  const opposite = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT"
  };
  if (!dir) {
    // if no current dir, accept
    nextDir = d;
    dir = nextDir;
  } else if (d !== opposite[dir]) {
    // queue it, will apply at next step
    nextDir = d;
  }
}

function spawnFood() {
  // choose position not occupied by snake
  while (true) {
    const fx = Math.floor(Math.random() * COLS) * BOX;
    const fy = Math.floor(Math.random() * ROWS) * BOX;
    let collide = false;
    for (let s of snake) {
      if (s.x === fx && s.y === fy) {
        collide = true;
        break;
      }
    }
    if (!collide) return { x: fx, y: fy };
    // else loop and try another
  }
}

function checkSelfCollision(head) {
  // start from i = 1 (skip head itself)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) return true;
  }
  return false;
}

function gameOver() {
  clearInterval(gameInterval);
  alert("Game Over! Score: " + score);
  init(); // restart cleanly
}

function drawGrid() {
  // optional subtle grid (small effect)
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  drawGrid();

  // draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, BOX, BOX);

  // draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#3cff00" : "#7aff5c";
    ctx.fillRect(snake[i].x, snake[i].y, BOX, BOX);
  }
}

function gameLoop() {
  // apply queued direction
  if (nextDir) {
    dir = nextDir;
    nextDir = null;
  }

  // if no movement yet, just draw
  if (!dir) {
    draw();
    return;
  }

  // compute next head
  const head = { x: snake[0].x, y: snake[0].y };
  if (dir === "UP") head.y -= BOX;
  if (dir === "DOWN") head.y += BOX;
  if (dir === "LEFT") head.x -= BOX;
  if (dir === "RIGHT") head.x += BOX;

  // wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    gameOver();
    return;
  }

  // self collision (skip index 0)
  if (checkSelfCollision(head)) {
    gameOver();
    return;
  }

  // eat food?
  const ate = head.x === food.x && head.y === food.y;
  if (ate) {
    score++;
    updateScore();
    food = spawnFood();
    // don't pop tail (grow)
  } else {
    // move: remove tail
    snake.pop();
  }

  // add new head
  snake.unshift(head);

  draw();
}

document.addEventListener("keydown", direction);
restartBtn.addEventListener("click", init);

// start game
init();
