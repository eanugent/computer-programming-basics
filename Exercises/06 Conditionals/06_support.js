let context

function initialize(){
  let canvas = document.querySelector('#playarea')
  canvas.setAttribute('width', '450')
  canvas.setAttribute('height', '450')
  context = canvas.getContext('2d')

  document.addEventListener('keydown', async (e) => {
    if(e.key == ' '){
      await run()
    }
  });
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
  const xInRange = block.x >= (avatar.x - block.width) && block.x <= (avatar.x + block.width)
  const yInRange = block.y >= (avatar.y - block.height) && block.y <= (avatar.y + block.height)

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
}