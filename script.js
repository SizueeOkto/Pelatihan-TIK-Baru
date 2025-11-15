// === script.js Block Blast ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


canvas.width = 360;
canvas.height = 480;


// Grid settings
const COLS = 9;
const ROWS = 12;
const CELL = 40;


let grid = [];


function createGrid() {
for (let r = 0; r < ROWS; r++) {
grid[r] = [];
for (let c = 0; c < COLS; c++) {
grid[r][c] = 0;
}
}
}


// Tetromino shapes
const shapes = [
[[1, 1], [1, 1]], // Square
[[1, 1, 1]], // Line horizontal
[[1], [1], [1]], // Line vertical
[[1, 1, 1], [0, 1, 0]] // T shape
];


let currentPiece = null;
let pieceX = 2;
let pieceY = 0;


function newPiece() {
currentPiece = shapes[Math.floor(Math.random() * shapes.length)];
pieceX = 2;
pieceY = 0;
}


function drawGrid() {
for (let r = 0; r < ROWS; r++) {
for (let c = 0; c < COLS; c++) {
ctx.fillStyle = grid[r][c] ? "cyan" : "#333";
ctx.fillRect(c * CELL, r * CELL, CELL - 2, CELL - 2);
}
}
}


function drawPiece() {
ctx.fillStyle = "orange";
for (let r = 0; r < currentPiece.length; r++) {
for (let c = 0; c < currentPiece[0].length; c++) {
if (currentPiece[r][c]) {
ctx.fillRect((pieceX + c) * CELL, (pieceY + r) * CELL, CELL - 2, CELL - 2);
}
}
}
}


function mergePiece() {
for (let r = 0; r < currentPiece.length; r++) {
for (let c = 0; c < currentPiece[0].length; c++) {
if (currentPiece[r][c]) {
grid[pieceY + r][pieceX + c] = 1;
}
}
}
}


function checkCollision(dx, dy) {
for (let r = 0; r < currentPiece.length; r++) {
