const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");

let state = "GROUP"; // GROUP, MATCH, PENALTY, KNOCKOUT, WIN

// ⚽ Teams & ratings
const teams = [
  { name: "Man United", atk: 88, def: 82 },
  { name: "Real Madrid", atk: 92, def: 85 },
  { name: "Bayern", atk: 90, def: 84 },
  { name: "PSG", atk: 89, def: 80 }
];

let playerTeam = teams[0];
let opponent = teams[1];

let goalsFor = 0;
let goalsAgainst = 0;
let matchTime = 0;

// Ball
let ball = { x: 180, y: 500, vx: 0, vy: 0, moving: false };

// Keeper
let keeper = { x: 155, y: 80, w: 50, h: 80 };

// Input
let dragging = false;
let sx, sy;

// 📱 Touch + mouse
canvas.addEventListener("pointerdown", e => {
  if (!ball.moving) {
    dragging = true;
    sx = e.offsetX;
    sy = e.offsetY;
  }
});

canvas.addEventListener("pointerup", e => {
  if (dragging) {
    ball.vx = (e.offsetX - sx) * 0.08;
    ball.vy = (e.offsetY - sy) * 0.08;
    ball.moving = true;
    dragging = false;
  }
});

function resetBall() {
  ball.x = 180;
  ball.y = 500;
  ball.vx = 0;
  ball.vy = 0;
  ball.moving = false;
}

function goalScored(forPlayer) {
  if (forPlayer) goalsFor++;
  else goalsAgainst++;
  resetBall();
}

function drawPitch() {
  ctx.clearRect(0, 0, 360, 640);
  ctx.strokeStyle = "white";
  ctx.strokeRect(110, 20, 140, 120);
}

function updateKeeper() {
  let reaction = opponent.def / 100;
  keeper.x += (ball.x - (keeper.x + keeper.w / 2)) * reaction * 0.05;
}

function drawKeeper() {
  ctx.fillStyle = "red";
  ctx.fillRect(keeper.x, keeper.y, keeper.w, keeper.h);
}

function drawBall() {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
  ctx.fill();
}

function updateBall() {
  if (!ball.moving) return;

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (
    ball.x > keeper.x &&
    ball.x < keeper.x + keeper.w &&
    ball.y < keeper.y + keeper.h
  ) {
    goalScored(false);
  }

  if (ball.y < 30 && ball.x > 110 && ball.x < 250) {
    let chance = playerTeam.atk / (playerTeam.atk + opponent.def);
    Math.random() < chance ? goalScored(true) : goalScored(false);
  }
}

function drawScore() {
  info.innerHTML = `
    ${playerTeam.name} ${goalsFor} - ${goalsAgainst} ${opponent.name}<br>
    Time: ${matchTime}'
  `;
}

function nextMatch() {
  goalsFor = 0;
  goalsAgainst = 0;
  matchTime = 0;
  opponent = teams[Math.floor(Math.random() * teams.length)];
  resetBall();
}

function updateMatch() {
  drawPitch();
  updateKeeper();
  drawKeeper();
  updateBall();
  drawBall();
  drawScore();

  matchTime += 0.03;

  if (matchTime > 90) {
    if (goalsFor === goalsAgainst) {
      state = "PENALTY";
    } else {
      state = "GROUP";
      nextMatch();
    }
  }
}

function penaltyShoot() {
  drawPitch();
  drawKeeper();
  drawBall();
  info.innerHTML = "PENALTY SHOOTOUT — TAP TO SHOOT";

  if (ball.moving && Math.random() < 0.5) {
    goalScored(true);
    state = "GROUP";
  }
}

function gameLoop() {
  if (state === "MATCH") updateMatch();
  if (state === "PENALTY") penaltyShoot();

  if (state === "GROUP") {
    info.innerHTML = "GROUP STAGE — CLICK TO PLAY MATCH";
    canvas.onclick = () => {
      state = "MATCH";
      canvas.onclick = null;
    };
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
