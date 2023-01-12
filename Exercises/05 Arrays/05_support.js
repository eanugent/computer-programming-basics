let context
let running = false

function initialize(){
  let canvas = document.querySelector('#playarea')
  canvas.setAttribute('width', '450')
  canvas.setAttribute('height', '450')
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

function moveAvatar(axis, spaces){
  clearAvatar()

  if(axis == "x"){
    setAvatarX(getAvatarX() + spaces)
  }
  else if(axis == "y"){
    setAvatarY(getAvatarY() + spaces)
  }

  drawAvatar()
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
      drawTargetBlocks()
      await run()
      running = false
    }
  })
}