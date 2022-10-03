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
  x: null,
  y: null,
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
const escapedBrickPoints = 1 // points earned when a brick falls to the ground
const hitBrickPoints = 3 // points earned when a shot hits a brick
const levelLength = 10 // in seconds
const soundFiles = {
  brickGone: 'brick_hit_ground.wav',
  shootShot: 'shot.wav',
  brickDestroyed: 'beep.wav',
  levelUp: 'next_level.wav',
  gameOver: 'game_over.wav'
}
const soundFilePath = 'https://github.com/eanugent/computer-programming-basics/raw/main/assets/'

let context
let gameBackgroundColor
let avatarMoveDirection // -1 for left, 0 for not moving, 1 for right
let level = 1
let brickInterval
let levelInterval
let score = 0

let running = false

function initialize(){
  let canvas = document.querySelector('.game-canvas')
  
  canvas.setAttribute('width', screenWidth);
  canvas.setAttribute('height', screenHeight);

  levelSpan = document.querySelector('#levelLength')
  levelSpan.innerHTML = levelLength
  
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
  avatarMoveDirection = 0
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
  if(time < 100)
    time = 100
  brickInterval = window.setTimeout(() => addbrick(), time)
}

function addShot(){
  if(!running || shots.length >= maxShots)
    return

  const newShot = {
    x: avatar.x + (brickWidth / 2),
    y: avatar.y,
    width: shotWidth,
    height: shotHeight
  }

  shots.push(newShot)
  playSound(soundFiles.shootShot)
}

function clearRect(brick){
  context.clearRect(
    brick.x,
    brick.y,
    brick.width,
    brick.height
    )
}

function drawRect(brick){
  context.fillStyle = brick.color
  context.fillRect(
    brick.x,
    brick.y,
    brick.width,
    brick.height
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

function drawTriangle(a, b, c, color){
  context.beginPath();
  context.moveTo(a.x, a.y)
  context.lineTo(b.x, b.y)
  context.lineTo(c.x, c.y)
  context.closePath()
  context.fillStyle = color
  context.fill()
}

function clearShot(shot){
  context.clearRect(
    shot.x,
    shot.y,
    shot.width,
    shot.height
  )
}

function drawShot(shot){
  context.fillStyle = shotColor
  context.fillRect(
    shot.x,
    shot.y,
    shot.width,
    shot.height
  )
}

function brickHitAvatar(brick){
  const xInRange = brick.x >= (avatar.x - brick.width) && brick.x <= (avatar.x + brick.width)
  const yInRange = brick.y >= (avatar.y - brick.height) && brick.y <= (avatar.y + brick.height)

  return xInRange && yInRange
}

function shotHitBrick(brick){
  let shotHitIndex = -1
  for(let i=0; i < shots.length; i++){
    const shot = shots[i]
    xInRange = shot.x >= brick.x && shot.x <= (brick.x + brick.width)
    yInRange = shot.y <= (brick.y + brick.height)

    if(xInRange && yInRange){
      clearShot(shots[i])
      shotHitIndex = i
      break
    }
  }

  if(shotHitIndex >= 0){    
    shots.splice(shotHitIndex, 1)
    return true
  }
  return false
}

function redrawScreen(){
  if(!running)
    return

  redrawAvatar()
  redrawbricks()
  redrawShots()

  window.requestAnimationFrame(() => this.redrawScreen());
}

function redrawAvatar(){
  clearRect(avatar)

  avatar.x += avatarMoveDirection * avatarMoveIncrement
  avatar.x = Math.min(avatar.x, screenWidth - avatar.width) // not too far right
  avatar.x = Math.max(0, avatar.x) // not too far left

  drawRect(avatar)

  dipXIncrement = (avatar.width / 4) 
  dipY = avatar.y + (avatar.height / 3)

  drawTriangle(
    {x: avatar.x, y: avatar.y},
    {x: avatar.x + dipXIncrement, y: dipY},
    {x: avatar.x + (2*dipXIncrement), y: avatar.y},
    gameBackgroundColor
  )

  drawTriangle(
    {x: avatar.x + (2*dipXIncrement), y: avatar.y},
    {x: avatar.x + (3*dipXIncrement), y: dipY},
    {x: avatar.x + avatar.width, y: avatar.y},
    gameBackgroundColor
  )
  
}

function redrawbricks(){
  const bricksToRemove = []
  for(let i = 0; i < bricks.length; i++){
    const brick = bricks[i];

    if(brickHitAvatar(brick)){
      endGame()
      return
    }

    clearRect(brick);

    if(shotHitBrick(brick)){
      playSound(soundFiles.brickDestroyed)
      const newScore = score + hitBrickPoints
      setScore(newScore)
      bricksToRemove.push(i)
    }
    else if(brick.y >= screenHeight){
      playSound(soundFiles.brickGone)
      const newScore = score + escapedBrickPoints
      setScore(newScore)
      bricksToRemove.push(i)
    }
    else{
      brick.y += brickMoveIncrement
    }
  }

  // Remove Bricks
  for(let i = 0; i < bricksToRemove.length; i ++){
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
    clearShot(shot)
    if(shot.y < 0){
      shotsToRemove.push(i)
    }
    else{
      shot.y -= shotMoveIncrement
      drawShot(shot)
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
      avatarMoveDirection = 1
      break
    case 'ArrowLeft':
      avatarMoveDirection = -1
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
      if(avatarMoveDirection == 1)
        avatarMoveDirection = 0;
      break
    case 'ArrowLeft':
      if(avatarMoveDirection == -1)
        avatarMoveDirection = 0;
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