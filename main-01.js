/* Main.js has three main parts: The controller, display, and game logic. It also has an engine which combines the
three logical parts which are otherwise */

//Adapted from https://github.com/pothonprogramming/pothonprogramming.github.io

window.addEventListener("load", function(event) {

  "use strict";

      ///////////////////
    //// FUNCTIONS ////
  ///////////////////

  
  var keyDownUp = function(event) {

    controller.keyDownUp(event.type, event.keyCode);

  };


  var resize = function(event) {

    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
    display.render();

  };

  var render = function() {

    display.fill(game.world.background_color);// Clear background to game's background color.
    display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
    display.render();

  };

  var update = function() {

    if (controller.left.active)  { game.world.player.moveLeft();  }
    if (controller.right.active) { game.world.player.moveRight(); }
    if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }

    game.update();

  };

  var controller = new Controller();
  var display    = new Display(document.querySelector("canvas"));
  var game       = new Game();
  var engine     = new Engine(1000/30, render, update);

  /* This is very important. The buffer canvas must be pixel for pixel the same
  size as the world dimensions to properly scale the graphics. All the game knows
  are player location and world dimensions. We have to tell the display to match them. */
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup",   keyDownUp);
  window.addEventListener("resize",  resize);

  resize();

  engine.start();

});
