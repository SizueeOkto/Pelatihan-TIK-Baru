// Simple Block Blast clone (10x10) - vanilla JS
for(let j=0;j<cols;j++){
if(shape[i][j]){
const r = r0 + i; const c = c0 + j;
if(r<0||r>=ROWS||c<0||c>=COLS) return false;
if(grid[r][c]) return false;
}
}
}
return true;
}


function placePiece(shape, r0, c0, color){const rows = shape.length; const cols = shape[0].length;
for(let i=0;i<rows;i++){
for(let j=0;j<cols;j++){
if(shape[i][j]) grid[r0+i][c0+j] = color;
}
}
}


function checkAndRemoveLines(){let removed=0;
// check full rows
for(let r=ROWS-1;r>=0;r--){if(grid[r].every(v=>v!==0)){
// remove row and shift down
grid.splice(r,1); grid.unshift(Array.from({length:COLS},()=>0)); removed+=10; score+=10; r=ROWS; // restart scan (simple)
}}
// check full cols
for(let c=0;c<COLS;c++){
let full=true; for(let r=0;r<ROWS;r++) if(grid[r][c]===0) {full=false;break}
if(full){
for(let r=0;r<ROWS;r++) grid[r][c]=0; removed+=10; score+=10;
}
}
return removed;
}


function updateScore(){scoreEl.textContent = score}


function isGameOver(){// if any piece cannot be placed anywhere
for(const p of pieces){ if(!p) continue; let possible=false;
for(let r=0;r<ROWS;r++){ for(let c=0;c<COLS;c++){ if(canPlace(p.shape,r,c)){possible=true;break} } if(possible) break }
if(!possible) return true;
}
return false;
}


function flash(msg){const old = document.querySelector('.flash'); if(old) old.remove();
const f = document.createElement('div'); f.className='flash'; f.textContent = msg;
f.style.position='fixed'; f.style.left='50%'; f.style.top='18px'; f.style.transform='translateX(-50%)'; f.style.background='rgba(0,0,0,0.6)'; f.style.padding='8px 12px'; f.style.borderRadius='8px'; f.style.zIndex=9999; document.body.appendChild(f);
setTimeout(()=>f.remove(),900);
}


newBtn.addEventListener('click', ()=>startGame());
shuffleBtn.addEventListener('click', ()=>{pieces = pieces.map(p=>p?randomPiece():null); renderPieces();});


function startGame(){newGrid(); score=0; updateScore(); spawnPieces(); renderGrid();}


// init
startGame();


// expose for debugging
window.__bb = {grid, startGame};
