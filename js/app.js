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
  iaeiy.moveEnemies();
  iaeiy.checkCollisions();
  iaeiy.purgeEnemies();
  iaeiy.enemyCreation();
  iaeiy.updateBoard();
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

iaeiy.moveEnemies = function(){
  $(iaeiy.enemiesCreated).each(function (index){
    var enemyName = "#" + iaeiy.enemiesCreated[index].enemyName
    switch (iaeiy.enemiesCreated[index].type){
      case "up":
      $(enemyName).animate({top: "+=" + iaeiy.enemiesCreated[index].difficulty}, 0);
      break;
      case "down":
      $(enemyName).animate({top: "-=" + iaeiy.enemiesCreated[index].difficulty}, 0);
      break;
      case "left":
      $(enemyName).animate({left: "+=" + iaeiy.enemiesCreated[index].difficulty}, 0);
      break;
      case "right":
      $(enemyName).animate({left: "-=" + iaeiy.enemiesCreated[index].difficulty}, 0);
      break;
      case "hellemy":
      var lolol = randomInt(4,1)
      switch (lolol){
        case 1:
        $(enemyName).animate({top: "-=5"}, 0);
        break;
        case 2:
        $(enemyName).animate({top: "+=5"}, 0);
        break;
        case 3:
        $(enemyName).animate({left: "-=5"}, 0);
        break;
        case 4:
        $(enemyName).animate({left: "+=5"}, 0);
        break;
      }
      break;
      default:
      console.log('enemy movement error')
      break;
    }
  })
}




iaeiy.checkCollisions = function(){
  //updating player positions
  iaeiy.player.x = $("#player").position().left
  iaeiy.player.y = $("#player").position().top

  //updating enemy positions
  $(iaeiy.enemiesCreated).each(function(index){
    var enemyToCheck = "#" + iaeiy.enemiesCreated[index].enemyName
    iaeiy.enemiesCreated[index].x = $(enemyToCheck).position().left
    iaeiy.enemiesCreated[index].y = $(enemyToCheck).position().top
  })

  //check collisions
  $(iaeiy.enemiesCreated).each(function(index){
    if (iaeiy.player.x < iaeiy.enemiesCreated[index].x + iaeiy.enemiesCreated[index].width &&
     iaeiy.player.x + iaeiy.player.width > iaeiy.enemiesCreated[index].x &&
     iaeiy.player.y < iaeiy.enemiesCreated[index].y + iaeiy.enemiesCreated[index].height &&
     iaeiy.player.height + iaeiy.player.y > iaeiy.enemiesCreated[index].y){
      iaeiy.collisionThreshold = iaeiy.collisionThreshold - 2;
    console.log("collision")
  } else if (iaeiy.enemiesCreated.length === (index+1) && iaeiy.collisionThreshold < iaeiy.baseCollisionThreshold){
    console.log("regeneration active")
    iaeiy.collisionThreshold++
  }

  //decay threshold if above base
  if(iaeiy.collisionThreshold > iaeiy.baseCollisionThreshold){
    console.log("decay active")
    iaeiy.collisionThreshold--
  }
})

  if (iaeiy.collisionThreshold < 0){
    iaeiy.lives--;
    iaeiy.collisionThreshold = iaeiy.baseDamageDelay;
  }
}

iaeiy.purgeEnemies = function(){
  $(iaeiy.enemiesCreated).each(function(index){
    var enemyToCheck= "#" + iaeiy.enemiesCreated[index].enemyName
    if ((iaeiy.selfPlayArea.left-20 >iaeiy.enemiesCreated[index].x && iaeiy.enemiesCreated[index].type==="right") ||
      (iaeiy.selfPlayArea.right+20 < iaeiy.enemiesCreated[index].x && iaeiy.enemiesCreated[index].type==="left") ||
      (iaeiy.selfPlayArea.up-20 > iaeiy.enemiesCreated[index].y && iaeiy.enemiesCreated[index].type==="down") ||
      (iaeiy.selfPlayArea.down+20 < iaeiy.enemiesCreated[index].y && iaeiy.enemiesCreated[index].type==="up")){
      $(enemyToCheck).remove();
    iaeiy.enemiesCreated.splice(index,1);
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

iaeiy.Enemy = function (posX,posY,width,height,type,difficulty){
  var enemyName = "enemy" + iaeiy.enemyCounter
  iaeiy.enemyCounter++;
  $(".self_area").append("<div id=\"" + enemyName + "\" class=enemy style=\" height:" + height + "px; width:" + width + "px; left:" + posX + "px;  top:" + posY + "px; position:fixed\"></div>")
  this.x = posX
  this.y = posY 
  this.width = width
  this.height = height
  this.enemyName = enemyName
  this.type = type
  this.difficulty = difficulty
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

iaeiy.createEnemy = function(difficulty){
  XYorigin = randomInt(3,0);
  switch (XYorigin){
    case 0:
    var xpos = iaeiy.randomX()
    var ypos = iaeiy.selfPlayArea.up - 20
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20,"up",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;
    case 1:
    var xpos = iaeiy.randomX()
    var ypos = iaeiy.selfPlayArea.down + 20
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20,"down",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;   
    case 2:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.left - 20
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20,"left",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;
    case 3:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.right + 20
    var newEnemy = new iaeiy.Enemy(xpos,ypos,20,20,"right",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;
    default:
    console.log("error in createEnemy")
  }
}

iaeiy.collisionThreshold = 0
iaeiy.lives = 20
iaeiy.baseDamageDelay = 40
iaeiy.baseCollisionThreshold = 3

iaeiy.levelOn = false
iaeiy.enemyCreationTimer=0
iaeiy.levelTimer = 0
iaeiy.levelDifficulty = 4
iaeiy.levelSpawnTimer = 20
iaeiy.enemyCreation = function(){
  if (iaeiy.levelOn){
    if (iaeiy.enemyCreationTimer === 0 ){
      iaeiy.createEnemy(iaeiy.levelDifficulty)
      iaeiy.enemyCreationTimer = iaeiy.levelSpawnTimer
    }
    iaeiy.enemyCreationTimer--;
  } 
}

iaeiy.startLevel = function(diffic,spawntimer){
  iaeiy.levelOn = true;
  iaeiy.levelDifficulty = diffic;
  iaeiy.levelSpawnTimer = spawntimer;
  iaeiy.collisionThreshold = iaeiy.baseCollisionThreshold
}

iaeiy.updateBoard = function(){
  $("#patience").html(iaeiy.lives)
}

//To test stuff
$(function(){
  $("#button1").click(function(){
    iaeiy.levelOn = true
  })
})

$(function(){
  $("#button2").click(function(){
    iaeiy.levelOn = false
  })
})