// script.js - gameplay logic (klik untuk pilih potongan, lalu klik papan untuk menempatkan)
const ROWS = 9;
const COLS = 9;
const gridEl = document.getElementById('grid');
const piecesEl = document.getElementById('pieces');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');

let board = [];
let upcoming = [];
let selectedIndex = null;
let score = 0;

// definisi potongan (array koordinat relatif, kotak 3x3 area untuk preview)
const SHAPES = [
  // single
  [[0,0]],
  // line 3 horizontal
  [[0,0],[1,0],[2,0]],
  // line 3 vertical
  [[0,0],[0,1],[0,2]],
  // 2x2 square
  [[0,0],[1,0],[0,1],[1,1]],
  // L
  [[0,0],[0,1],[0,2],[1,2]],
  // small T
  [[0,1],[1,0],[1,1],[2,1]],
  // zigzag
  [[0,1],[1,1],[1,0],[2,0]],
  // big 3x3 filled (rare)
  [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]
];

function createBoard(){
  board = [];
  for(let r=0;r<ROWS;r++){
    const row = [];
    for(let c=0;c<COLS;c++) row.push(0);
    board.push(row);
  }
}

function renderBoard(){
  gridEl.innerHTML = '';
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r; cell.dataset.c = c;
      if(board[r][c]){ cell.classList.add('occupied'); }
      cell.addEventListener('click', onCellClick);
      gridEl.appendChild(cell);
    }
  }
}

function pickRandomShape(){
  // bias: make single and square more common
  const weights = [4,3,3,3,2,2,2,1];
  const total = weights.reduce((a,b)=>a+b,0);
  let rnd = Math.floor(Math.random()*total);
  for(let i=0;i<weights.length;i++){
    rnd -= weights[i];
    if(rnd<0) return SHAPES[i];
  }
  return SHAPES[0];
}

function generateUpcoming(){
  upcoming = [];
  for(let i=0;i<3;i++) upcoming.push(cloneShape(pickRandomShape()));
}

function cloneShape(shape){
  return shape.map(s=>[s[0],s[1]]);
}

function renderPieces(){
  piecesEl.innerHTML='';
  upcoming.forEach((shape, idx)=>{
    const wrap = document.createElement('div');
    wrap.className='piece';
    if(selectedIndex===idx) wrap.classList.add('selected');
    wrap.dataset.idx = idx;
    wrap.addEventListener('click', ()=>{
      selectedIndex = idx===selectedIndex?null:idx; renderPieces();
    });

    // compute bounding box to center preview
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    shape.forEach(([x,y])=>{ minX=Math.min(minX,x); minY=Math.min(minY,y); maxX=Math.max(maxX,x); maxY=Math.max(maxY,y); });
    const w = maxX-minX+1; const h = maxY-minY+1;

    const grid = document.createElement('div');
    grid.className='piece-grid';
    grid.style.gridTemplateColumns = `repeat(${Math.max(3,w)},16px)`;
    const cells = Math.max(9, Math.max(3,w)*Math.max(3,h));
    // render 3x3 box always (simple preview)
    for(let i=0;i<9;i++){
      const pc = document.createElement('div'); pc.className='piece-cell';
      grid.appendChild(pc);
    }

    // overlay filled squares
    shape.forEach(([x,y])=>{
      const rx = x - minX;
      const ry = y - minY;
      const idxCell = ry*3 + rx; // best-effort for preview
      const cellsArr = Array.from(grid.children);
      if(cellsArr[idxCell]) cellsArr[idxCell].classList.add('filled');
    });

    wrap.appendChild(grid);
    const label = document.createElement('div');
    label.style.marginLeft='8px';
    label.innerHTML = `<strong>${shape.length}</strong> kotak`;
    wrap.appendChild(label);

    piecesEl.appendChild(wrap);
  });
}

function onCellClick(e){
  if(selectedIndex===null) return; // no piece selected
  const r = parseInt(thisOrTarget(e).dataset.r);
  const c = parseInt(thisOrTarget(e).dataset.c);
  tryPlacePiece(r,c,upcoming[selectedIndex]);
}

function thisOrTarget(e){
  return e.currentTarget || e.target;
}

function tryPlacePiece(r,c,shape){
  // we treat the clicked cell as the shape's top-left anchor (0,0) for simplicity
  // but better: place so that one of shape coords maps to clicked cell
  // we'll map shape[0] to clicked position
  const anchor = shape[0];
  const offsetR = r - anchor[1];
  const offsetC = c - anchor[0];
  // check bounds & collisions
  for(const [sx,sy] of shape){
    const tr = offsetR + sy;
    const tc = offsetC + sx;
    if(tr<0||tr>=ROWS||tc<0||tc>=COLS) return flashInvalid(offsetR,offsetC,shape);
    if(board[tr][tc]) return flashInvalid(offsetR,offsetC,shape);
  }
  // place
  for(const [sx,sy] of shape){
    const tr = offsetR + sy;
    const tc = offsetC + sx;
    board[tr][tc] = 1;
  }
  // remove the used piece & shift upcoming
  upcoming.splice(selectedIndex,1);
  // add new random piece
  upcoming.push(cloneShape(pickRandomShape()));
  selectedIndex = null;
  processClears();
  renderAll();
  // check game over (no placement possible for any upcoming)
  if(!anyPlacementAvailable()){
    setTimeout(()=>{
      alert('Game Over! Skor kamu: ' + score);
    },80);
  }
}

function flashInvalid(offsetR,offsetC,shape){
  // quick visual feedback: flash cells where it would go in red briefly
  const cells = [];
  for(const [sx,sy] of shape){
    const tr = offsetR + sy;
    const tc = offsetC + sx;
    if(tr<0||tr>=ROWS||tc<0||tc>=COLS) continue;
    const idx = tr*COLS + tc;
    const el = gridEl.children[idx];
    if(el){ el.classList.add('hover'); cells.push(el); }
  }
  setTimeout(()=>cells.forEach(el=>el.classList.remove('hover')),220);
}

function processClears(){
  // check full rows
  const rowsToClear = [];
  const colsToClear = [];
  for(let r=0;r<ROWS;r++){
    if(board[r].every(v=>v===1)) rowsToClear.push(r);
  }
  for(let c=0;c<COLS;c++){
    let full = true;
    for(let r=0;r<ROWS;r++) if(board[r][c]===0) full=false;
    if(full) colsToClear.push(c);
  }
  const totalCleared = rowsToClear.length*COLS + colsToClear.length*ROWS - (rowsToClear.length*colsToClear.length);
  // perform clears
  rowsToClear.forEach(r=>{
    for(let c=0;c<COLS;c++) board[r][c]=0;
  });
  colsToClear.forEach(c=>{
    for(let r=0;r<ROWS;r++) board[r][c]=0;
  });
  if(totalCleared>0){
    score += totalCleared * 10;
  }
}

function anyPlacementAvailable(){
  // brute force: for each cell and each upcoming shape, test placement
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      for(const shape of upcoming){
        const anchor = shape[0];
        const offsetR = r - anchor[1];
        const offsetC = c - anchor[0];
        let ok = true;
        for(const [sx,sy] of shape){
          const tr = offsetR + sy;
          const tc = offsetC + sx;
          if(tr<0||tr>=ROWS||tc<0||tc>=COLS){ ok=false; break; }
          if(board[tr][tc]){ ok=false; break; }
        }
        if(ok) return true;
      }
    }
  }
  return false;
}

function renderAll(){
  renderBoard();
  renderPieces();
  scoreEl.textContent = score;
}

restartBtn.addEventListener('click', ()=>{
  init();
});

function init(){
  createBoard();
  generateUpcoming();
  selectedIndex = null;
  score = 0;
  renderAll();
}

init();

// keyboard hint: press R to restart
window.addEventListener('keydown', e=>{
  if(e.key.toLowerCase()==='r') init();
});
