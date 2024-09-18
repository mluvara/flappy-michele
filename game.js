// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const bitcoinImg = new Image();
bitcoinImg.src = 'assets/bitcoin.jpeg';

const moneyStackImg = new Image();
moneyStackImg.src = 'assets/money_stack.png';

// Game variables
let bitcoin;
let obstacles = [];
let frames = 0;
let score = 0;
let gameState = 'playing';
let obstacleSpeed;

// Initialize game
function initGame() {
  resizeCanvas();
  bitcoin = {
    x: canvas.width * 0.1,
    y: canvas.height / 2,
    width: canvas.width * 0.05,
    height: canvas.width * 0.05,
    gravity: canvas.height * 0.001,
    lift: -canvas.height * 0.02,
    velocity: 0
  };
  obstacleSpeed = canvas.width * 0.005;
}

// Set canvas size and adjust game elements
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  adjustGameElements();
}

// Adjust game elements on resize
function adjustGameElements() {
  if (bitcoin) {
    bitcoin.x = canvas.width * 0.1;
    bitcoin.width = canvas.width * 0.05;
    bitcoin.height = canvas.width * 0.05;
    bitcoin.gravity = canvas.height * 0.001;
    bitcoin.lift = -canvas.height * 0.02;
  }
  obstacleSpeed = canvas.width * 0.005;
  // Adjust existing obstacles if necessary
}

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Handle user input
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    if (gameState === 'playing') {
      bitcoin.velocity += bitcoin.lift;
    } else if (gameState === 'gameover') {
      restartGame();
    }
  }
});

canvas.addEventListener('click', function() {
  if (gameState === 'playing') {
    bitcoin.velocity += bitcoin.lift;
  } else if (gameState === 'gameover') {
    restartGame();
  }
});

// Game loop
function update() {
  if (gameState === 'playing') {
    frames++;

    // Apply gravity
    bitcoin.velocity += bitcoin.gravity;
    bitcoin.y += bitcoin.velocity;

    // Boundary checks
    if (bitcoin.y + bitcoin.height >= canvas.height || bitcoin.y <= 0) {
      endGame();
    }

    // Generate obstacles
    if (frames % Math.floor(canvas.width * 0.05) === 0) {
      generateObstacles();
    }

    // Move obstacles and check collisions
    obstacles.forEach(obstacle => {
      obstacle.x -= obstacleSpeed;

      // Collision detection
      if (
        bitcoin.x < obstacle.x + obstacle.width &&
        bitcoin.x + bitcoin.width > obstacle.x &&
        bitcoin.y < obstacle.y + obstacle.height &&
        bitcoin.y + bitcoin.height > obstacle.y
      ) {
        endGame();
      }

      // Update score
      if (!obstacle.passed && obstacle.x + obstacle.width < bitcoin.x) {
        score++;
        obstacle.passed = true;
      }
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
  }

  draw();
  requestAnimationFrame(update);
}

// Drawing function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Bitcoin
  ctx.drawImage(bitcoinImg, bitcoin.x, bitcoin.y, bitcoin.width, bitcoin.height);

  // Draw obstacles
  obstacles.forEach(obstacle => {
    ctx.drawImage(
      moneyStackImg,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  });

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = `${canvas.width * 0.02}px Arial`;
  ctx.fillText('Score: ' + score, canvas.width * 0.02, canvas.height * 0.05);

  // Game over screen
  if (gameState === 'gameover') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = `${canvas.width * 0.05}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - canvas.height * 0.05);

    ctx.font = `${canvas.width * 0.03}px Arial`;
    ctx.fillText('Your Score: ' + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press Space or Click to Restart', canvas.width / 2, canvas.height / 2 + canvas.height * 0.05);

    ctx.textAlign = 'left';
  }
}

// Generate obstacles
function generateObstacles() {
  const gap = canvas.height * 0.5;
  const obstacleWidth = canvas.width * 0.2 
  const minHeight = canvas.height * 0.1;
  const maxHeight = canvas.height * 0.5;
  const obstacleHeight = Math.random() * (maxHeight - minHeight) + minHeight;

  obstacles.push({
    x: canvas.width,
    y: 0,
    width: obstacleWidth,
    height: obstacleHeight,
    passed: false
  });

  obstacles.push({
    x: canvas.width,
    y: obstacleHeight + gap,
    width: obstacleWidth,
    height: canvas.height - obstacleHeight - gap,
    passed: false
  });
}

// End game
function endGame() {
  gameState = 'gameover';
}

// Restart game
function restartGame() {
    // Reset game variables
    bitcoin.x = canvas.width * 0.1;
    bitcoin.y = canvas.height / 2;
    bitcoin.velocity = 0;
    obstacles = [];
    frames = 0;
    score = 0;
    gameState = 'playing';
  }

// Start the game
bitcoinImg.onload = () => {
  moneyStackImg.onload = () => {
    initGame();
    update();
  };
};