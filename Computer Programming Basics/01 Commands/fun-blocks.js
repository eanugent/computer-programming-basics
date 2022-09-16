async function run(){
  drawAvatar(200,50)
  await sleep(1000)
  
  moveAvatar('x', -50)
  await sleep(1000)
  
  moveAvatar('y', 50)
  await sleep(1000)
  
  changeAvatarColor('yellow')
  moveAvatar('y', 50)
  await sleep(1000)
  
  changeAvatarColor('green')
  moveAvatar('y', -50)
  moveAvatar('x', -50)
  await sleep(1000)
  
  moveAvatar('y', -50)
}

/***********************************************
 * Supporting Functions - MODIFY WITH CAUTION
 ************************************************/
let context = null
let currentX = -1
let currentY = -1
let avatarColor = 'blue'

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
  console.log(`move ${axis} ${spaces} spaces`)
  drawAvatar()
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))  
}

window.onload = async function(){
  initialize()
  await run()
}