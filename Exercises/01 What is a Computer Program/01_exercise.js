async function run(){
  drawAvatar(200,50)
  await sleep(1000)
  
  changeAvatarColor('red')
  moveAvatar('x', -50)
  await sleep(1000)
  
  moveAvatar('y', 50)
  await sleep(1000)
  
  changeAvatarColor('yellow')
  moveAvatar('y', 50)
  await sleep(1000)
  
  changeAvatarColor('green')
  moveAvatar('y', -50)
  moveAvatar('x', -50)
  await sleep(1000)
  
  moveAvatar('y', -50)
}