var iaeiy = iaeiy ||{}

function randomInt(max,min){
  return Math.floor((Math.random() * (max-min+1) + min)) 
}

iaeiy.collisionThreshold = 0
iaeiy.baseDamageDelay = 40
iaeiy.baseCollisionThreshold = 3
iaeiy.purgeInterval = null
iaeiy.enemyCreationTimer=0

iaeiy.levelVal = 0
iaeiy.lives = 3
iaeiy.levelTimer = 10000
iaeiy.levelDifficulty = 4
iaeiy.levelSpawnTimer = 20
iaeiy.levelMaxSize = 20

iaeiy.levelSettings = [
{lives :5,
  timer: 10000,
  difficulty: 4,
  spawnTimer: 20,
  maxSize: 20
},{lives :3,
  timer: 10000,
  difficulty: 4,
  spawnTimer: 15,
  maxSize: 40
},{lives :2,
  timer: 10000,
  difficulty: 5,
  spawnTimer: 10,
  maxSize: 50
},{lives :1,
  timer: 10000,
  difficulty: 6,
  spawnTimer: 10,
  maxSize: 60
}]

$(function(){
  $("#start_button").click(function(){
    iaeiy.init();
  })
  $("#reset").click(function(){
    iaeiy.levelVal = 0
    iaeiy.lives = 3
    iaeiy.levelTimer = 10000
    iaeiy.levelDifficulty = 4
    iaeiy.levelSpawnTimer = 20
    iaeiy.levelMaxSize = 20
    $("#start_button").fadeOut(1000)
    setTimeout(function(){
      $("#start_button").html("breathe in");
      $("#start_button").fadeIn(1000)
    },1000)
  })
})

iaeiy.init = function(){
  iaeiy.levelOn = false
  iaeiy.startGame();
  iaeiy.initButtons()
}

iaeiy.initButtons = function(){
 console.log("Game initialised");
 iaeiy.refreshInterval = null;
 iaeiy.refreshInterval = setInterval(iaeiy.refreshFunction, 20);
}

iaeiy.refreshFunction = function (){
  if (iaeiy.levelOn){
    iaeiy.playerMovement();
    iaeiy.moveEnemies();
    iaeiy.moveKarma();
    iaeiy.checkCollisions();
    iaeiy.purgeEnemies();
    iaeiy.enemyCreation();
    iaeiy.updateBoard();
    iaeiy.checkWinLose();
  }
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

// maybe?
iaeiy.populatePlayArea = function(){
  iaeiy.selfPlayArea.left = $(".self_area",0).position().left +5
  iaeiy.selfPlayArea.up = $(".self_area",0).position().up +5
}

iaeiy.selfPlayArea = {
  left: 15,
  up: 15,
  right: 495,
  down: 595,
}


iaeiy.moveEnemies = function(){
  $(iaeiy.enemiesCreated).each(function (index){
    var enemyName = "#" + iaeiy.enemiesCreated[index].enemyName;
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

iaeiy.moveKarma = function(){
  $(iaeiy.karmaCreated).each(function (index){
    var karmaName = "#" + iaeiy.karmaCreated[index].karmaName;
    switch (iaeiy.karmaCreated[index].type){
      case "up":
      $(karmaName).animate({top: "+=3"}, 0);
      break;
      case "down":
      $(karmaName).animate({top: "-=3"}, 0);
      break;
      case "left":
      $(karmaName).animate({left: "+=3"}, 0);
      break;
      case "right":
      $(karmaName).animate({left: "-=3"}, 0);
      break;
      case "wtf":
      var lolol = randomInt(4,1)
      switch (lolol){
        case 1:
        $(karmaName).animate({top: "-=5"}, 0);
        break;
        case 2:
        $(karmaName).animate({top: "+=5"}, 0);
        break;
        case 3:
        $(karmaName).animate({left: "-=5"}, 0);
        break;
        case 4:
        $(karmaName).animate({left: "+=5"}, 0);
        break;
      }
      break;
      default:
      console.log('karma movement error')
      break;
    }
  })
}

iaeiy.checkCollisions = function(){
  //updating player positions
  iaeiy.player.x = $("#player").position().left;
  iaeiy.player.y = $("#player").position().top;

  //updating enemy positions
  $(iaeiy.enemiesCreated).each(function(index){
    var enemyToCheck = "#" + iaeiy.enemiesCreated[index].enemyName
    iaeiy.enemiesCreated[index].x = $(enemyToCheck).position().left
    iaeiy.enemiesCreated[index].y = $(enemyToCheck).position().top
  });

  //check collisions
  $(iaeiy.enemiesCreated).each(function(index){
    if (iaeiy.player.x < iaeiy.enemiesCreated[index].x + iaeiy.enemiesCreated[index].width &&
     iaeiy.player.x + iaeiy.player.width > iaeiy.enemiesCreated[index].x &&
     iaeiy.player.y < iaeiy.enemiesCreated[index].y + iaeiy.enemiesCreated[index].height &&
     iaeiy.player.height + iaeiy.player.y > iaeiy.enemiesCreated[index].y){
      iaeiy.collisionThreshold = iaeiy.collisionThreshold - 2;
  } else if (iaeiy.enemiesCreated.length === (index+1) && iaeiy.collisionThreshold < iaeiy.baseCollisionThreshold){
    iaeiy.collisionThreshold++
  }
  });

  //decay threshold if above base
  if(iaeiy.collisionThreshold > iaeiy.baseCollisionThreshold){
    iaeiy.collisionThreshold--
  }

  //check good bullet collision
  $(iaeiy.karmaCreated).each(function(index){
    if (iaeiy.player.x < iaeiy.karmaCreated[index].x + iaeiy.karmaCreated[index].width &&
     iaeiy.player.x + iaeiy.player.width > iaeiy.karmaCreated[index].x &&
     iaeiy.player.y < iaeiy.karmaCreated[index].y + iaeiy.karmaCreated[index].height &&
     iaeiy.player.height + iaeiy.player.y > iaeiy.karmaCreated[index].y){
      var karmaToCheck= "#" + iaeiy.karmaCreated[index].enemyName;
      console.log("karma collected");
      $(karmaToCheck).remove();
      iaeiy.karmaCreated.splice(index,1);
    }
  })


  if (iaeiy.collisionThreshold < 0){
    iaeiy.lives--;
    iaeiy.collisionThreshold = iaeiy.baseDamageDelay;
  }
};

iaeiy.purgeEnemies = function(){
  $($(iaeiy.enemiesCreated).get().reverse()).each(function(index){
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

iaeiy.purgeKarma = function(){
  $($(iaeiy.karmaCreated).get().reverse()).each(function(index){
    var enemyToCheck= "#" + iaeiy.karmaCreated[index].enemyName
    if ((iaeiy.selfPlayArea.left-20 >iaeiy.karmaCreated[index].x && iaeiy.karmaCreated[index].type==="right") ||
      (iaeiy.selfPlayArea.right+20 < iaeiy.karmaCreated[index].x && iaeiy.karmaCreated[index].type==="left") ||
      (iaeiy.selfPlayArea.up-20 > iaeiy.karmaCreated[index].y && iaeiy.karmaCreated[index].type==="down") ||
      (iaeiy.selfPlayArea.down+20 < iaeiy.karmaCreated[index].y && iaeiy.karmaCreated[index].type==="up")){
      $(enemyToCheck).remove();
    iaeiy.karmaCreated.splice(index,1);
  }
})
}

iaeiy.player = {
  x: 40,
  y: 40,
  width: 20,
  height: 20
}

iaeiy.karmaCreated = []
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
}

iaeiy.karmaCounter = 0

iaeiy.Karma = function (posX,posY,type){
  var karmaName = "karma" + iaeiy.karmaCounter
  iaeiy.karmaCounter++;
  $(".self_area").append("<div id=\"" + karmaName + "\" class=karma style=\" height:20px; width:20px; left:" + posX + "px;  top:" + posY + "px; position:fixed\"></div>")
  this.x = posX
  this.y = posY 
  this.width = 20
  this.height = 20
  this.karmaName = karmaName
  this.type = type 
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
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newEnemy = new iaeiy.Enemy(xpos,ypos,size,size,"up",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;
    case 1:
    var xpos = iaeiy.randomX()
    var ypos = iaeiy.selfPlayArea.down + 20
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newEnemy = new iaeiy.Enemy(xpos,ypos,size,size,"down",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;   
    case 2:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.left - 20
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newEnemy = new iaeiy.Enemy(xpos,ypos,size,size,"left",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;
    case 3:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.right + 20
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newEnemy = new iaeiy.Enemy(xpos,ypos,size,size,"right",difficulty)
    iaeiy.enemiesCreated.push(newEnemy)
    break;
    default:
    console.log("error in createEnemy")
  }
}

iaeiy.createKarma = function(){
  XYorigin = randomInt(3,0);
  switch (XYorigin){
    case 0:
    var xpos = iaeiy.randomX()
    var ypos = iaeiy.selfPlayArea.up - 20
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newKarma = new iaeiy.Karma(xpos,ypos,"up")
    iaeiy.karmaCreated.push(newKarma)
    break;
    case 1:
    var xpos = iaeiy.randomX()
    var ypos = iaeiy.selfPlayArea.down + 20
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newKarma = new iaeiy.Karma(xpos,ypos,"down")
    iaeiy.karmaCreated.push(newKarma)
    break;   
    case 2:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.left - 20
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newKarma = new iaeiy.Karma(xpos,ypos,"left")
    iaeiy.karmaCreated.push(newKarma)
    break;
    case 3:
    var ypos = iaeiy.randomY()
    var xpos = iaeiy.selfPlayArea.right + 20
    var size = randomInt(iaeiy.levelMaxSize,20)
    var newKarma = new iaeiy.Karma(xpos,ypos,"right")
    iaeiy.karmaCreated.push(newKarma)
    break;
    default:
    console.log("error in createKarma")
  }
}

iaeiy.enemyCreation = function(){
  if (iaeiy.levelOn){
    if (iaeiy.enemyCreationTimer === 0 ){
      iaeiy.createEnemy(iaeiy.levelDifficulty)
      iaeiy.enemyCreationTimer = iaeiy.levelSpawnTimer
    }
    iaeiy.enemyCreationTimer--;
  } 
}

iaeiy.startLevel = function(diffic,spawnTimer){
  iaeiy.levelOn = true;
  iaeiy.levelDifficulty = diffic;
  iaeiy.levelSpawnTimer = spawnTimer;
  iaeiy.collisionThreshold = iaeiy.baseCollisionThreshold
}

iaeiy.updateBoard = function(){
  $("#patience").html(iaeiy.lives)
  $("#game_timer").html(iaeiy.levelTimer)
}

iaeiy.endLevel = function(){
  iaeiy.levelOn = false
}

iaeiy.startGame = function(){
  $(".front").fadeOut(1000)
  $("#start_button").fadeOut(600)
  $("#announcer").fadeOut(1000)
  $("title").html("it all ends in you.")
  iaeiy.updateLevel(iaeiy.levelVal)
  iaeiy.loadLevel();
}

iaeiy.checkWinLose = function(){
  iaeiy.levelTimer -=20;
  if(iaeiy.lives < 1){
    iaeiy.youLose();
    iaeiy.clearLevel();
  } else if (iaeiy.levelTimer < 0){
    iaeiy.levelWin();
    iaeiy.clearLevel();
  }
}

iaeiy.youLose = function(){
  $(".front").fadeIn(5000)
  $("title").html("breathe again")
  iaeiy.announcerRandomise();
  $("#announcer").html("overconfidence.")

  setTimeout(function(){
    $("#start_button").fadeIn(700)
    $("#announcer").fadeIn(100)
  },6000)

}

iaeiy.loadLevel = function(){
  iaeiy.levelTimer=iaeiy.levelSettings[iaeiy.levelVal].timer
  iaeiy.lives= iaeiy.levelSettings[iaeiy.levelVal].lives
  iaeiy.levelOn=true
}

iaeiy.clearLevel = function(){
  clearInterval(iaeiy.refreshInterval);
  iaeiy.purgeInterval = setInterval(iaeiy.clearEnemies, 50)
  setTimeout(function(){
    clearInterval(iaeiy.purgeInterval)
  },1000)
}

iaeiy.clearEnemies = function(){
  $($(iaeiy.enemiesCreated).get().reverse()).each(function(index){
    var enemyToRemove= "#" + iaeiy.enemiesCreated[index].enemyName
    $(enemyToRemove).remove();
    iaeiy.enemiesCreated.splice(index,1);
  })
  console.log("clearing")
}

iaeiy.announcerRandomise = function(){
  var xpos = randomInt(60,15) + "%"
  var ypos = randomInt(40,20) + "%"
  $("#announcer").animate({top: ypos,left: xpos})
}

iaeiy.levelWin = function(){
  if (iaeiy.levelVal !== 3){iaeiy.levelVal++};
  iaeiy.updateLevel(iaeiy.levelVal);

  $(".front").fadeIn(2000)
  $("title").html("breathe once more")
  $("#start_button").fadeIn(1000)
  iaeiy.announcerRandomise();
  $("#announcer").fadeIn(1000)
  $("#announcer").html("success brings confidence")

  var buttonText = function(){
    switch(iaeiy.levelVal){
      case 1:
      return "breathe once"
      break;
      case 2:
      return "breathe twice"
      break;
      case 3:
      return "breathe deep"
      break;
      default:
      return "again."
    }}
    $("#start_button").html(buttonText)

    if (iaeiy.levelVal === 4){
      $("#announcer").html("confidence brings completion. congratulations.")
    }
  }

  iaeiy.updateLevel = function(i){
    iaeiy.lives = iaeiy.levelSettings[i].lives;
    iaeiy.levelTimer = iaeiy.levelSettings[i].timer;
    iaeiy.levelDifficulty = iaeiy.levelSettings[i].difficulty;
    iaeiy.levelSpawnTimer = iaeiy.levelSettings[i].spawnTimer;
    iaeiy.levelMaxSize = iaeiy.levelSettings[i].maxSize
  }

//To test stuff
$(function(){
  $("#button1").click(function(){
    iaeiy.createKarma();
  })
})

$(function(){
  $("#button2").click(function(){
    iaeiy.levelOn = false
  })
})