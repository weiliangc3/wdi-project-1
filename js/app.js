var iaeiy = iaeiy ||{}

function randomInt(max,min){
  return Math.floor((Math.random() * (max-min+1) + min)) 
}

iaeiy.collisionThreshold = 0
iaeiy.baseDamageDelay = 40
iaeiy.baseCollisionThreshold = 3
iaeiy.purgeInterval = null
iaeiy.enemyCreationTimer=0
iaeiy.karmaCollected=0
iaeiy.karmaTimer = 60

iaeiy.gameType = "challenge"
iaeiy.levelVal = 0
iaeiy.lives = 3
iaeiy.levelTimer = 10000
iaeiy.levelDifficulty = 4
iaeiy.levelSpawnTimer = 20
iaeiy.levelMaxSize = 20
iaeiy.levelKarmaCollected = 1
iaeiy.timerName = "time remaining:  "
iaeiy.karmaBaseDelay = 100

iaeiy.karmaDecayTimer = 170
iaeiy.karmaBaseDecay = 170

iaeiy.levelSettings = [
{lives :5,
  timer: 20000,
  difficulty: 4,
  spawnTimer: 20,
  maxSize: 20
},{lives :3,
  timer: 50000,
  difficulty: 4,
  spawnTimer: 15,
  maxSize: 40
},{lives :3,
  timer: 100000,
  difficulty: 5,
  spawnTimer: 10,
  maxSize: 50
},{lives :3,
  timer: 250000,
  difficulty: 6,
  spawnTimer: 10,
  maxSize: 60
}]

$(function(){
  iaeiy.introAnimations();
  iaeiy.mainScreenOn();
})

iaeiy.introAnimations = function(){
  $(".options").hide();
  $("#start_button").hide();
  $("#reset").hide();
  $("#instructions").hide();
  iaeiy.swooshFromRight("#title1","50%","40%","0%")
  iaeiy.swooshFromRight("#title2","55%","38%","0%")
  iaeiy.swooshFromRight("#title3","70%","60%","0%") //1500
  setTimeout(function(){$(".options").fadeIn(400)},1500)
  setTimeout(function(){$("#start_button").fadeIn(400)},1700)
  setTimeout(function(){$("#instructions").fadeIn(400)},1900)
}

iaeiy.swooshFromRight = function(object,hangP1,hangP2,finalP){
  $(object).attr("style","left: 120%");
  setTimeout($(object).animate({left: hangP1}, 200),100);
  setTimeout($(object).animate({left: hangP2}, 1000),300)
  setTimeout($(object).animate({left: finalP}, 200),1300)
}

iaeiy.mainScreenOn = function (){
  $("#start_button").click(function(){
    iaeiy.init();
  })
  $("#reset").click(function(){
    iaeiy.levelVal = 0
    iaeiy.lives = 3
    iaeiy.levelTimer = 100000
    iaeiy.levelDifficulty = 4
    iaeiy.levelSpawnTimer = 20
    iaeiy.levelMaxSize = 20
    iaeiy.karmaTimer = 60
    $("#start_button").fadeOut(1000)
    setTimeout(function(){
      $("#start_button").html("to the start");
      $("#start_button").fadeIn(1000);
      $(".options").fadeIn();
      $("#reset").fadeOut(1000)
    },1000)
  })
  $(".instruction_panel").hide();
  $("#instructions").click(function(){
    $(".instruction_panel").fadeIn(800);
  })
  $("#return_to_main").click(function(){
    $(".instruction_panel").fadeOut(800);
  })
  $("#instructions").hover(function(){
    $(this).removeClass("button_inactive")
  }, function(){
    $(this).addClass("button_inactive")
  })
  $("#return_to_main").hover(function(){
    $(this).removeClass("button_inactive")
  }, function(){
    $(this).addClass("button_inactive")
  })
  iaeiy.initOptions();  
}

iaeiy.init = function(){
  iaeiy.levelOn = false
  iaeiy.startGame();
  iaeiy.initButtons();
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
    iaeiy.purgeKarma();
    iaeiy.enemyCreation();
    iaeiy.karmaDecay();
    iaeiy.updateBoard();
    iaeiy.setKarmaMultiplier();
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
    if (direction == 37 || direction == 65) {
      if (iaeiy.player.x > iaeiy.selfPlayArea.left){
        $("#player").animate({left: "-=5"}, 0);
      }                
    }
    if (iaeiy.player.y > iaeiy.selfPlayArea.up){
      if (direction == 38 || direction == 87) {
        $("#player").animate({top: "-=5"}, 0);  
      }
    }
    if (iaeiy.player.x < iaeiy.selfPlayArea.right){
      if (direction == 39 || direction == 68) {
        $("#player").animate({left: "+=5"}, 0);  
      }
    }
    if (iaeiy.player.y < iaeiy.selfPlayArea.down){
      if (direction == 40 || direction == 83) {
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
  down: 545,
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
      $(karmaName).animate({top: "+=2"}, 0);
      break;
      case "down":
      $(karmaName).animate({top: "-=2"}, 0);
      break;
      case "left":
      $(karmaName).animate({left: "+=2"}, 0);
      break;
      case "right":
      $(karmaName).animate({left: "-=2"}, 0);
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
    iaeiy.enemiesCreated[index].duration--;
  });

  //update karma positions
  $(iaeiy.karmaCreated).each(function(index){
    var karmaToCheck = "#" + iaeiy.karmaCreated[index].karmaName
    iaeiy.karmaCreated[index].x = $(karmaToCheck).position().left
    iaeiy.karmaCreated[index].y = $(karmaToCheck).position().top
    iaeiy.karmaCreated[index].duration--;
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

  //check karma collision
  $(iaeiy.karmaCreated).each(function(index){
    if (iaeiy.player.x < iaeiy.karmaCreated[index].x + iaeiy.karmaCreated[index].width &&
      iaeiy.player.x + iaeiy.player.width > iaeiy.karmaCreated[index].x &&
      iaeiy.player.y < iaeiy.karmaCreated[index].y + iaeiy.karmaCreated[index].height &&
      iaeiy.player.height + iaeiy.player.y > iaeiy.karmaCreated[index].y){
      var karmaToCheck= "#" + iaeiy.karmaCreated[index].karmaName;
    $(karmaToCheck).remove();
    iaeiy.karmaCreated.splice(index,1);
    iaeiy.karmaCollected++;
    iaeiy.levelKarmaCollected++;
    iaeiy.karmaDecayTimer = 300;
    iaeiy.playerKarmaAnimation();
    if (iaeiy.levelKarmaCollected > 5){
      iaeiy.levelKarmaCollected = 5
    }
  }
})

  if (iaeiy.collisionThreshold < 0){
    iaeiy.lives--;
    iaeiy.playerDamageAnimation();
    iaeiy.collisionThreshold = iaeiy.baseDamageDelay;
  }
};

iaeiy.playerDamageAnimation = function(){
  $(".damage_flash").fadeIn(100)
  setTimeout(function(){$(".damage_flash").fadeOut(100)},50)
}

iaeiy.playerKarmaAnimation = function(){
  iaeiy.setKarmaMultiplier();
  $(".karma_flash").html(iaeiy.karmaMultiplier + "x")
  $(".karma_flash").fadeIn(100)
  setTimeout(function(){$(".karma_flash").fadeOut(100)},50)
}

iaeiy.purgeEnemies = function(){
  $($(iaeiy.enemiesCreated).get().reverse()).each(function(index){
    var enemyToCheck= "#" + iaeiy.enemiesCreated[index].enemyName
    if ((iaeiy.selfPlayArea.left-15 >iaeiy.enemiesCreated[index].x && iaeiy.enemiesCreated[index].duration < 0) ||
      (iaeiy.selfPlayArea.right+15 < iaeiy.enemiesCreated[index].x && iaeiy.enemiesCreated[index].duration < 0) ||
      (iaeiy.selfPlayArea.up-15 > iaeiy.enemiesCreated[index].y && iaeiy.enemiesCreated[index].duration < 0) ||
      (iaeiy.selfPlayArea.down+15 < iaeiy.enemiesCreated[index].y && iaeiy.enemiesCreated[index].duration < 0)){
      $(enemyToCheck).remove();
    iaeiy.enemiesCreated.splice(index,1);
  }
})
}

iaeiy.purgeKarma = function(){
  $($(iaeiy.karmaCreated).get().reverse()).each(function(index){
    var karmaToCheck= "#" + iaeiy.karmaCreated[index].karmaName
    if ((iaeiy.selfPlayArea.left-20 >iaeiy.karmaCreated[index].x && iaeiy.karmaCreated[index].duration < 0) ||
      (iaeiy.selfPlayArea.right+20 < iaeiy.karmaCreated[index].x && iaeiy.karmaCreated[index].duration < 0) ||
      (iaeiy.selfPlayArea.up-20 > iaeiy.karmaCreated[index].y && iaeiy.karmaCreated[index].duration < 0) ||
      (iaeiy.selfPlayArea.down+20 < iaeiy.karmaCreated[index].y && iaeiy.karmaCreated[index].duration < 0)){
      $(karmaToCheck).remove();
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
iaeiy.enemyCounter = 0

iaeiy.Enemy = function (posX,posY,width,height,type,difficulty){
  var enemyName = "enemy" + iaeiy.enemyCounter
  iaeiy.enemyCounter++;
  $("#player").prepend("<div id=\"" + enemyName + "\" class=enemy style=\" height:" + height + "px; width:" + width + "px; left:" + posX + "px;  top:" + posY + "px; position:fixed\"></div>")
  this.x = posX
  this.y = posY 
  this.width = width
  this.height = height
  this.enemyName = enemyName
  this.type = type
  this.difficulty = difficulty
  this.duration = 20
}

iaeiy.karmaCounter = 0

iaeiy.Karma = function (posX,posY,type){
  console.log("Karma ")
  var karmaName = "karma" + iaeiy.karmaCounter
  iaeiy.karmaCounter++;
  $("#player").prepend("<div id=\"" + karmaName + "\" class=karma style=\" height:20px; width:20px; left:" + posX + "px;  top:" + posY + "px; position:fixed\"></div>")
  this.x = posX
  this.y = posY 
  this.width = 20
  this.height = 20
  this.karmaName = karmaName
  this.type = type
  this.duration = 20
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
  if (iaeiy.levelOn){
    if (iaeiy.karmaTimer < 0){
      iaeiy.createKarma()
      iaeiy.karmaTimer = iaeiy.karmaBaseDelay
    }
    iaeiy.karmaTimer--;
  } 
}

iaeiy.startLevel = function(diffic,spawnTimer){
  iaeiy.levelOn = true;
  iaeiy.levelDifficulty = diffic;
  iaeiy.levelSpawnTimer = spawnTimer;
  iaeiy.collisionThreshold = iaeiy.baseCollisionThreshold
}

iaeiy.karmaDecay = function(){
  iaeiy.karmaDecayTimer--;
  if (iaeiy.karmaDecayTimer < 0 && iaeiy.levelKarmaCollected > 0){
    iaeiy.levelKarmaCollected--;
    iaeiy.playerKarmaAnimation();
    iaeiy.karmaDecayTimer = iaeiy.karmaBaseDecay; 
  }
  if (iaeiy.levelKarmaCollected === 0){
    iaeiy.karmaDecayTimer = iaeiy.karmaBaseDecay
  }
}

//I played with this and how to do it better- this produces the most
//consistant effect, unfortunately.
iaeiy.updateBoard = function(){
  $("#game_timer").html(iaeiy.timerName + iaeiy.levelTimer)
  $("#karma_collected").html("karma collected: " + iaeiy.karmaCollected)
  $("#difficulty_display").html("enemy speed:     " + iaeiy.levelDifficulty)
  $("#spawn_delay").html("spawn interval: " + iaeiy.levelSpawnTimer)
  $("#max_size").html("maximum size:    " + iaeiy.levelMaxSize)
  iaeiy.updateHealth();
  iaeiy.updateKarma();
}

iaeiy.updateHealth = function(){
  switch(iaeiy.lives){
    case 5:
    $("#health5").fadeIn()
    $('#health4').fadeIn()
    $("#health3").fadeIn()
    $("#health2").fadeIn()
    $("#health1").fadeIn()
    break;
    case 4:
    $("#health5").fadeOut()
    $('#health4').fadeIn()
    $("#health3").fadeIn()
    $("#health2").fadeIn()
    $("#health1").fadeIn()
    break;
    case 3:
    $("#health5").fadeOut()
    $("#health4").fadeOut()
    $("#health3").fadeIn()
    $("#health2").fadeIn()
    $("#health1").fadeIn()
    break;
    case 2:
    $("#health5").fadeOut()
    $("#health4").fadeOut()
    $("#health3").fadeOut()
    $("#health2").fadeIn()
    $("#health1").fadeIn()
    break;
    case 1:
    $("#health5").fadeOut()
    $("#health4").fadeOut()
    $("#health3").fadeOut()
    $("#health2").fadeOut()
    $("#health1").fadeIn()
    break;
    case 0:
    $("#health5").fadeOut()
    $("#health4").fadeOut()
    $("#health3").fadeOut()
    $("#health2").fadeOut()
    $("#health1").fadeOut()
    break;
    default:
    console.log("life error detected")
  }
}

iaeiy.updateKarma = function(){
  switch(iaeiy.levelKarmaCollected){
    case 5:
    $("#karma_bar5").fadeIn()
    $('#karma_bar4').fadeIn()
    $("#karma_bar3").fadeIn()
    $("#karma_bar2").fadeIn()
    $("#karma_bar1").fadeIn()
    break;
    case 4:
    $("#karma_bar5").fadeOut()
    $('#karma_bar4').fadeIn()
    $("#karma_bar3").fadeIn()
    $("#karma_bar2").fadeIn()
    $("#karma_bar1").fadeIn()
    break;
    case 3:
    $("#karma_bar5").fadeOut()
    $("#karma_bar4").fadeOut()
    $("#karma_bar3").fadeIn()
    $("#karma_bar2").fadeIn()
    $("#karma_bar1").fadeIn()
    break;
    case 2:
    $("#karma_bar5").fadeOut()
    $("#karma_bar4").fadeOut()
    $("#karma_bar3").fadeOut()
    $("#karma_bar2").fadeIn()
    $("#karma_bar1").fadeIn()
    break;
    case 1:
    $("#karma_bar5").fadeOut()
    $("#karma_bar4").fadeOut()
    $("#karma_bar3").fadeOut()
    $("#karma_bar2").fadeOut()
    $("#karma_bar1").fadeIn()
    break;
    case 0:
    $("#karma_bar5").fadeOut()
    $("#karma_bar4").fadeOut()
    $("#karma_bar3").fadeOut()
    $("#karma_bar2").fadeOut()
    $("#karma_bar1").fadeOut()
    break;
    default:
    console.log("karma error detected")
  }
}

iaeiy.endLevel = function(){
  iaeiy.levelOn = false
}

iaeiy.startGame = function(){
  $(".front").fadeOut(1000)
  $("#start_button").fadeOut(600)
  $("#announcer").fadeOut(1000)
  $("title").html("it all ends in you")
  $("audio")[0].play();
  iaeiy.updateLevel(iaeiy.levelVal)
  iaeiy.levelKarmaCollected = 0
  iaeiy.loadLevel();
}

iaeiy.karmaMultiplier = 1
iaeiy.setKarmaMultiplier = function(){
  switch (iaeiy.levelKarmaCollected){
    case 5:
    iaeiy.karmaMultiplier = 10
    break;
    case 4:
    iaeiy.karmaMultiplier = 5
    break;
    case 3:
    iaeiy.karmaMultiplier = 2.5
    break;
    case 2:
    iaeiy.karmaMultiplier = 2.0
    break;
    case 1:
    iaeiy.karmaMultiplier = 1.5
    break;
    case 0:
    iaeiy.karmaMultiplier = 1
    break;
    default:
    console.log ("karma multiplier error")
  }
}


iaeiy.checkWinLose = function(){
  if(iaeiy.lives < 1){
    iaeiy.youLose();
    iaeiy.clearLevel();
  };
  if (iaeiy.gameType === "challenge"){
    if (iaeiy.levelTimer < 0){
      iaeiy.levelWin();
      iaeiy.clearLevel();
    }
    iaeiy.levelTimer -= (20*iaeiy.karmaMultiplier);
  } else if (iaeiy.gameType === "endless"){
    iaeiy.levelTimer += (20*iaeiy.karmaMultiplier)
  }

}

iaeiy.youLose = function(){
  $(".front").fadeIn(5000)
  $("title").html("breathe again")
  iaeiy.announcerRandomise();
  $("#announcer").html("overconfidence.")
  if (iaeiy.gameType==="challenge"){
    $("#score_stat").html("you reached level " + (iaeiy.levelVal+1))
    $("#karma_stat").html("karma collected: " + iaeiy.karmaCollected)
    $("#comment").html("you were " + iaeiy.levelTimer + " points from the end")
    iaeiy.karmaCollected = 0;
    iaeiy.levelVal = 0;
    $(".options").fadeIn();
  } else if (iaeiy.gameType==="endless"){
    $("#score_stat").html("score reached: " + iaeiy.levelTimer)
    $("#karma_stat").html("karma collected: " + iaeiy.karmaCollected)
    $("#comment").html("");
    iaeiy.karmaCollected = 0;
    iaeiy.levelVal = 0;
  }
  setTimeout(function(){
    $("#start_button").html("again?")
    $("#start_button").fadeIn(700)
    $("#announcer").fadeIn(100)
  },6000)

}

iaeiy.loadLevel = function(){
  if (iaeiy.gameType==="challenge"){
    iaeiy.timerName = "points left:"
    iaeiy.levelTimer=iaeiy.levelSettings[iaeiy.levelVal].timer
    iaeiy.lives= iaeiy.levelSettings[iaeiy.levelVal].lives
    iaeiy.levelOn=true
  } else if (iaeiy.gameType==="endless"){
    iaeiy.timerName = "score:"
    iaeiy.levelTimer = 0
    iaeiy.lives = 5;
    iaeiy.levelOn = true
  }
  $("#karma_bar5").fadeOut()
  $('#karma_bar4').fadeOut()
  $("#karma_bar3").fadeOut()
  $("#karma_bar2").fadeOut()
  $("#karma_bar1").fadeOut()
  $("#reset").hide()
  $(".damage_flash").hide()
  $(".karma_flash").hide()
  $("#instructions").hide()
}

iaeiy.clearLevel = function(){
  clearInterval(iaeiy.refreshInterval);
  iaeiy.purgeInterval = setInterval(iaeiy.clearBullets, 20)
  setTimeout(function(){
    clearInterval(iaeiy.purgeInterval)
  },1000)
}

iaeiy.clearBullets = function(){
  $($(iaeiy.enemiesCreated).get().reverse()).each(function(index){
    var enemyToRemove= "#" + iaeiy.enemiesCreated[index].enemyName
    $(enemyToRemove).remove();
    iaeiy.enemiesCreated.splice(index,1);
  })
  $($(iaeiy.karmaCreated).get().reverse()).each(function(index){
    var karmaToRemove= "#" + iaeiy.karmaCreated[index].karmaName
    $(karmaToRemove).remove();
    iaeiy.karmaCreated.splice(index,1);
  })
  console.log("clearing")
}

iaeiy.announcerRandomise = function(){
  var xpos = randomInt(60,15) + "%"
  var ypos = randomInt(40,20) + "%"
  $("#announcer").animate({top: ypos,left: xpos})
}

iaeiy.levelWin = function(){
  $(".front").fadeIn(2000)
  $("title").html("take breath")
  $("#start_button").fadeIn(1000)
  iaeiy.announcerRandomise();
  $("#announcer").fadeIn(1000)
  $("#start_button").html("next stage")
  $("#karma_stat").html("karma collected: " + iaeiy.karmaCollected)
  $("#comment").html("prepare yourself")
  $("#reset").fadeIn()
  $(".options").hide()
  if (iaeiy.levelVal === iaeiy.levelSettings.length-1){
    $("#announcer").html("confidence brings mastery. congratulations.")
    $("#score_stat").html("challenge mode complete!")  
  } else {
  $("#announcer").html("success brings confidence")
  $("#score_stat").html("next level: " + (iaeiy.levelVal+2))
  }
  if (iaeiy.levelVal !== iaeiy.levelSettings.length){iaeiy.levelVal++};
  iaeiy.updateLevel(iaeiy.levelVal);
}

iaeiy.updateLevel = function(i){
  if(iaeiy.gameType==="challenge"){
    iaeiy.lives = iaeiy.levelSettings[i].lives;
    iaeiy.levelTimer = iaeiy.levelSettings[i].timer;
    iaeiy.levelDifficulty = iaeiy.levelSettings[i].difficulty;
    iaeiy.levelSpawnTimer = iaeiy.levelSettings[i].spawnTimer;
    iaeiy.levelMaxSize = iaeiy.levelSettings[i].maxSize;
  } else if (iaeiy.gameType==="endless"){
    iaeiy.lives = 5;
    iaeiy.levelTimer = 0;
    iaeiy.levelDifficulty = getIntId("diff_option_display");
    iaeiy.levelSpawnTimer = getIntId("spawn_option_display");
    iaeiy.levelMaxSize = getIntId("size_option_display");
  }
}

var getIntId = function(name){
  var idname = "#" + name;
  return parseInt($(idname).html())
}

iaeiy.addValToId = function(name,valToAdd){
 var idName = "#" + name;
 var newVal = parseInt($(idName).html())
 newVal += valToAdd
 $(idName).html(newVal)
}

iaeiy.checkOptionValid = function(name,max,min){
  if (!$("#endless_option").hasClass("button_inactive") && (getIntId(name)<max) && (getIntId(name)>min)){
    return true
  } else {return false}
}

iaeiy.initOptions = function(){
  $(".endless_options").hide();
  // $($("#dogemode")).click(function(){
  //   iaeiy.dogeRLY();
  // });
  $("#normal_option").click(function(){
    iaeiy.gameType = "challenge"
    $("#normal_option").removeClass("button_inactive")
    $("#endless_option").addClass("button_inactive")
    $(".endless_options").addClass("button_inactive")
    $(".endless_options").slideUp()
  })
  $("#endless_option").click(function(){
    iaeiy.gameType = "endless"
    $("#normal_option").addClass("button_inactive")
    $("#endless_option").removeClass("button_inactive")
    $(".endless_options").removeClass("button_inactive")
    $(".endless_options").slideDown()
  })
  $($(".option_button_up")[0]).click(function(){
    if(iaeiy.checkOptionValid("diff_option_display",6,2)){
      iaeiy.addValToId("diff_option_display",1);
    }
  })
  $($(".option_button_up")[1]).click(function(){
    if(iaeiy.checkOptionValid("spawn_option_display",20,0)){
      iaeiy.addValToId("spawn_option_display",5);
    }
  })
  $($(".option_button_up")[2]).click(function(){
    if(iaeiy.checkOptionValid("size_option_display",65,15)){
      iaeiy.addValToId("size_option_display",5);
    }
  })
  $($(".option_button_down")[0]).click(function(){
    if(iaeiy.checkOptionValid("diff_option_display",7,3)){
      iaeiy.addValToId("diff_option_display",-1);
    }
  })
  $($(".option_button_down")[1]).click(function(){
    if(iaeiy.checkOptionValid("spawn_option_display",25,5)){
      iaeiy.addValToId("spawn_option_display",-5);
    }
  })
  $($(".option_button_down")[2]).click(function(){
    if(iaeiy.checkOptionValid("size_option_display",70,20)){
      iaeiy.addValToId("size_option_display",-5);
    }
  })
  $($("#reset")).hover(function(){
    $(this).removeClass("button_inactive")
  }, function(){
    $(this).addClass("button_inactive")
  })
  $($("#dogemode")).hover(function(){
    $(this).removeClass("button_inactive")
  }, function(){
    $(this).addClass("button_inactive")
  })
}

// iaeiy.dogeModeOn = false

// iaeiy.dogeRLY = function(){
//   if (iaeiy.dogeModeOn = false){
//     var RLY = prompt("Are you shure? Type 'wow' to confirm")
//     if (RLY ==="wow"){
//       iaeiy.dogeModeOn = true
//       iaeiy.dogeModeActivate();
//     }
//   }
// }

// iaeiy.dogeModeActivate = function(){
//   $("div").css("font-family","Comic Sans MS")
// }