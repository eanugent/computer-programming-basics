let context
let currentX
let currentY
let avatarColor
let running = false

function initialize(){
  let canvas = document.querySelector('#playarea')
  canvas.setAttribute('width', '450')
  canvas.setAttribute('height', '450')
  context = canvas.getContext('2d')
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
    200, 250, 50, 50
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
    50,
    50
  )
}

function clearAvatar(){
  if(currentX >= 0 && currentY >= 0)
    context.clearRect(currentX, currentY, 50, 50)
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

  document.addEventListener('keydown', async (e) =>{
    if(running) return
    if(e.key == 'Enter'){
      running = true
      context.clearRect(0,0,450,450)
      currentX = -1
      currentY = -1
      avatarColor = 'blue'
      drawTargetBlocks()
      await run()
      running = false
    }
  })
}