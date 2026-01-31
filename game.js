const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let ball = { x: 200, y: 225, vx: 0, vy: 0, moving: false };
let keeper = { x: 720, y: 175, w: 20, h: 100 };
let score = 0;

let dragging = false;
let startX, startY;

canvas.addEventListener("mousedown", e => {
  if (!ball.moving) {
    dragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
  }
});

canvas.addEventListener("mouseup", e => {
  if (dragging) {
    ball.vx = (e.offsetX - startX) * 0.08;
    ball.vy = (e.offsetY - startY) * 0.08;
    ball.moving = true;
    dragging = false;
  }
});

function resetBall() {
  ball.x = 200;
  ball.y = 225;
  ball.vx = 0;
  ball.vy = 0;
  ball.moving = false;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Goal
  ctx.strokeStyle = "white";
  ctx.strokeRect(760, 140, 30, 170);

  // Keeper AI
  if (ball.y < keeper.y) keeper.y -= 2;
  if (ball.y > keeper.y + keeper.h) keeper.y += 2;

  ctx.fillStyle = "red";
  ctx.fillRect(keeper.x, keeper.y, keeper.w, keeper.h);

  // Ball physics
  if (ball.moving) {
    ball.x += ball.vx;
    ball.y += ball.vy;
  }

  // Collision with keeper
  if (
    ball.x > keeper.x &&
    ball.y > keeper.y &&
    ball.y < keeper.y + keeper.h
  ) {
    resetBall();
  }

  // Goal scored
  if (ball.x > 780 && ball.y > 140 && ball.y < 310) {
    score++;
    resetBall();
  }

  // Draw ball
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
  ctx.fill();

  // Score
  ctx.fillStyle = "white";
  ctx.fillText("Goals: " + score, 20, 20);

  requestAnimationFrame(update);
}

update();

