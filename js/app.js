//X is left and right
//y is up and down

var iaeiy = iaeiy ||{}

$(function(){
  iaeiy.init()
})

iaeiy.init = function(){
  iaeiy.initButtons()
}


iaeiy.initButtons = function(){
 console.log("buttons initialised");
 setInterval(iaeiy.refreshFunction, 20)
 iaeiy.refreshFunction();
}


iaeiy.refreshFunction = function (){
  iaeiy.playerMovement();
  iaeiy.checkCollisions();
}

// Movement Functions (with restrictions)
iaeiy.playerKeyStore = {}
$(document).keydown(function(e) {
  iaeiy.playerKeyStore[e.keyCode] = true;
});
$(document).keyup(function(e) {
  delete iaeiy.playerKeyStore[e.keyCode];
});
iaeiy.playerMovement = function() {
  for (var direction in iaeiy.playerKeyStore) {
    if (!iaeiy.playerKeyStore.hasOwnProperty(direction)) continue;
    if (direction == 37) {
      if (iaeiy.player.x > iaeiy.selfPlayArea.left){
        $("#player").animate({left: "-=5"}, 0);
      }                
    }
    if (iaeiy.player.y > iaeiy.selfPlayArea.up){
      if (direction == 38) {
        $("#player").animate({top: "-=5"}, 0);  
      }
    }
    if (iaeiy.player.x < iaeiy.selfPlayArea.right){
      if (direction == 39) {
        $("#player").animate({left: "+=5"}, 0);  
      }
    }
    if (iaeiy.player.y < iaeiy.selfPlayArea.down){
      if (direction == 40) {
        $("#player").animate({top: "+=5"}, 0);  
      }
    }
  }  
}

iaeiy.selfPlayArea = {
  left: 15,
  up: 15,
  right: 495,
  down: 595,
}


iaeiy.checkCollisions = function(){
  //updating player positions
  iaeiy.player.x = $("#player").position().left
  iaeiy.player.y = $("#player").position().top

  //updating enemy positions
  $(iaeiy.enemiesCreated).each(function(index){
    var enemyToCheck  = "#" + iaeiy.enemiesCreated[index].enemyName
  iaeiy.enemiesCreated[index].x = $(enemyToCheck).position().left
  iaeiy.enemiesCreated[index].y = $(enemyToCheck).position().top
  })

  //check collisions
  $(iaeiy.enemiesCreated).each(function(index){
  if (iaeiy.player.x < iaeiy.enemiesCreated[index].x + iaeiy.enemiesCreated[index].width &&
   iaeiy.player.x + iaeiy.player.width > iaeiy.enemiesCreated[index].x &&
   iaeiy.player.y < iaeiy.enemiesCreated[index].y + iaeiy.enemiesCreated[index].height &&
   iaeiy.player.height + iaeiy.player.y > iaeiy.enemiesCreated[index].y){
    console.log('collision detected')  
    }
  })
}

iaeiy.player = {
  x: 40,
  y: 40,
  width: 20,
  height: 20
}

iaeiy.enemiesCreated =[]

//For future use? Maybe?
//iaeiy.enemiesActive =[]

iaeiy.enemyCounter = 0

iaeiy.enemyTest = {  
  x: 400,
  y: 400,
  width: 20,
  height: 20,
  enemyName: "enemyTest"
}

iaeiy.enemiesCreated.push(iaeiy.enemyTest)

iaeiy.Enemy = function (posX,posY,width,height){
  var enemyName = "enemy" + iaeiy.enemyCounter
  iaeiy.enemyCounter++;
  $(".self_area").append("<div id=\"" + enemyName + "\" class=enemy style=\" height:" + height + "px; width:" + width + "px; left:" + posX + "px;  top:" + posY + "px; position:fixed\"></div>")
  this.x = posX
  this.y = posY 
  this.width = width
  this.height = height
  this.id = enemyName
  console.log(this)
  var enemyIdentifier = "\"#" + enemyName +"\"" 
}

function randomInt(max,min){
  return Math.floor((Math.random() * (max-min+1) + min)) 
}

iaeiy.randomX = function(){
  return randomInt(iaeiy.selfPlayArea.right,iaeiy.selfPlayArea.left);
}
iaeiy.randomY = function(){
  return randomInt(iaeiy.selfPlayArea.down,iaeiy.selfPlayArea.up)
}

iaeiy.createEnemy = function(){
  XYorigin = randomInt(3,0);
  switch (XYorigin){
    case 0:
    var xpos = iaeiy.randomX()
    var ypos = iaeiy.selfPlayArea.up -10
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    console.log("case0:top")
    break;
    case 1:
    var xpos = iaeiy.randomX()
    var ypos = iaeiy.selfPlayArea.down+40
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    console.log("case1:bottom")
    break;   
    case 2:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.left - 20
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    console.log("case2:left")
    break;
    case 3:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.right +30
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    console.log("case3:right")
    break;
    default:
    console.log("error in createEnemy")
  }
}

//To test stuff
$(function(){
  $("button").click(function(){
    iaeiy.createEnemy()
  })
})