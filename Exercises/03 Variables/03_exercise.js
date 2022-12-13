let avatarColor

async function run(){
  let color1 = 'red'
  
  drawAvatar(200,50)
  await sleep(1000)
  
  changeAvatarColor(color1)
  moveAvatarDown(200)
  await sleep(1000)

  changeAvatarColor('yellow')
  moveAvatarLeft(50)
  moveAvatarUp(100)
  await sleep(1000)

  changeAvatarColor('green')
  moveAvatarLeft(100)
  moveAvatarUp(100)
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
