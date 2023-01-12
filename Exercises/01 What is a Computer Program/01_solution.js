async function run(){
  drawAvatar(200,50)
  await sleep(1000)
  
  changeAvatarColor('red')
  moveAvatar('y', 200)
  await sleep(1000)
  
  changeAvatarColor('yellow')
  moveAvatar('x', -50)
  moveAvatar('y', -100)
  await sleep(1000)
  
  changeAvatarColor('green')
  moveAvatar('x', -100)
  moveAvatar('y', -100)
}