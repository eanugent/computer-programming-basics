let avatar = {
  x: 200,
  y: 50,
  color: 'gray'
}
let blocks

function initialize(){
  document.addEventListener('keydown', keyDownHandler)
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

  if(axis === 'x'){
    let newX = avatar.x + spaces
    setAvatarX(newX)
  }
  else if(axis === 'y'){
    let newY = (avatar.y + spaces)
    setAvatarY(newY)
  }
  else {
    throw 'axis is an invalid value'
  }

  let hitBlockIndex = indexOfBlockHitByAvatar()
  if(hitBlockIndex > -1){
    clearBlock(hitBlockIndex)
    playSound('beep.wav')
  }

  drawAvatar()
}

function keyDownHandler(eventInfo){
  if(eventInfo.key === "ArrowLeft"){
    moveAvatarLeft(5)
  } else if(eventInfo.key === "ArrowRight"){
    moveAvatarRight(5)
  } else if(eventInfo.key === "ArrowUp"){
    moveAvatarUp(5)
  } else if(eventInfo.key === "ArrowDown"){
    moveAvatarDown(5)
  }
}
