window.onload = async function(){
  initialize();

  drawAvatar(200,50);
  await sleep(500);
  moveAvatar('x', -50);
  moveAvatar('y', 50);
  await sleep(500);
  changeAvatarColor('yellow');
  moveAvatar('y', 50);
  await sleep(500);
  changeAvatarColor('green');
  moveAvatar('y', -50);
  moveAvatar('x', -50);
  await sleep(500);
  moveAvatar('y', -50);
}

/***********************************************
 * Supporting Functions - MODIFY WITH CAUTION
 ************************************************/
let context = null;
let currentX = 175;
let currentY = 175;
let avatarColor = 'blue';

function initialize(){
  let canvas = document.querySelector('#playarea');
  context = canvas.getContext('2d');

  context.fillStyle = 'purple';
  context.fillRect(
    50, 50, 50, 50
  );

  context.fillRect(
    150, 150, 50, 50
  );
  
  context.fillRect(
    250, 250, 50, 50
  );
}

function changeAvatarColor(color){
  clearAvatar();
  avatarColor = color;
  drawAvatar();
}

function drawAvatar(x = null, y = null){
  if(x !==null)
    currentX = x;
  if(y !==null)
    currentY = y;

  context.fillStyle = avatarColor;
  context.fillRect(
    currentX,
    currentY,
    100,
    100
  );
}

function clearAvatar(){
  context.clearRect(currentX, currentY, 100, 100);
}

function moveAvatar(axis, spaces){
  clearAvatar();

  if(axis == "x"){
    currentX += spaces;
  }
  else if(axis == "y"){
    currentY += spaces;
  }
  console.log(`move ${axis} ${spaces} spaces`);
  drawAvatar();
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));  
}