const avatarWidth = 50
const avatarHeight = 20
const fallingBlockWidth = 50
const fallingBlockHeight = 25
const brickHoleSize = fallingBlockWidth / 16
const avatarMoveIncrement = 5
const avatarColor = '#FFD733'
const avatar = {
  x: null,
  y: null,
  width: avatarWidth,
  height: avatarHeight,
  color: avatarColor
}
const fallingBlockMoveIncrement = 5
const fallingBlocks = []
const fallingBlockColor = '#ca6843'
const needles = []
const needleWidth = 2
const needleHeight = 7
const needleColor = 'black'
const needleMoveIncrement = 5
const maxNeedles = 3 // Maximum needles shot at a time
const escapedBlockPoints = 1 // points earned when a block falls to the ground
const hitBlockPoints = 3 // points earned when a needle hits a block
const levelLength = 10 // in seconds
const soundFiles = {
  blockGone: 'block_hit_ground.wav',
  shootNeedle: 'shoot_needle.wav',
  blockDestroyed: 'beep.wav',
  levelUp: 'next_level.wav',
  gameOver: 'game_over.wav'
}

let context
let screenHeight
let screenWidth
let gameBackgroundColor
let avatarMoveDirection // -1 for left, 0 for not moving, 1 for right
let level = 1
let blockInterval
let levelInterval
let score = 0

let running = false

function initialize(){
  let canvas = document.querySelector('#playarea')
  
  gameBackgroundColor = getComputedStyle(canvas)['background-color']
  screenHeight = canvas.clientHeight;
  screenWidth = canvas.clientWidth;
  
  context = canvas.getContext('2d')

  document.addEventListener('keydown', (e) => keyDown(e));
  document.addEventListener('keyup', (e) => keyUp (e));
}

function newGame(){
  fallingBlocks.length = 0
  needles.length = 0
  avatar.x = 0
  avatar.y = screenHeight - avatar.height
  avatarMoveDirection = 0
  setLevel(1)
  setScore(0)
  
  context.clearRect(0,0,screenWidth,screenHeight)
  running = true;
  redrawScreen();
  if(blockInterval)
			window.clearInterval(blockInterval);

	blockInterval = window.setTimeout(() => addFallingBlock(), 1000);

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

function addFallingBlock(){
  if(!running)
	  return

  const newBlock = {
    x: Math.floor(Math.random() * (screenWidth - fallingBlockWidth)),
    y: 0,
    width: fallingBlockWidth,
    height: fallingBlockHeight,
    color: fallingBlockColor
  }

  fallingBlocks.push(newBlock)
  let time = 1066 - (66 * level)
  if(time < 100)
    time = 100
  blockInterval = window.setTimeout(() => addFallingBlock(), time)
}

function addNeedle(){
  if(!running || needles.length >= maxNeedles)
    return

  const newNeedle = {
    x: avatar.x + (fallingBlockWidth / 2),
    y: avatar.y,
    width: needleWidth,
    height: needleHeight
  }

  needles.push(newNeedle)
  playSound(soundFiles.shootNeedle)
}

function clearBlock(block){
  context.clearRect(
    block.x,
    block.y,
    block.width,
    block.height
    )
}

function drawBlock(block){
  context.fillStyle = block.color
  context.fillRect(
    block.x,
    block.y,
    block.width,
    block.height
  )
}

function drawCirlce(circle){
  context.fillStyle = circle.color
  context.beginPath();
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  context.fill();
}

function drawBrick(brick){
  drawBlock(brick)
  
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

function clearNeedle(needle){
  context.clearRect(
    needle.x,
    needle.y,
    needle.width,
    needle.height
  )
}

function drawNeedle(needle){
  context.fillStyle = needleColor
  context.fillRect(
    needle.x,
    needle.y,
    needle.width,
    needle.height
  )
}

function blockHitAvatar(block){
  const xInRange = block.x >= (avatar.x - block.width) && block.x <= (avatar.x + block.width)
  const yInRange = block.y >= (avatar.y - block.height) && block.y <= (avatar.y + block.height)

  return xInRange && yInRange
}

function needleHitBlock(block){
  let needleHitIndex = -1
  for(let i=0; i < needles.length; i++){
    const needle = needles[i]
    xInRange = needle.x >= block.x && needle.x <= (block.x + block.width)
    yInRange = needle.y <= (block.y + block.height)

    if(xInRange && yInRange){
      clearNeedle(needles[i])
      needleHitIndex = i
      break
    }
  }

  if(needleHitIndex >= 0){    
    needles.splice(needleHitIndex, 1)
    return true
  }
  return false
}

function redrawScreen(){
  if(!running)
    return

  redrawAvatar()
  redrawFallingBlocks()
  redrawNeedles()

  window.requestAnimationFrame(() => this.redrawScreen());
}

function redrawAvatar(){
  clearBlock(avatar)

  avatar.x += avatarMoveDirection * avatarMoveIncrement
  avatar.x = Math.min(avatar.x, screenWidth - avatar.width) // not too far right
  avatar.x = Math.max(0, avatar.x) // not too far left

  drawBlock(avatar)

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

function redrawFallingBlocks(){
  const blocksToRemove = []
  for(let i = 0; i < fallingBlocks.length; i++){
    const block = fallingBlocks[i];

    if(blockHitAvatar(block)){
      endGame()
      return
    }

    clearBlock(block);

    if(needleHitBlock(block)){
      playSound(soundFiles.blockDestroyed)
      const newScore = score + hitBlockPoints
      setScore(newScore)
      blocksToRemove.push(i)
    }
    else if(block.y >= screenHeight){
      playSound(soundFiles.blockGone)
      const newScore = score + escapedBlockPoints
      setScore(newScore)
      blocksToRemove.push(i)
    }
    else{
      block.y += fallingBlockMoveIncrement
    }
  }

  // Remove Blocks
  for(let i = 0; i < blocksToRemove.length; i ++){
    fallingBlocks.splice(blocksToRemove[i], 1)
  }

  // Draw Blocks
  for(let i = 0; i < fallingBlocks.length; i++){
    drawBrick(fallingBlocks[i])
  }
}

function redrawNeedles(){
  const needlesToRemove = []
  for(let i=0; i < needles.length; i++){
    const needle = needles[i]
    clearNeedle(needle)
    if(needle.y < 0){
      needlesToRemove.push(i)
    }
    else{
      needle.y -= needleMoveIncrement
      drawNeedle(needle)
    }    
  }

  for(let i=0; i < needlesToRemove.length; i++){
    needles.splice(needlesToRemove[i], 1)
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
  var audio = new Audio(filename);
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
    case ' ':
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
      addNeedle()
      break
    default:
      return
  }
}

window.onload = function(){
  initialize() 
}