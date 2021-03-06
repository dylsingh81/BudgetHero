/* Main.js has three main parts: The controller, display, and game logic. It also has an engine which combines the
three logical parts which are otherwise */

//Adapted from https://github.com/pothonprogramming/pothonprogramming.github.io

window.addEventListener("load", function(event) {

  "use strict";

      ///////////////////
    //// FUNCTIONS ////
  ///////////////////

  var render = function() {

    display.renderColor(game.color);
    display.render();

  };

  var update = function() {

    game.update();

  };

    /* The controller handles user input. */
    var controller = new Controller();
    /* The display handles window resizing, as well as the on screen canvas. */
    var display    = new Display(document.querySelector("canvas"));
    /* The game will eventually hold our game logic. */
    var game       = new Game();
    /* The engine is where the above three sections can interact. */
    //30 FPS 1000/30
    var engine     = new Engine(1000/30, render, update);

    //Intialize event listeners and start engine and display
    window.addEventListener("resize",  display.handleResize);
    window.addEventListener("keydown", controller.handleKeyDownUp);
    window.addEventListener("keyup",   controller.handleKeyDownUp);

    display.resize();
    //Exceute render and update 30 times per second
    engine.start();

});
