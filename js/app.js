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
  left: 3,
  up: 3,
  right: 480,
  down: 580
}


iaeiy.checkCollisions = function(){
  //updating player positions
  iaeiy.player.x = $("#player").position().left
  iaeiy.player.y = $("#player").position().top

  //updating enemy positions
  $(iaeiy.enemiesCreated).each(function(){
  iaeiy.enemy1.x = $("#enemy1").position().left
  iaeiy.enemy1.y = $("#enemy1").position().top
  })

  $(iaeiy.enemiesCreated).each(function(){
  if (iaeiy.player.x < iaeiy.enemy1.x + iaeiy.enemy1.width &&
   iaeiy.player.x + iaeiy.player.width > iaeiy.enemy1.x &&
   iaeiy.player.y < iaeiy.enemy1.y + iaeiy.enemy1.height &&
   iaeiy.player.height + iaeiy.player.y > iaeiy.enemy1.y){
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

iaeiy.enemy1 = {  
  x: 400,
  y: 400,
  width: 20,
  height: 20
}

iaeiy.Enemy = function (posX,posY,width,height){
  var enemyName = "enemy" + iaeiy.enemyCounter
  iaeiy.enemyCounter++;
  $(".self_area").append("<div id=\"" + enemyName + "\" class=enemy style=\" height:" + height + "px; width:" + width + "px; left:" + posX + "px;  top :" + posY + "px\"></div>")
  this.x = posX
  this.y = posY 
  this.width = width
  this.height = height
  console.log(this)
  var enemyIdentifier = "\"#" + enemyName +"\"" 
}

function randomInt(max,min){
  return Math.floor((Math.random * (max-min) + min) 
}

iaeiy.randomX = function(){
  randomInt(iaeiy.selfPlayArea.right,iaeiy.selfPlayArea.left);
}
iaeiy.randomY = function(){
  randomInt(iaeiy.selfPlayArea.bottom,iaeiy.selfPlayArea.top)
}

iaeiy.createEnemy = function(){
  XYorigin = randomInt(3,0);
  switch (XYorigin){
    case 0:
    var xpos = randomX
    var newEnemy = new iaeiy.Enemy(iaeiy.selfPlayArea.left + xpos,3,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    break;
    case 1:
    var ypos = randomY
    var newEnemy = new iaeiy.Enemy(3, ypos ,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    break;   
    case 2:
    var ypos = randomY
    var newEnemy = new iaeiy.Enemy(3, ypos ,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    break;

    case 3:
    var ypos = randomY
    var newEnemy = new iaeiy.Enemy(3, ypos ,20,20)
    iaeiy.enemiesCreated.push(newEnemy)
    break;

    default:
    console.log("error in createEnemy")
  }
}

//To test stuff
$(function(){
  $("button").click(function(){
  })
})