let avatarColor
let avatarX = null
let avatarY = null

async function run(){
  let defaultSleepTime = 1000
  let color1 = 'red'
  let color2 = 'yellow'
  let color3 = 'green'

  avatarColor = 'gray'

  avatarX = 200
  avatarY = 50
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
  avatarColor = color
  drawAvatar()
}

function setAvatarX(newX){
  avatarX = newX
}

function setAvatarY(newY){
  avatarY = newY
}

function getAvatarX(){
  return avatarX
}

function getAvatarY(){
  return avatarY
}

function getAvatarColor(){
  return avatarColor
}