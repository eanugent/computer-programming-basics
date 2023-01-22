let context
const blockWidth = 50
const blockHeight = 50
const localFilePath = './'
const remoteFilePath = 'https://cdn.jsdelivr.net/gh/eanugent/computer-programming-basics@v0.1.9/assets/'
const soundFilePath = remoteFilePath // Change this to localFilePath to use your own files

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

window.onload = async function(){
  let canvas = document.querySelector('#playarea')
  canvas.setAttribute('width', '450')
  canvas.setAttribute('height', '450')
  context = canvas.getContext('2d')

  initialize()
  drawAvatar()
  drawTargetBlocks()
}
