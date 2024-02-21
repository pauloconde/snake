
const BLOCK_SIZE = 20
const BOARD_WIDTH = 30
const BOARD_HEIGHT = 30

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

console.log(canvas)

const DIRECTIONS = {
  UP: 0,
  DOWN: 1,
  RIGHT: 2,
  LEFT: 3
}

const CENTER_X = Math.floor(canvas.width)
const CENTER_Y = Math.floor(canvas.height)

const snake = {
  //Initialization
  size: 1,
  direction: DIRECTIONS.RIGHT,
  body: [ //First block
    {
      x: CENTER_X,
      y: CENTER_Y
    }
  ],
  move: function () {
    this.grow() //Add block at the beggining
    this.body.pop() //Remove last block
  },
  grow: function () {
    //Add block at the beggining
    const newX = this.body[0].x + this.direction === DIRECTIONS.RIGHT ? 1 : this.direction === DIRECTIONS.LEFT ? -1 : 0
    const newY = this.body[0].y + this.direction === DIRECTIONS.DOWN ? 1 : this.direction === DIRECTIONS.UP ? -1 : 0

    this.body.unshift(
      {
        x: newX,
        y: newY
      }
    )
  },
  draw: function () {

  }
}