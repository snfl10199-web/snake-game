const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const gridSize = 20; // 한 칸 크기
const tileCount = canvas.width / gridSize;

let snake = [{x:8, y:8}];
let dir = {x:0, y:0};
let nextDir = {x:0, y:0};
let apple = {x:5, y:5};
let tail = 3;
let score = 0;
let gameOver = false;
let speed = 8; // 초당 프레임 (대략)

function reset(){
  snake = [{x:8, y:8}];
  dir = {x:0, y:0};
  nextDir = {x:0, y:0};
  apple = randPos();
  tail = 3;
  score = 0;
  gameOver = false;
  speed = 8;
  updateScore();
  statusEl.textContent = '방향키로 조작하세요.';
}

function randPos(){
  return {x: Math.floor(Math.random()*tileCount), y: Math.floor(Math.random()*tileCount)};
}

function gameLoop(){
  if(gameOver){
    statusEl.textContent = '게임 오버!';
    return;
  }
  requestAnimationFrame(gameLoop);
}

let lastTime = 0;
function frame(time){
  if(gameOver) return;
  requestAnimationFrame(frame);
  const seconds = (time - lastTime) / 1000;
  if(seconds < 1 / speed) return;
  lastTime = time;
  update();
  draw();
}

function update(){
  if(nextDir.x !== 0 || nextDir.y !== 0) dir = nextDir;
  if(dir.x === 0 && dir.y === 0) return; // 아직 이동하지 않음

  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

  // 벽 통과하지 못하게 (게임 오버)
  if(head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount){
    gameOver = true; return;
  }

  // 자기 자신과 충돌
  for(let s of snake){
    if(s.x === head.x && s.y === head.y){
      gameOver = true; return;
    }
  }

  snake.unshift(head);
  if(snake.length > tail) snake.pop();

  // 사과 먹기
  if(head.x === apple.x && head.y === apple.y){
    tail++;
    score += 10;
    speed = Math.min(20, speed + 0.5);
    apple = randPosNotOnSnake();
    updateScore();
  }
}

function randPosNotOnSnake(){
  let p;
  while(true){
    p = randPos();
    let collision = snake.some(s => s.x === p.x && s.y === p.y);
    if(!collision) return p;
  }
}

function draw(){
  // 배경
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // 그리드 (선택적)
  ctx.strokeStyle = '#0f1a2b';
  ctx.lineWidth = 1;
  for(let i=0;i<tileCount;i++){
    ctx.beginPath();
    ctx.moveTo(i*gridSize,0);
    ctx.lineTo(i*gridSize,canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,i*gridSize);
    ctx.lineTo(canvas.width,i*gridSize);
    ctx.stroke();
  }

  // 사과
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(apple.x*gridSize+2, apple.y*gridSize+2, gridSize-4, gridSize-4);

  // 뱀
  for(let i=0;i<snake.length;i++){
    ctx.fillStyle = i===0 ? '#7dd3fc' : '#38bdf8';
    ctx.fillRect(snake[i].x*gridSize+1, snake[i].y*gridSize+1, gridSize-2, gridSize-2);
  }
}

function updateScore(){
  scoreEl.textContent = `점수: ${score}`;
}

// 키 입력
window.addEventListener('keydown', e=>{
  if(e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setDir(0,-1);
  if(e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setDir(0,1);
  if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setDir(-1,0);
  if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setDir(1,0);
});

function setDir(x,y){
  // 반대 방향 막기
  if(dir.x === -x && dir.y === -y) return;
  nextDir = {x,y};
}

// 모바일 컨트롤: 제거됨 (HTML에서 버튼 삭제)

// 시작
reset();
requestAnimationFrame(frame);
