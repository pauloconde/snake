const BLOCK_SIZE = 12;
const BOARD_WIDTH = 64;
const BOARD_HEIGHT = 64;

const sound = document.getElementById("beep");

// speed
const FPS = 15;

let isPlaying = false;
let firstTime = true;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

const DIRECTIONS = {
  UP: {
    x: 0,
    y: -1,
  },
  DOWN: {
    x: 0,
    y: 1,
  },
  RIGHT: {
    x: 1,
    y: 0,
  },
  LEFT: {
    x: -1,
    y: 0,
  },
};

const CENTER_X = Math.floor(BOARD_WIDTH / 2) - 1;
const CENTER_Y = Math.floor(BOARD_HEIGHT / 2) - 1;

let snake = {
  move: function () {
    this.grow(); //Add block at the beggining
    this.body.pop(); //Remove last block
  },
  grow: function () {
    //Add block at the begining
    const _newX = this.body[0].x + this.direction.x;
    const _newY = this.body[0].y + this.direction.y;

    this.body.unshift({
      x: _newX,
      y: _newY,
    });
    this.size++;
  },
  draw: function () {
    context.beginPath();
    context.fillStyle = "#fff";
    this.body.forEach(({ x, y }) => {
      context.fillRect(x, y, 1, 1);
    });
    context.closePath();
  },
  init: function () {
    this.size = 1;
    this.direction = DIRECTIONS.RIGHT;
    this.body = [
      {
        x: CENTER_X,
        y: CENTER_Y,
      },
    ];
  },
};

let meal = {
  x: 0,
  y: 0,
  new: function () {
    let _occupedPosition = true;

    while (_occupedPosition) {
      this.x = Math.floor(Math.random() * BOARD_WIDTH);
      this.y = Math.floor(Math.random() * BOARD_HEIGHT);
      _occupedPosition = snake.body.some(({ xx, yy }) => {
        return xx === this.x && yy === this.y;
      });
    }
  },
  draw: function () {
    context.beginPath();
    context.fillStyle = "#f7845b";
    context.arc(this.x + 0.5, this.y + 0.5, 0.5, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  },
};

function startMessage() {
  context.beginPath();
  context.fillStyle = "#ccc";
  context.textAlign = "center";
  context.fillText("Press SPACE to start", BOARD_WIDTH / 2, BOARD_HEIGHT / 2);
  context.closePath();
}
function gameOverMessage() {
  context.beginPath();
  context.fillStyle = "#333";
  context.textAlign = "center";
  context.fillText("GAME OVER", BOARD_WIDTH / 2, BOARD_HEIGHT / 2 - 4);
  context.closePath();
}

function checkEat() {
  if (snake.body[0].x === meal.x && snake.body[0].y === meal.y) {
    meal.new();
    snake.grow();
  }
}

function checkCollisions() {
  //Border collisions
  if (snake.body[0].x >= BOARD_WIDTH || snake.body[0].x <= -1) {
    return true;
  } else if (snake.body[0].y >= BOARD_HEIGHT || snake.body[0].y <= -1) {
    return true;
  }

  const _withoutHead = [].concat(snake.body);
  const _head = _withoutHead.shift();

  return _withoutHead.some(({ x, y }) => {
    return x === _head.x && y === _head.y;
  });
}

function beep() {
  sound.play();
}

function gameOver() {
  beep();
  firstTime = false;
  isPlaying = false;
}

function cleanCanvas() {
  context.font = "bold 3px sans-serif";
  context.clearRect(0, 0, canvas.width, canvas.height);
}

let msPrev = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / FPS;
let frames = 0;
let framesPerSec = FPS;

function game() {
  //regresh rate
  window.requestAnimationFrame(game);

  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  if (msPassed < msPerFrame) return;

  const excessTime = msPassed % msPerFrame;
  msPrev = msNow - excessTime;

  frames++;

  if (msFPSPrev < msNow) {
    msFPSPrev = window.performance.now() + 1000;
    framesPerSec = frames;
    frames = 0;
  }
  cleanCanvas();

  if (isPlaying) {
    //game
    snake.draw();
    meal.draw();
    snake.move();
    checkEat();

    if (checkCollisions()) {
      gameOver();
    }
  } else {
    startMessage();
    if (!firstTime) gameOverMessage();
  }
}

//Keyboard control
function initEvents() {
  document.addEventListener("keydown", keyDownHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      if (snake.direction != DIRECTIONS.LEFT) {
        snake.direction = DIRECTIONS.RIGHT;
      }
    } else if (key === "Left" || key === "ArrowLeft") {
      if (snake.direction != DIRECTIONS.RIGHT) {
        snake.direction = DIRECTIONS.LEFT;
      }
    } else if (key === "Up" || key === "ArrowUp") {
      if (snake.direction != DIRECTIONS.DOWN) {
        snake.direction = DIRECTIONS.UP;
      }
    } else if (key === "Down" || key === "ArrowDown") {
      if (snake.direction != DIRECTIONS.UP) {
        snake.direction = DIRECTIONS.DOWN;
      }
    } else if (key === " ") {
      meal.new();
      snake.init();
      isPlaying = true;
    }
    console.log(key);
  }
}

//Prevent scrollbar movement with arrow keys
document.onkeydown = function (elEvento) {
  var evento = elEvento || window.event;
  var codigo = evento.keyCode;
  if (codigo > 36 && codigo < 41) {
    //Flechas
    return false;
  }
};

//Start game
startMessage();
snake.init();
meal.new();
initEvents();
game();
