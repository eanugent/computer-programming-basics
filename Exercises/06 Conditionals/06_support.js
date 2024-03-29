let context
let running = false
const blockWidth = 50
const blockHeight = 50
const localFilePath = './'
const remoteFilePath = 'https://cdn.jsdelivr.net/gh/eanugent/computer-programming-basics@v0.1.9/assets/'
const soundFilePath = remoteFilePath // Change this to localFilePath to use your own files

function initialize(){
  let canvas = document.querySelector('#playarea')
  canvas.setAttribute('width', '450')
  canvas.setAttribute('height', '450')
  context = canvas.getContext('2d')
}

function clearBlock(blockIndex){
  context.clearRect(blocks[blockIndex].x, blocks[blockIndex].y, blockWidth, blockHeight)
  blocks.splice(blockIndex, 1)
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

function indexOfBlockHitByAvatar(){
  for(let i=0; i < blocks.length; i++){
    if(blockHitAvatar(blocks[i]))
      return i
  }
  return -1
}

function blockHitAvatar(block){
  const xInRange = block.x >= (avatar.x - blockWidth) && block.x <= (avatar.x + blockWidth)
  const yInRange = block.y >= (avatar.y - blockHeight) && block.y <= (avatar.y + blockHeight)

  return xInRange && yInRange
}

function playSound(filename){
  var audio = new Audio(soundFilePath + filename);
  audio.play();
}

function clearAvatar(){
  if(getAvatarX() >= 0 && getAvatarY() >= 0)
    context.clearRect(getAvatarX(), getAvatarY(), blockWidth, blockHeight)
}

function drawAvatar(){
  clearAvatar()

  context.fillStyle = getAvatarColor()
  context.fillRect(
    getAvatarX(),
    getAvatarY(),
    blockWidth,
    blockHeight
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