let avatar

async function run(){
  let defaultSleepTime = 1000
  let color1 = 'red'
  let color2 = 'yellow'
  let color3 = 'green'

  avatar = {
    x: 200,
    y: 50,
    color: 'gray'
  }

  drawTargetBlocks()
  drawAvatar()
  await sleep(defaultSleepTime)
  
  changeAvatarColor(color1)
  moveAvatarDown(200)
  await sleep(defaultSleepTime)

  changeAvatarColor(color2)
  moveAvatarLeft(50)
  moveAvatarUp(100)
  await sleep(defaultSleepTime)

  changeAvatarColor(color3)
  moveAvatarLeft(100)
  moveAvatarUp(100)
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

function changeAvatarColor(color){
  avatar.color = color
  drawAvatar()
}

function setAvatarX(newX){
  avatar.x = newX
}

function setAvatarY(newY){
  avatar.y = newY
}

function getAvatarX(){
  return avatar.x
}

function getAvatarY(){
  return avatar.y
}

function getAvatarColor(){
  return avatar.color
}

function drawTargetBlocks(){
  blocks = []
  blocks.push({ x: 50, y: 50 })
  blocks.push({ x: 150, y: 150 })
  blocks.push({ x: 200, y: 250 })

  drawBlocks(blocks)
}

function moveAvatar(axis, spaces){
  clearAvatar()

  if(axis == 'x'){
    avatar.x = avatar.x + spaces
  }
  else if(axis == 'y'){
    avatar.y = avatar.y + spaces
  }

  if(avatarHitAnyBlock()){
    playSound('beep.wav')
  }

  drawAvatar()
}

/***********************************************
 * Supporting Functions - MODIFY WITH CAUTION
 ************************************************/
let context

function initialize(){
  let canvas = document.querySelector('#playarea')
  context = canvas.getContext('2d')
}

function drawBlock(block){
  context.fillStyle = 'purple'
  context.fillRect(
    block.x, block.y, 50, 50
  )
}

function drawBlocks(blocks){
  for(let i = 0; i < blocks.length; i++){
    drawBlock(blocks[i])
  }
}

function avatarHitAnyBlock(){
  for(let i=0; i < blocks.length; i++){
    if(blockHitAvatar(blocks[i]))
      return true
  }
  return false
}

function blockHitAvatar(block){
  const xInRange = block.x >= (avatar.x - 50) && block.x <= (avatar.x + 50)
  const yInRange = block.y >= (avatar.y - 50) && block.y <= (avatar.y + 50)

  return xInRange && yInRange
}


function playSound(filename){
  var audio = new Audio(filename);
  audio.play();
}

function clearAvatar(){
  if(getAvatarX() >= 0 && getAvatarY() >= 0)
    context.clearRect(getAvatarX(), getAvatarY(), 50, 50)
}

function drawAvatar(){
  clearAvatar()

  context.fillStyle = getAvatarColor()
  context.fillRect(
    getAvatarX(),
    getAvatarY(),
    50,
    50
  )
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))  
}

window.onload = async function(){
  initialize()
  document.addEventListener('keydown', async (e) => {
    if(e.key == ' '){
      await run()
    }
  });  
}