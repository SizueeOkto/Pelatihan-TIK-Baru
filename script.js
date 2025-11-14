const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{ x: 9 * box, y: 9 * box }];
let food = spawnFood();
let dir = null;

document.addEventListener("keydown", direction);

function direction(e) {
  if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  else if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
  else if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  else if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 400, 400);

  // draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#3cff00" : "#7aff5c";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // snake head
  let head = { x: snake[0].x, y: snake[0].y };

  if (dir === "UP") head.y -= box;
  if (dir === "DOWN") head.y += box;
  if (dir === "LEFT") head.x -= box;
  if (dir === "RIGHT") head.x += box;

  // collision wall
  if (head.x < 0 || head.x > 380 || head.y < 0 || head.y > 380) {
    alert("Game Over!");
    document.location.reload();
  }

  // collision self
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      alert("Game Over!");
      document.location.reload();
    }
  }

  // eat food
  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

setInterval(draw, 120);
