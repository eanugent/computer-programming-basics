async function run(){
  drawAvatar(200,50)
  await sleep(1000)
  
  changeAvatarColor('red')
  moveAvatarDown(200)
  await sleep(1000)
  
  changeAvatarColor('yellow')
  moveAvatarLeft(50) // replaced moveAvatar('x', -50)
  moveAvatar('y', -100)
  await sleep(1000)
  
  changeAvatarColor('green')
  moveAvatar('x', -100)
  moveAvatar('y', -100)
}

function moveAvatarLeft(spaces){
  moveAvatar('x', -1 * spaces)
}