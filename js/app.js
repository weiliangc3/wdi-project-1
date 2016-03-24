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
 setInterval(iaeiy.playerMovement, 20)
 iaeiy.playerMovement();

}


;
var keys = {}

$(document).keydown(function(e) {
  keys[e.keyCode] = true;
});

$(document).keyup(function(e) {
  delete keys[e.keyCode];
});

iaeiy.playerMovement = function (){
  for (var direction in keys) {
    if (!keys.hasOwnProperty(direction)) continue;
    if (direction == 37) {
      if (iaeiy.player.x > 3){
        $("#player").animate({left: "-=5"}, 0);
      }                
    }
    if (iaeiy.player.y > 3){
      if (direction == 38) {
        $("#player").animate({top: "-=5"}, 0);  
      }
    }
    if (iaeiy.player.x < 480){
      if (direction == 39) {
        $("#player").animate({left: "+=5"}, 0);  
      }
    }
    if (iaeiy.player.y < 580){
      if (direction == 40) {
        $("#player").animate({top: "+=5"}, 0);  
      }
    }
  }

  iaeiy.checkCollisions()

}

iaeiy.checkCollisions = function(){
  console.log("ITS FIRING");
  iaeiy.player.x = $("#player").position().left
  iaeiy.player.y = $("#player").position().top
  iaeiy.enemy1.x = $("#enemy1").position().left
  iaeiy.enemy1.y = $("#enemy1").position().top

  if (iaeiy.player.x < iaeiy.enemy1.x + iaeiy.enemy1.width &&
     iaeiy.player.x + iaeiy.player.width > iaeiy.enemy1.x &&
     iaeiy.player.y < iaeiy.enemy1.y + iaeiy.enemy1.height &&
     iaeiy.player.height + iaeiy.player.y > iaeiy.enemy1.y){
    console.log('it works')
  }
}


iaeiy.player = {
  x: 40,
  y: 40,
  width: 20,
  height: 20
}

iaeiy.enemy1 = {  
  x: 400,
  y: 400,
  width: 20,
  height: 20
}

// var player = {x: 5, y: 5, width: 50, height: 50}
// var enemy = {x: 20, y: 10, width: 10, height: 10}

// if (iaeiy.player.x < iaeiy.enemy.x + iaeiy.enemy.width &&
//    iaeiy.player.x + iaeiy.player.width > iaeiy.enemy.x &&
//    iaeiy.player.y < iaeiy.enemy.y + iaeiy.enemy.height &&
//    iaeiy.player.height + iaeiy.player.y > iaeiy.enemy.y) {console.log ("collisions")}


// function playerMovement() {
//   console.log("stuff");
//   for (var direction in keys) {
//     if (!keys.hasOwnProperty(direction)) continue;
//     if (direction == 37) {
//       $("#player").animate({left: "-=5"}, 0);                
//     }
//     if (direction == 38) {
//       $("#player").animate({top: "-=5"}, 0);  
//     }
//     if (direction == 39) {
//       $("#player").animate({left: "+=5"}, 0);  
//     }
//     if (direction == 40) {
//       $("#player").animate({top: "+=5"}, 0);  
//     }
//   }
// }
