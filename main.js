const BLOCK_SIZE = 20;
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 32;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

console.log(canvas);

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

const CENTER_X = Math.floor(BOARD_WIDTH / 2)-1;
const CENTER_Y = Math.floor(BOARD_HEIGHT/ 2)-1;

let snake = {
    //Initialization
    size: 1,
    direction: DIRECTIONS.RIGHT,
    body: [
        //First block
        {
            x: CENTER_X,
            y: CENTER_Y,
        }
    ],
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
    },
    draw: function () {
        context.beginPath();
        context.fillStyle = "#fff";
        this.body.forEach(({x,y})=>{
            context.fillRect(x, y, 1, 1);
        })
        context.closePath();
    },
};

function cleanCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

// speed of render
const fps = 5;

let msPrev = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / fps;
let frames = 0;
let framesPerSec = fps;

function game() {
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
    // hay que dibujar los elementos
    snake.draw();
    snake.grow()
}

function initEvents() {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(event) {
        const { key } = event;
        if (key === "Right" || key === "ArrowRight") {
            snake.direction = DIRECTIONS.RIGHT
        } else if (key === "Left" || key === "ArrowLeft") {
            snake.direction = DIRECTIONS.LEFT
        } else if (key === "Up" || key === "ArrowUp") {
            snake.direction = DIRECTIONS.UP
        } else if (key === "Down" || key === "ArrowDown") {
            snake.direction = DIRECTIONS.DOWN
        }
    }
}

game();
initEvents();
