const BLOCK_SIZE = 12;
const BOARD_WIDTH = 64;
const BOARD_HEIGHT = 64;

// speed
const FPS = 5;

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

function cleanCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMeal() {}

function checkCollisions() {
  //Border collisions
  if (
    snake.body[0].x >= BOARD_WIDTH ||
    snake.body[0].x <= -1
  ) {
    return true;
  } else if (
    snake.body[0].y >= BOARD_HEIGHT ||
    snake.body[0].y <= -1
  ) {
    return true;
  }

  const _withoutHead = [].concat(snake.body);
  const _head = _withoutHead.shift();

  let _collision = false;

  _withoutHead.forEach(({ x, y }) => {
    if (x === _head.x && y === _head.y) {
      _collision = true;
      snake.init();
    }
  });

  //console.log(_collision)
  return _collision;
}

function gameOver() {
  snake.init();
  temp = 0;
}

let msPrev = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / FPS;
let frames = 0;
let framesPerSec = FPS;

let temp = 0;

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

  

  //game
  cleanCanvas();

  if (temp < 20) {
    snake.grow();
  } else {
    snake.move();
  }
  temp++;
  snake.draw();

  if (checkCollisions()) {
    //restart game
    gameOver();
  }
}

//Keyboard control
function initEvents() {
  document.addEventListener("keydown", keyDownHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      snake.direction = DIRECTIONS.RIGHT;
    } else if (key === "Left" || key === "ArrowLeft") {
      snake.direction = DIRECTIONS.LEFT;
    } else if (key === "Up" || key === "ArrowUp") {
      snake.direction = DIRECTIONS.UP;
    } else if (key === "Down" || key === "ArrowDown") {
      snake.direction = DIRECTIONS.DOWN;
    }
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
snake.init();
game();
initEvents();
