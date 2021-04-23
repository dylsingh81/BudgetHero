//old main 2// Frank Poth 03/23/2017

window.addEventListener("load", function(event) {

    "use strict";
  
        ///////////////////
      //// FUNCTIONS ////
    ///////////////////
  
    var keyDownUp = function(event) {
  
      controller.keyDownUp(event.type, event.keyCode);
  
    };
  
    var keyPress = function(event) {
      controller.keyPress(event.type, event.keyCode);
    };
  
    var resize = function(event) {
  
      display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
      display.render();
  
    };
  
    var render = function() {
      //display.drawBackground()
      display.drawMap(game.world.map, game.world.columns, game.world.isBinning, game.world.coin_bins, game.world.coins_map);
      display.drawPlayer(game.world.player, game.world.player.color1, game.world.player.color2);
      display.render();
  
    };
  
    var update = function() {
  
      if (controller.left.active)  { game.world.player.moveLeft();  }
      if (controller.right.active) { game.world.player.moveRight(); }
      if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }
      
      if (controller.deposit)  { game.world.deposit(game.world.player.x, game.world.player.y); controller.deposit = false; }
  
      game.update();
  
    };
  
        /////////////////
      //// OBJECTS ////
    /////////////////
  
    var controller = new Controller();
    var display    = new Display(document.querySelector("canvas"));
    var game       = new Game();
    var engine     = new Engine(1000/30, render, update);
  
        ////////////////////
      //// INITIALIZE ////
    ////////////////////
  
    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;
  
    display.tile_sheet.image.addEventListener("load", function(event) {
  
      resize();
  
      engine.start();
  
    }, { once:true });
  
    
    
  
    //display.tile_sheet.image.src = "./maps/final_maps/level1/level1tiles.png";
    //display.tile_sheet.backgroundImage.src = "./maps/final_maps/level1/level1bg2.png"
    
    display.tile_sheet.image.src = "./maps/final_maps/binning/bin_tiles.png";
    display.tile_sheet.backgroundImage.src = "./maps/final_maps/binning/bin_bg.png"
  
    //display.tile_sheet.image.src = "./maps/final_maps/level2/level2tiles.png";
    //display.tile_sheet.backgroundImage.src = "./maps/final_maps/level2/level2bg.png"
  
    //display.tile_sheet.image.src = "./maps/final_maps/level3/level3tiles.png";
    //display.tile_sheet.backgroundImage.src = "./maps/final_maps/level3/level3bg.png"
  
  
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup",   keyDownUp);
    window.addEventListener("keypress",   keyPress);
    window.addEventListener("resize",  resize);
  
  });
  
  