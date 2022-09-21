async function run(){
  
  
}

/***********************************************
 * Supporting Functions - MODIFY WITH CAUTION
 ************************************************/
let context = null
let currentX = -1
let currentY = -1
let avatarMoveDirection = 0 // -1 for left, 0 for not moving, 1 for right
let avatarColor = 'blue'

let screenHeight = null
let screenWidth = null
const avatarWidth = 50
const avatarHeight = 50
const avatarMoveIncrement = 5

function initialize(){
  let canvas = document.querySelector('#playarea')
  context = canvas.getContext('2d')
  
  screenHeight = document.getElementById('playarea').clientHeight;
  screenWidth = document.getElementById('playarea').clientWidth;

  document.addEventListener('keydown', (e) => keyDown(e));
  document.addEventListener('keyup', (e) => keyUp (e));
  
  drawAvatar(0, screenHeight - avatarHeight)
  drawTargetBlocks()
  window.requestAnimationFrame(() => this.render());
}

function drawTargetBlocks(){
  context.fillStyle = 'purple'
  context.fillRect(
    50, 50, 50, 50
  )

  context.fillRect(
    150, 150, 50, 50
  )
  
  context.fillRect(
    250, 250, 50, 50
  )
}

function changeAvatarColor(color){
  avatarColor = color
  drawAvatar()
}

function drawAvatar(x = null, y = null){
  clearAvatar()
  if(x !==null)
    currentX = x
  if(y !==null)
    currentY = y

  context.fillStyle = avatarColor
  context.fillRect(
    currentX,
    currentY,
    avatarWidth,
    avatarHeight
  )
}

function clearAvatar(){
  if(currentX >= 0 && currentY >= 0)
    context.clearRect(currentX, currentY, 100, 100)
}

function moveAvatar(axis, spaces){
  clearAvatar()

  if(axis == "x"){
    currentX += spaces
  }
  else if(axis == "y"){
    currentY += spaces
  }
  console.log(`move ${axis} ${spaces} spaces`)
  drawAvatar()
}

function moveAvatarLeft(spaces){
  moveAvatar('x', -spaces)
}

function moveAvatarRight(spaces){
  moveAvatar('x', spaces)
}

function moveAvatarUp(spaces){
  moveAvatar('y', -spaces)
}

function moveAvatarDown(spaces){
  moveAvatar('y', spaces)
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))  
}

function render(){
  drawAvatar(currentX + (avatarMoveDirection * avatarMoveIncrement))
  window.requestAnimationFrame(() => this.render());
}

function keyDown(){
  if(ev.defaultPrevented)
		return;
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
    case 'ArrowUp':
      moveAvatarUp(avatarMoveIncrement)
      break
    case 'ArrowDown':
      moveAvatarDown(avatarMoveIncrement)
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
    default:
      return
  }
}

window.onload = async function(){
  initialize()
  await run()
}