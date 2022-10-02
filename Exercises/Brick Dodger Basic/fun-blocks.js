/*
 * Implement drawBlocks() and addNewBlock()
 */

let avatar
let blocks
let gameRunning = false

function moveAvatarLeft(spaces){
  moveAvatar('x', -1 * spaces)
}

function moveAvatarRight(spaces){
  moveAvatar('x', spaces)
}

function moveAvatar(axis, spaces){
  if(!gameRunning)
    return

  clearAvatar()

  if(axis == 'x'){
    avatar.x += spaces
  }
  
  drawAvatar()
}

function drawBlocks(){
  if(!gameRunning)
    return

  let blocksToRemove = []
  /*
    TODO
  */

  removeBlocks(blocksToRemove)

  setDrawBlocksTimeout()
}

function addNewBlock(){
  if(!gameRunning)
    return

  const newBlock = {
    x: getRandomNumber(0, 400),
    y: 0
  }

  blocks.push(newBlock)

  setNewBlockTimeout()
}

function keyDownHandler(key){
  if(key == 'ArrowLeft'){
    moveAvatarLeft(10)
  }
  else if(key == 'ArrowRight'){
    moveAvatarRight(10)
  }  
}

/***********************************************
 * Supporting Functions - MODIFY WITH CAUTION
 ************************************************/
let context
let drawBlockTimeout
let newBlockTimeout

function initialize(){
  let canvas = document.querySelector('#playarea')
  context = canvas.getContext('2d')

  document.addEventListener('keydown', async (e) => {
    if(e.key === ' '){
      if(!gameRunning){
        startNewGame()
      }
      else{
        gameRunning = false
      }
    }
    else{
      keyDownHandler(e.key)
    }
  }); 
}

function startNewGame(){
  if(drawBlockTimeout)
    window.clearTimeout(drawBlockTimeout)

  if(newBlockTimeout)
    window.clearTimeout(newBlockTimeout)

  context.clearRect(0,0,450,450)
  avatar = {
    x: 0,
    y: 400,
    color: 'gray'
  }
  blocks = []
  window.setTimeout(() => {
    addNewBlock()  
  }, getRandomNumber(1000, 3000));

  drawAvatar()
  gameRunning = true
  drawBlocks()
}

function drawBlock(block){
  context.fillStyle = 'purple'
  context.fillRect(
    block.x, block.y, 50, 50
  )
}

function clearBlock(block){
  context.clearRect(
    block.x, block.y, 50, 50
  )
}

function setDrawBlocksTimeout(){
  drawBlockTimeout = window.setTimeout(() => {
    drawBlocks()
  }, 10)
}

function setNewBlockTimeout(){
  newBlockTimeout = window.setTimeout(() => {
    addNewBlock()  
  }, getRandomNumber(1000, 3000));
}

function blockHitAvatar(block){
  const xInRange = block.x >= (avatar.x - 50) && block.x <= (avatar.x + 50)
  const yInRange = block.y >= (avatar.y - 50) && block.y <= (avatar.y + 50)

  return xInRange && yInRange
}

function removeBlocks(blocksToRemove){
  for(let i = 0; i < blocksToRemove.length; i++){
    blocks.splice(i, 1)
  } 
}

function playSound(filename){
  var audio = new Audio(filename);
  audio.play();
}

function clearAvatar(){
  if(avatar.x >= 0 && avatar.y >= 0)
    context.clearRect(avatar.x, avatar.y, 50, 50)
}

function drawAvatar(){
  clearAvatar()

  avatar.x = Math.max(avatar.x, 0)
  avatar.x = Math.min(avatar.x, 400)

  context.fillStyle = avatar.color
  context.fillRect(
    avatar.x,
    avatar.y,
    50,
    50
  )
}

function getRandomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

window.onload = async function(){
  initialize()
}