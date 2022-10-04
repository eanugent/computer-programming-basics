const screenHeight = 500
const screenWidth = 500
const avatarWidth = 50
const avatarHeight = 20
const brickWidth = 50
const brickHeight = 25
const brickHoleSize = brickWidth / 16
const avatarMoveIncrement = 5
const avatarColor = '#FFD733'
const avatar = {
  x: 0,
  y: 0,
  width: avatarWidth,
  height: avatarHeight,
  color: avatarColor
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
const remoteFilePath = 'https://github.com/eanugent/computer-programming-basics/raw/main/assets/'
const soundFilePath = localFilePath // Change this to localFilePath to use your own files

let context
let gameBackgroundColor
let avatarMoveDirection
const moveDirections = {
  left: -1, 
  none: 0,
  right: 1
}
let level = 1
let brickInterval
let levelInterval
let score = 0

let running = false

function initialize(){
  let canvas = document.querySelector('.game-canvas')
  
  canvas.setAttribute('width', screenWidth);
  canvas.setAttribute('height', screenHeight);

  document.querySelector('#levelLength').innerHTML =levelLength
  
  gameBackgroundColor = getComputedStyle(canvas)['background-color']
  
  context = canvas.getContext('2d')

  document.addEventListener('keydown', (e) => keyDown(e));
  document.addEventListener('keyup', (e) => keyUp (e));
}

function newGame(){
  bricks.length = 0
  shots.length = 0
  avatar.x = 0
  avatar.y = screenHeight - avatar.height
  avatarMoveDirection = moveDirections.none
  setLevel(1)
  setScore(0)
  
  context.clearRect(0,0,screenWidth,screenHeight)

  running = true;
  redrawScreen();
  if(brickInterval)
			window.clearInterval(brickInterval);

	brickInterval = window.setTimeout(() => addbrick(), 1000);

  if(levelInterval)
			window.clearInterval(levelInterval)

  levelInterval = window.setInterval(() => {
    setLevel(level + 1)
    playSound(soundFiles.levelUp)
  }, levelLength * 1000)
}

function endGame(){
  playSound(soundFiles.gameOver)
  running = false
  window.clearInterval(levelInterval)
}

function addbrick(){
  if(!running)
	  return

  const newBrick = {
    x: Math.floor(Math.random() * (screenWidth - brickWidth)),
    y: 0,
    width: brickWidth,
    height: brickHeight,
    color: brickColor
  }

  bricks.push(newBrick)
  let time = 1066 - (66 * level)
  time = Math.max(100, time)

  brickInterval = window.setTimeout(() => addbrick(), time)
}

function addShot(){
  if(!running || shots.length >= maxShots)
    return

  const newShot = {
    x: avatar.x + (brickWidth / 2),
    y: avatar.y,
    width: shotWidth,
    height: shotHeight,
    color: shotColor
  }

  shots.push(newShot)
  playSound(soundFiles.shootShot)
}

function clearRect(rect){
  context.clearRect(
    rect.x,
    rect.y,
    rect.width,
    rect.height
    )
}

function drawRect(rect){
  context.fillStyle = rect.color
  context.fillRect(
    rect.x,
    rect.y,
    rect.width,
    rect.height
  )
}

function drawCirlce(circle){
  context.fillStyle = circle.color
  context.beginPath();
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  context.fill();
}

function drawBrick(brick){
  drawRect(brick)
  
  leftHole = {
    x: brick.x + (2*brickHoleSize),
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

function drawTriangle(triangle){
  context.beginPath();
  context.moveTo(triangle.a.x, triangle.a.y)
  context.lineTo(triangle.b.x, triangle.b.y)
  context.lineTo(triangle.c.x, triangle.c.y)
  context.closePath()
  context.fillStyle = triangle.color
  context.fill()
}

function brickHitAvatar(brick){
  const xInRange = brick.x >= (avatar.x - brick.width) && brick.x <= (avatar.x + brick.width)
  const yInRange = brick.y >= (avatar.y - brick.height) && brick.y <= (avatar.y + brick.height)

  return xInRange && yInRange
}

function shotIndexThatHitBrick(brick){
  for(let i=0; i < shots.length; i++){
    const shot = shots[i]
    xInRange = shot.x >= (brick.x - shot.width) && shot.x <= (brick.x + brick.width)
    yInRange = shot.y <= (brick.y + brick.height)

    if(xInRange && yInRange){
      return i
    }
  }

  return -1    
}

function redrawScreen(){
  if(running){
    redrawAvatar()
    redrawBricks()
    redrawShots()
  
    window.requestAnimationFrame(() => this.redrawScreen());  
  }
}

function redrawAvatar(){
  clearRect(avatar)

  avatar.x += avatarMoveDirection * avatarMoveIncrement
  avatar.x = Math.min(avatar.x, screenWidth - avatar.width) // not too far right
  avatar.x = Math.max(0, avatar.x) // not too far left

  drawRect(avatar)

  dipXIncrement = (avatar.width / 4) 
  dipY = avatar.y + (avatar.height / 3)

  leftTriangle = {
    a: {x: avatar.x, y: avatar.y},
    b: {x: avatar.x + dipXIncrement, y: dipY},
    c: {x: avatar.x + (2*dipXIncrement), y: avatar.y},
    color: gameBackgroundColor
  }

  rightTriangle = {
    a: {x: avatar.x + (2*dipXIncrement), y: avatar.y},
    b: {x: avatar.x + (3*dipXIncrement), y: dipY},
    c: {x: avatar.x + avatar.width, y: avatar.y},
    color: gameBackgroundColor
  }

  drawTriangle(leftTriangle)
  drawTriangle(rightTriangle)
}

function redrawBricks(){
  const bricksToRemove = []
  for(let i = 0; i < bricks.length; i++){
    const brick = bricks[i];

    if(brickHitAvatar(brick)){
      endGame()
      return
    }

    clearRect(brick);

    shotHitBrickIndex = shotIndexThatHitBrick(brick)
    if(shotHitBrickIndex > -1){
      playSound(soundFiles.brickBusted)

      clearRect(shots[shotHitBrickIndex])
      shots.splice(shotHitBrickIndex, 1)

      const newScore = score + hitBrickPoints
      setScore(newScore)

      bricksToRemove.push(i)
    }
    else if(brick.y >= screenHeight){
      playSound(soundFiles.brickGone)

      const newScore = score + dodgedBrickPoints
      setScore(newScore)

      bricksToRemove.push(i)
    }
    else{
      brick.y += brickMoveIncrement
    }
  }

  // Remove Bricks
  for(let i = 0; i < bricksToRemove.length; i++){
    bricks.splice(bricksToRemove[i], 1)
  }

  // Draw Bricks
  for(let i = 0; i < bricks.length; i++){
    drawBrick(bricks[i])
  }
}

function redrawShots(){
  const shotsToRemove = []
  for(let i=0; i < shots.length; i++){
    const shot = shots[i]
    clearRect(shot)
    if(shot.y < 0){
      shotsToRemove.push(i)
    }
    else{
      shot.y -= shotMoveIncrement
      drawRect(shot)
    }    
  }

  for(let i=0; i < shotsToRemove.length; i++){
    shots.splice(shotsToRemove[i], 1)
  }
}

function setScore(newScore){
  score = newScore
  document.getElementById('spScore').innerHTML = score;
}

function setLevel(newLevel){
  level = newLevel
  document.getElementById('spLevel').innerHTML = level;
}

function playSound(filename){
  var audio = new Audio(soundFilePath + filename);
  audio.play();
}

function keyDown(ev){
  if(ev.defaultPrevented)
    return
  
  switch(ev.key){
    case 'ArrowRight':
      avatarMoveDirection = moveDirections.right
      break
    case 'ArrowLeft':
      avatarMoveDirection = moveDirections.left
      break
    case 'Enter':
      if(!running)
        newGame()
      break
    default:
      return
  }
}

function keyUp(ev){
  if(ev.defaultPrevented)
    return
  
  switch(ev.key){
    case 'ArrowRight':
      if(avatarMoveDirection == moveDirections.right)
        avatarMoveDirection = moveDirections.none;
      break
    case 'ArrowLeft':
      if(avatarMoveDirection == moveDirections.left)
        avatarMoveDirection = moveDirections.none;
      break
    case 'ArrowUp':
      addShot()
      break
    default:
      return
  }
}

window.onload = function(){
  initialize() 
}