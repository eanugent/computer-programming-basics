const screenHeight = 500
const screenWidth = 500
const avatarWidth = 50
const avatarHeight = 20
const brickWidth = 50
const brickHeight = 25
const brickHoleSize = brickWidth / 16
const avatarMoveIncrement = 5
const avatarColor = '#FFD733'

const moveDirections = {
  left: -1,
  none: 0,
  right: 1
}

const avatar = {
  x: 0,
  y: 0,
  width: avatarWidth,
  height: avatarHeight,
  color: avatarColor,
  moveDirections: moveDirections.none
}

const brickMoveIncrement = 5
const bricks = []
const brickColor = '#ca6843'
const shots = []
const shotWidth = 2
const shotHeight = 7
const shotColor = 'black'
const shotMoveIncrement = 5
const maxShots = 3 // Maximum shots shot at a time
const dodgedBrickPoints = 1 // points earned when a brick falls to the ground
const hitBrickPoints = 3 // points earned when a shot hits a brick
const levelLength = 10 // in seconds
const soundFiles = {
  brickGone: 'brick_hit_ground.wav',
  shootShot: 'shot.wav',
  brickBusted: 'brick_busted.wav',
  levelUp: 'next_level.wav',
  gameOver: 'game_over.wav'
}

const localFilePath = './'
const remoteFilePath = 'https://cdn.jsdelivr.net/gh/eanugent/computer-programming-basics@v0.2.1/assets/'
const soundFilePath = remoteFilePath // Change this to localFilePath to use your own files

let context
let gameBackgroundColor
let level = 1
let newBrickTimer
let levelInterval
let score = 0

let running = false

/**
 * Called once to setup the initial state of the game 
 */
function initialize() {
  // Setup the ability to draw to the screen
  let canvas = document.querySelector('.game-canvas')
  canvas.setAttribute('width', screenWidth)
  canvas.setAttribute('height', screenHeight)
  gameBackgroundColor = getComputedStyle(canvas)['background-color']
  context = canvas.getContext('2d')

  // Display the length of each level
  document.querySelector('#levelLength').innerHTML = levelLength

  // Specify the functions that will be called when keydown and keyup events occur
  document.addEventListener('keydown', keyDown)
  document.addEventListener('keyup', keyUp)
}

/**
 * Sets up and starts a new game
 */
function newGame() {
  bricks.length = 0
  shots.length = 0

  avatar.x = 0
  avatar.y = screenHeight - avatar.height
  avatar.moveDirection = moveDirections.none

  setLevel(1)
  setScore(0)

  // Clear the game screen
  context.clearRect(0, 0, screenWidth, screenHeight)

  running = true

  // Starts the game loop
  redrawScreen()

  // Clear newBrickTimer if it exists
  if (newBrickTimer) {
    window.clearInterval(newBrickTimer)
  }

  // Set the newBrickTimer to 1 second
  newBrickTimer = window.setTimeout(addBrick, 1000)

  // Clear levelInterval if it exists
  if (levelInterval) {
    window.clearInterval(levelInterval)
  }

  // Set levelInterval to increase the level based on levelLength
  levelInterval = window.setInterval(nextLevel, levelLength * 1000)
}

/**
 * Stops the game loop
 */
function endGame() {
  playSound(soundFiles.gameOver)

  // Set running to false to stop the game loop
  running = false

  // Stop levelInterval
  window.clearInterval(levelInterval)
}

/**
 * Create and add a brick to the bricks array
 */
function addBrick() {
  if (!running) {
    return
  }

  // Create a new brick with a random x value
  const newBrick = {
    x: Math.floor(Math.random() * (screenWidth - brickWidth)),
    y: 0,
    width: brickWidth,
    height: brickHeight,
    color: brickColor
  }

  // Add the new brick to the bricks array
  bricks.push(newBrick)

  // Set the next time a new brick should be added
  newBrickTimer = window.setTimeout(addBrick, calculateNextBrickTime())
}

/**
 * Calculate the time for the next new brick based on the current level
 * @returns {number} The time for the next brick, in milliseconds
 */
function calculateNextBrickTime() {
  let time = 1066 - (66 * level)
  return Math.max(100, time)
}

/**
 * Create and add a new shot to the shots array
 */
function addShot() {
  if (!running || shots.length >= maxShots)
    return

  // Create a new shot above the middle of the avatar
  const newShot = {
    x: avatar.x + (brickWidth / 2),
    y: avatar.y,
    width: shotWidth,
    height: shotHeight,
    color: shotColor
  }

  // Add the new shot to the shots array
  shots.push(newShot)

  playSound(soundFiles.shootShot)
}

/**
 * Clears rectangular area
 * @param {object} rect - The location and dimensions of the rectangular area to clear
 */
function clearRect(rect) {
  context.clearRect(
    rect.x,
    rect.y,
    rect.width,
    rect.height
  )
}

/**
 * Draws a rectangle
 * @param {object} rect - The color, location, and dimensions of the rectangle
 */
function drawRect(rect) {
  context.fillStyle = rect.color
  context.fillRect(
    rect.x,
    rect.y,
    rect.width,
    rect.height
  )
}

/**
 * Draws a circle
 * @param {object} circle - The color, location, and dimensions of the circle
 */
function drawCirlce(circle) {
  context.fillStyle = circle.color
  context.beginPath()
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
  context.fill()
}

/**
 * Draws a brick
 * @param {object} brick - The color, location, and dimensions of the brick
 */
function drawBrick(brick) {
  drawRect(brick)

  leftHole = {
    x: brick.x + (2 * brickHoleSize),
    y: brick.y + (brick.height / 2),
    radius: brickHoleSize,
    color: 'white'
  }

  rightHole = {
    ...leftHole,
    x: brick.x + brick.width - (brickHoleSize * 2)
  }

  middleHole = {
    ...leftHole,
    x: (leftHole.x + rightHole.x) / 2
  }

  drawCirlce(leftHole)
  drawCirlce(rightHole)
  drawCirlce(middleHole)
}

/**
 * Draws a triangle
 * @param {object} triangle - The color and 3 points (a, b, & c) of the triangle
 */
function drawTriangle(triangle) {
  context.beginPath()
  context.moveTo(triangle.a.x, triangle.a.y)
  context.lineTo(triangle.b.x, triangle.b.y)
  context.lineTo(triangle.c.x, triangle.c.y)
  context.closePath()
  context.fillStyle = triangle.color
  context.fill()
}

/**
 * Whether the given brick overlaps the avatar's current position
 * @param {object} brick - The dimensions of the brick to test 
 * @returns {boolean} true if the brick hit the avatar
 */
function brickHitAvatar(brick) {
  const xInRange = brick.x >= (avatar.x - brick.width) && brick.x <= (avatar.x + brick.width)
  const yInRange = brick.y >= (avatar.y - brick.height) && brick.y <= (avatar.y + brick.height)

  return xInRange && yInRange
}

/**
 * @param {object} brick - The dimensions of the brick to test
 * @returns {number} The index in the shot array of the shot that hit the brick, if any. Otherwise, -1 
 */
function shotIndexThatHitBrick(brick) {
  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i]
    xInRange = shot.x >= (brick.x - shot.width) && shot.x <= (brick.x + brick.width)
    yInRange = shot.y <= (brick.y + brick.height)

    if (xInRange && yInRange) {
      return i
    }
  }

  return -1
}

/**
 * Draws the avatar, bricks, and shots in their updated positions
 */
function redrawScreen() {
  if (running) {
    redrawAvatar()
    redrawBricks()
    redrawShots()

    /*
    * Every time the screen is refreshed (usually 60 times per second), 
    * the redrawScreen() function will be called
    */
    window.requestAnimationFrame(redrawScreen)
  }
}

function redrawAvatar() {
  clearRect(avatar)

  /*
  * If the avatar has a moveDirection value (see keyDown()/keyUp()), move it
  * that direction based on the avatarMoveIncrement
  */
  avatar.x += avatar.moveDirection * avatarMoveIncrement
  avatar.x = Math.min(avatar.x, screenWidth - avatar.width) // not too far right
  avatar.x = Math.max(0, avatar.x) // not too far left

  // Draw the avatar as a rectangle
  drawRect(avatar)

  // Draw two triangles in the background color on top of the avatar
  dipXIncrement = (avatar.width / 4)
  dipY = avatar.y + (avatar.height / 3)

  leftTriangle = {
    a: { x: avatar.x, y: avatar.y },
    b: { x: avatar.x + dipXIncrement, y: dipY },
    c: { x: avatar.x + (2 * dipXIncrement), y: avatar.y },
    color: gameBackgroundColor
  }

  rightTriangle = {
    a: { x: avatar.x + (2 * dipXIncrement), y: avatar.y },
    b: { x: avatar.x + (3 * dipXIncrement), y: dipY },
    c: { x: avatar.x + avatar.width, y: avatar.y },
    color: gameBackgroundColor
  }

  drawTriangle(leftTriangle)
  drawTriangle(rightTriangle)
}

function redrawBricks() {
  // An array to hold the indices of the bricks that were shot or dodged
  const bricksToRemove = []

  // Process each brick
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i]

    if (brickHitAvatar(brick)) {
      endGame()
      return
    }

    clearRect(brick)

    shotHitBrickIndex = shotIndexThatHitBrick(brick)
    if (shotHitBrickIndex > -1) { // The brick was shot
      playSound(soundFiles.brickBusted)

      clearRect(shots[shotHitBrickIndex])
      shots.splice(shotHitBrickIndex, 1)

      const newScore = score + hitBrickPoints
      setScore(newScore)

      bricksToRemove.push(i)
    }
    else if (brick.y >= screenHeight) { // The brick was dodged
      playSound(soundFiles.brickGone)

      const newScore = score + dodgedBrickPoints
      setScore(newScore)

      bricksToRemove.push(i)
    }
    else { // The brick needs to move further down the screen
      brick.y += brickMoveIncrement
    }
  }

  // Remove bricks that were shot or dodged
  for (let i = 0; i < bricksToRemove.length; i++) {
    bricks.splice(bricksToRemove[i], 1)
  }

  // Draw remaining bricks
  for (let i = 0; i < bricks.length; i++) {
    drawBrick(bricks[i])
  }
}

function redrawShots() {
  // An array to hold the indices of shots that are off the screen
  const shotsToRemove = []

  // Process each shot
  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i]

    clearRect(shot)

    if (shot.y < 0) { // Shot is off the screen
      shotsToRemove.push(i)
    }
    else { // The shot needs to move further up the screen
      shot.y -= shotMoveIncrement
      drawRect(shot)
    }
  }

  // Remove shots that are off the screen (shots that hit bricks are handled in redrawBricks())
  for (let i = 0; i < shotsToRemove.length; i++) {
    shots.splice(shotsToRemove[i], 1)
  }
}

function setScore(newScore) {
  score = newScore
  document.getElementById('spScore').innerHTML = score
}

function nextLevel() {
  setLevel(level + 1)
  playSound(soundFiles.levelUp)
}

function setLevel(newLevel) {
  level = newLevel
  document.getElementById('spLevel').innerHTML = level
}

function playSound(filename) {
  var audio = new Audio(soundFilePath + filename)
  audio.play()
}

/**
 * Called whenever a key on the keyboard is pressed down
 */
function keyDown(ev) {
  if (ev.defaultPrevented)
    return

  if (ev.key === 'ArrowRight') {
    avatar.moveDirection = moveDirections.right
  } else if (ev.key === 'ArrowLeft') {
    avatar.moveDirection = moveDirections.left
  } else if (ev.key === 'Enter') {
    if (!running) {
      newGame()
    }
  }
}

/**
 * Called whenever a key on the keyboard is released
 */
function keyUp(ev) {
  if (ev.defaultPrevented)
    return

  if (ev.key === 'ArrowRight') {
    if (avatar.moveDirection === moveDirections.right) {
      avatar.moveDirection = moveDirections.none
    }
  } else if (ev.key === 'ArrowLeft') {
    if (avatar.moveDirection === moveDirections.left) {
      avatar.moveDirection = moveDirections.none
    }
  } else if (ev.key === ' ') { // Spacebar
    addShot()
  }
}

// Call the initialize() function when the page is loaded
window.onload = initialize