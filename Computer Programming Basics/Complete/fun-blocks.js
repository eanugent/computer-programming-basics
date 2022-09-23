const blockWidth = 50
const blockHeight = 50
const avatarMoveIncrement = 5
const avatar = { x: null, y: null }
const fallingBlockMoveIncrement = 5
const fallingBlocks = []
const needles = []
const needleWidth = 1
const needleHeight = 5
const needleMoveIncrement = 5
const maxNeedles = 3
const escapedBlockPoints = 1
const hitBlockPoints = 3
const levelLength = 10

let context = null
let screenHeight = null
let screenWidth = null
let currentY = null
let avatarMoveDirection = null // -1 for left, 0 for not moving, 1 for right
let avatarColor = 'blue'
let level = 1
let blockInterval = null
let levelInterval = null
let score = 0

let running = false

function initialize(){
  let canvas = document.querySelector('#playarea')
  context = canvas.getContext('2d')
  
  screenHeight = document.getElementById('playarea').clientHeight;
  screenWidth = document.getElementById('playarea').clientWidth;


  document.addEventListener('keydown', (e) => keyDown(e));
  document.addEventListener('keyup', (e) => keyUp (e));

  newGame()
}

function newGame(){
  fallingBlocks.length = 0
  needles.length = 0
  avatar.x = 0
  avatar.y = screenHeight - blockHeight
  avatarMoveDirection = 0
  level = 0
  score = 0
  refreshLevel()
  refreshScore()

  context.clearRect(0,0,screenWidth,screenHeight)
  running = true;
  refreshScreen();
  if(blockInterval)
			window.clearInterval(blockInterval);

	blockInterval = window.setTimeout(() => addFallingBlock(), 1000);

  if(levelInterval)
			window.clearInterval(levelInterval)

  levelInterval = window.setInterval(() => {
    level++
    refreshLevel()
  }, levelLength * 1000)
}

function endGame(){
  running = false
  window.clearInterval(levelInterval)
}

function addFallingBlock(){
  if(!running)
	  return

  const newBlock = {
    x: Math.floor(Math.random() * (screenWidth - blockWidth)),
    y: 0
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
    x: avatar.x + (blockWidth / 2),
    y: avatar.y
  }

  needles.push(newNeedle)
}

function clearBlock(point){
  context.clearRect(point.x, point.y, blockWidth, blockHeight)
}

function drawBlock(point, color){
  //console.log(`Drawing ${color} block at ${point.x}, ${point.y}`)
  context.fillStyle = color
  context.fillRect(
    point.x,
    point.y,
    blockWidth,
    blockHeight
  )
}

function clearNeedle(point){
  context.clearRect(
    point.x,
    point.y,
    needleWidth,
    needleHeight
  )
}

function drawNeedle(point){
  context.fillStyle = 'white'
  context.fillRect(
    point.x,
    point.y,
    needleWidth,
    needleHeight
  )
}

function blockHitAvatar(point){
  const xInRange = point.x >= (avatar.x - blockWidth) && point.x <= (avatar.x + blockWidth)
  const yInRange = point.y >= (avatar.y - blockHeight) && point.y <= (avatar.y + blockHeight)

  return xInRange && yInRange
}

function needleHitBlock(point){
  let needleHitIndex = -1
  for(let i=0; i < needles.length; i++){
    const needle = needles[i]
    xInRange = needle.x >= point.x && needle.x <= (point.x + blockWidth)
    yInRange = needle.y <= (point.y + blockHeight)

    if(xInRange && yInRange){
      console.log('hit needle')
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

function refreshScreen(){
  if(!running)
    return

  clearBlock(avatar)
  avatar.x = avatar.x + (avatarMoveDirection * avatarMoveIncrement)
  avatar.x = Math.min(avatar.x, screenWidth - blockWidth)
  avatar.x = Math.max(0, avatar.x)

  drawBlock(avatar, avatarColor)

  const blocksToRemove = []
  for(let i = 0; i < fallingBlocks.length; i++){
    const block = fallingBlocks[i];

    if(blockHitAvatar(block)){
      endGame()
      return
    }

    clearBlock(block);

    if(needleHitBlock(block)){
      score += hitBlockPoints
      refreshScore()
      blocksToRemove.push(i)
    }
    else if(block.y >= screenHeight){
      score += escapedBlockPoints
      refreshScore()
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
    drawBlock(fallingBlocks[i], 'red')
  }

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

  window.requestAnimationFrame(() => this.refreshScreen());
}

function refreshScore(){
  document.getElementById('spScore').innerHTML = score;
}

function refreshLevel(){
  document.getElementById('spLevel').innerHTML = level;
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