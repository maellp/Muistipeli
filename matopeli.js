const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;

let snake = [{ x: 160, y: 200 }];
let dx = gridSize;
let dy = 0;
let food = spawnFood();
let score = 0;
let gameInterval = null;
let isGameRunning = false;

document.addEventListener("keydown", changeDirection);

function gameLoop() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  isGameRunning = false;
  document.getElementById("finalScore").textContent = "Pisteet: " + score;
  document.getElementById("gameOverModal").style.display = "block";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    const x = segment.x + gridSize / 2;
    const y = segment.y + gridSize / 2;

    // Shadow
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.ellipse(x + 4, y + 6, gridSize / 2 - 3, (gridSize / 2 - 3) / 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    if (index === 0) {
      // Head
      ctx.fillStyle = "#ff4081";
      ctx.strokeStyle = "#b20056";
      ctx.lineWidth = 3;
      ctx.arc(x, y, gridSize / 2 - 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "white";
      const eyeRadius = 3;
      ctx.beginPath();
      ctx.arc(x - 6, y - 4, eyeRadius, 0, 2 * Math.PI);
      ctx.arc(x + 6, y - 4, eyeRadius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(x - 6, y - 4, 1.5, 0, 2 * Math.PI);
      ctx.arc(x + 6, y - 4, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Body with gradient
      const gradient = ctx.createRadialGradient(x, y, gridSize / 6, x, y, gridSize / 2);
      gradient.addColorStop(0, "#ff80b3");
      gradient.addColorStop(1, "#b20056");
      ctx.fillStyle = gradient;
      ctx.strokeStyle = "#800033";
      ctx.lineWidth = 2;
      ctx.arc(x, y, gridSize / 2 - 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Shine
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.arc(x, y - 4, gridSize / 3, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    }
  });

  // Draw food (🍎)
  const foodX = food.x + gridSize / 2;
  const foodY = food.y + gridSize / 2;

  ctx.font = `${gridSize}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🍎", foodX, foodY);
}

function changeDirection(e) {
  if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -gridSize;
  } else if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = gridSize;
  } else if (e.key === "ArrowLeft" && dx === 0) {
    dx = -gridSize; dy = 0;
  } else if (e.key === "ArrowRight" && dx === 0) {
    dx = gridSize; dy = 0;
  }
}

function resetGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  snake = [{ x: 160, y: 200 }];
  dx = gridSize;
  dy = 0;
  food = spawnFood();
  score = 0;
  isGameRunning = true;
  document.getElementById("score").textContent = score;
  draw();
}

document.getElementById("startButton").addEventListener("click", () => {
  if (isGameRunning) return;
  resetGame();
  gameInterval = setInterval(gameLoop, 200);
  document.getElementById("startButton").style.display = "none";
});

document.getElementById("restartButton").addEventListener("click", () => {
  if (isGameRunning) return;
  document.getElementById("gameOverModal").style.display = "none";
  resetGame();
  gameInterval = setInterval(gameLoop, 200);
});

document.getElementById("backToMenuButton").addEventListener("click", () => {
  window.location.href = "index.html"; // muuta tarvittaessa
});
