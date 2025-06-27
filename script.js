const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 360;
canvas.height = 640;

const pegs = [];
const columns = 8;
const ballRadius = 8;
let ball = null;
let isDropping = false;
let scoreText = '';
let soundDrop = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_4ba878d408.mp3?filename=click-124467.mp3');

// Emoji scoring zones
const scoringZones = [
  { emoji: "🌸", points: 10000 },
  { emoji: "⭐", points: 50000 },
  { emoji: "🎮", points: 5000 },
  { emoji: "🎮", points: 150000 },
  { emoji: "☘️", points: 50000 },
  { emoji: "➖", points: 0, miss: true },
  { emoji: "🔁", points: 0, repeat: true },
  { emoji: "🌸", points: 10000 },
];

// Create pegs in grid
for (let y = 80; y < 500; y += 40) {
  for (let x = (y % 80 === 0 ? 40 : 20); x < canvas.width; x += 40) {
    pegs.push({ x, y });
  }
}

function drawPegs() {
  ctx.fillStyle = "#fff";
  pegs.forEach(peg => {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcccc";
  ctx.fill();
}

function drawScoringZones() {
  const zoneWidth = canvas.width / columns;
  scoringZones.forEach((zone, i) => {
    ctx.fillStyle = "#222";
    ctx.fillRect(i * zoneWidth, canvas.height - 60, zoneWidth, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(zone.emoji, i * zoneWidth + zoneWidth / 2, canvas.height - 25);
  });
}

function updateBall() {
  ball.vy += 0.3;
  ball.x += ball.vx;
  ball.y += ball.vy;

  pegs.forEach(peg => {
    const dx = ball.x - peg.x;
    const dy = ball.y - peg.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < ballRadius + 4) {
      const angle = Math.atan2(dy, dx);
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = Math.cos(angle) * speed;
      ball.vy = Math.sin(angle) * speed;
    }
  });

  if (ball.y + ballRadius >= canvas.height - 60) {
    const zone = Math.floor(ball.x / (canvas.width / columns));
    const result = scoringZones[zone];
    if (result.miss) {
      scoreText = "Miss a turn ➖";
    } else if (result.repeat) {
      scoreText = "Go again 🔁";
    } else {
      scoreText = `+${result.points.toLocaleString()} ${result.emoji}`;
    }
    isDropping = false;
    ball = null;
  }
}

function drawScore() {
  if (scoreText) {
    ctx.fillStyle = "#fff";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(scoreText, canvas.width / 2, 40);
  }
}

function gameLoop() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPegs();
  drawScoringZones();
  if (ball) {
    updateBall();
    drawBall();
  }
  drawScore();
  requestAnimationFrame(gameLoop);
}

document.getElementById("dropButton").addEventListener("click", () => {
  if (!isDropping) {
    const x = canvas.width / 2;
    ball = {
      x,
      y: 0,
      vx: (Math.random() - 0.5) * 2,
      vy: 2,
    };
    isDropping = true;
    scoreText = "";
    soundDrop.play();
  }
});

gameLoop();
