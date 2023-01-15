let context
let running = false
const blockWidth = 50
const blockHeight = 50

function initialize(){
  let canvas = document.querySelector('#playarea')
  canvas.setAttribute('width', '450')
  canvas.setAttribute('height', '450')
  context = canvas.getContext('2d')
}

function drawBlock(block){
  context.fillStyle = 'purple'
  context.fillRect(
    block.x, block.y, blockWidth, blockHeight
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
  const xInRange = block.x >= (avatar.x - blockWidth) && block.x <= (avatar.x + blockWidth)
  const yInRange = block.y >= (avatar.y - blockHeight) && block.y <= (avatar.y + blockHeight)

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
  document.addEventListener('keydown', async (e) =>{
    if(running) return
    if(e.key == 'Enter'){
      running = true
      context.clearRect(0,0,450,450)
      if(typeof blocks !== 'undefined') blocks.length = 0
      await run()
      running = false
    }
  })
}