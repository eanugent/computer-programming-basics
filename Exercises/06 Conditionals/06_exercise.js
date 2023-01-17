let avatar
const blocks = []

async function run(){
  let defaultSleepTime = 1000
  const colors = []
  colors.push('red')
  colors.push('yellow')
  colors.push('green')

  avatar = {
    x: 200,
    y: 50,
    color: 'gray'
  }

  drawTargetBlocks()
  drawAvatar()
  await sleep(defaultSleepTime)
  
  changeAvatarColor(colors[0])
  moveAvatarDown(200)
  await sleep(defaultSleepTime)

  changeAvatarColor(colors[1])
  moveAvatarLeft(50)
  moveAvatarUp(100)
  await sleep(defaultSleepTime)

  changeAvatarColor(colors[2])
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
  blocks.push({ x: 50, y: 50 })
  blocks.push({ x: 150, y: 150 })
  blocks.push({ x: 200, y: 250 })

  drawBlocks(blocks)
}

function moveAvatar(axis, spaces){
  clearAvatar()

  

  drawAvatar()
}