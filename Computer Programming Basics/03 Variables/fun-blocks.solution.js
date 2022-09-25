let avatarColor

async function run(){
  let defaultSleepTime = 1000
  let color1 = 'red'
  let color2 = 'yellow'
  let color3 = 'green'

  avatarColor = 'gray'

  drawAvatar(200,50)
  await sleep(defaultSleepTime)
  
  changeAvatarColor(color1)
  moveAvatarDown(200)
  await sleep(defaultSleepTime)

  changeAvatarColor(color2)
  moveAvatarLeft(100)
  moveAvatarUp(150)
  await sleep(defaultSleepTime)

  changeAvatarColor(color3)
  moveAvatarLeft(50)
  moveAvatarUp(50)
  await sleep(defaultSleepTime)
}

function moveAvatarLeft(spaces){
  moveAvatar('x', -1 * spaces)
}

function moveAvatarRight(spaces){
  moveAvatar('x', spaces)
}

function moveAvatarUp(spaces){
  moveAvatar('y', -1 * spaces)
}

function moveAvatarDown(spaces){
  moveAvatar('y', spaces)
}

/***********************************************
 * Supporting Functions - MODIFY WITH CAUTION
 ************************************************/
let context
let currentX = -1
let currentY = -1

function initialize(){
  let canvas = document.querySelector('#playarea')
  context = canvas.getContext('2d')
  drawTargetBlocks()
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
    100,
    100
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

  drawAvatar()
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))  
}

window.onload = async function(){
  initialize()
  await run()
}