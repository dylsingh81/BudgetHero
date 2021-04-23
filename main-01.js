//old main 07
// Frank Poth 04/06/2018

/* Changes:

  1. The update function now check on every frame for game.world.door. If a door
     is selected, the game engine stops and the door's level is loaded.
  2. When the game is first initialized at the bottom of this file, game.world is
     loaded using it's default values defined in its constructor.
  3. The AssetsManager class has been changed to load both images and json.

*/

window.addEventListener("load", function(event) {

  "use strict";

  //// CONSTANTS ////

  /* Each zone has a url that looks like: zoneXX.json, where XX is the current zone
  identifier. When loading zones, I use the game.world's zone identifier with these
  two constants to construct a url that points to the appropriate zone file. */
  /* I updated this after I made the video. I decided to move the zone files into
  the 06 folder because I won't be using these levels again in future parts. */
  const ZONE_PREFIX = "zone";
  const ZONE_SUFFIX = ".json";

      /////////////////
    //// CLASSES ////
  /////////////////

  const AssetsManager = function() {

    this.tile_set_image = undefined;
    this.background_image = undefined;
    this.sprite_sheet = undefined;
    this.coin_sheet = undefined;
  };

  AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    /* Requests a file and hands the callback function the contents of that file
    parsed by JSON.parse. */
    requestJSON:function(url, callback) {

      let request = new XMLHttpRequest();

      request.addEventListener("load", function(event) {

        callback(JSON.parse(this.responseText));

      }, { once:true });

      request.open("GET", url);
      request.send();

    },

    /* Creates a new Image and sets its src attribute to the specified url. When
    the image loads, the callback function is called. */
    requestImage:function(url, callback) {

      let image = new Image();

      image.addEventListener("load", function(event) {

        callback(image);

      }, { once:true });

      image.src = url;

    },

  };

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

      display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
      display.render();
  
      var rectangle = display.context.canvas.getBoundingClientRect();
  
      coin_p.style.right = rectangle.left + "px";
      coin_p.style.top  = rectangle.top + "px";
      coin_p.style.fontSize = (game.world.tile_set.tile_size * rectangle.height / game.world.height)/1.8 + "px";
      coin_p.style.backgroundColor = "rgba(0,0,0,0.7)"
      coin_p.style.padding = "5px"

      health_p.style.left = rectangle.left + "px";
      health_p.style.top  = rectangle.top + "px";
      health_p.style.fontSize = (game.world.tile_set.tile_size * rectangle.height / game.world.height)/1.8 + "px";
      health_p.style.backgroundColor = "rgba(0,0,0,0.7)"
      health_p.style.padding = "5px"
  
    };

  var render = function() {

      var frame = undefined

    display.drawBackground(assets_manager.background_image)
    if(game.world.is_bin){
      display.drawCoinBins(game.world.columns,game.world.coins_map, game.world.coin_bins, game.world.tile_set.tile_size)
    }
    display.drawMap   (assets_manager.tile_set_image,
    game.world.tile_set.columns, game.world.graphical_map, game.world.columns,  game.world.tile_set.tile_size);



    for (let index = game.world.coins.length - 1; index > -1; -- index) {

      let coin = game.world.coins[index];

      frame = game.world.tile_set.frames[coin.frame_value];

      display.drawObject(assets_manager.coin_sheet,
        frame.x, frame.y,
        coin.x + Math.floor(coin.width * 0.5 - frame.width * 0.5) + frame.offset_x,
        coin.y + frame.offset_y, frame.width, frame.height);

    }

    frame = game.world.tile_set.frames[game.world.player.frame_value];

    display.drawObject(assets_manager.sprite_sheet,
    frame.x, frame.y,
    game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
    game.world.player.y + frame.offset_y, frame.width, frame.height);


    
    coin_p.innerHTML = "Coins: " + game.world.coin_count;
    health_p.innerHTML = "Health: " + game.world.health;
    display.render();

  };

  var update = function() {

    if (controller.left.active ) { game.world.player.moveLeft ();                               }
    if (controller.right.active) { game.world.player.moveRight();                               }
    if (controller.up.active   ) { game.world.player.jump();      controller.up.active = false; }

    if (controller.deposit)  { game.world.deposit(game.world.player.x, game.world.player.y); controller.deposit = false;}
    if (controller.withdraw)  { game.world.withdraw(game.world.player.x, game.world.player.y); controller.withdraw = false;}
    
    //if (controller.deposit)  { game.world.deposit(game.world.player.x, game.world.player.y); controller.deposit = false;}
    


    game.update();

    /* This if statement checks to see if a door has been selected by the player.
    If the player collides with a door, he selects it. The engine is then stopped
    and the assets_manager loads the door's level. */
    if (game.world.door) {
      
      engine.stop();

      /* Here I'm requesting the JSON file to use to populate the game.world object. */
      assets_manager.requestJSON(ZONE_PREFIX + game.world.door.destination_zone + ZONE_SUFFIX, (zone) => {
        assets_manager.requestImage(zone.tile_set_path, (image) => {
          assets_manager.tile_set_image = image;
        });
    
        assets_manager.requestImage(zone.background_image_path, (image) => {
          assets_manager.background_image = image;
        });
        console.log(zone)
        game.world.setup(zone);
        
        engine.start();

      });

      return;

    }

  };

      /////////////////
    //// OBJECTS ////
  /////////////////

  var assets_manager = new AssetsManager();
  var controller     = new Controller();
  var display        = new Display(document.querySelector("canvas"));
  var game           = new Game();
  var engine         = new Engine(1000/30, render, update);

  var coin_p              = document.createElement("p");
  coin_p.setAttribute("style", "color:#c07000; font-size:2.0em; position:fixed;");
  coin_p.innerHTML = "Coins: 0";
  document.body.appendChild(coin_p);

  var health_p              = document.createElement("p");
  health_p.setAttribute("style", "color:#c07000; font-size:2.0em; position:fixed;");
  health_p.innerHTML = "Health: 3";
  document.body.appendChild(health_p);

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width  = game.world.width;
  display.buffer.imageSmoothingEnabled = false;

  assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {
    game.world.setup(zone);

    assets_manager.requestImage(zone.tile_set_path, (image) => {

      assets_manager.tile_set_image = image;

      resize();
      engine.start();

    });

    assets_manager.requestImage(zone.background_image_path, (image) => {

      assets_manager.background_image = image;

      resize();
      engine.start();

    });

    assets_manager.requestImage(zone.sprite_sheet_path, (image) => {

      assets_manager.sprite_sheet = image;

      resize();
      engine.start();

    });

    assets_manager.requestImage(zone.coin_sheet_path, (image) => {

      assets_manager.coin_sheet = image;

      resize();
      engine.start();

    });
  });

 

 

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup"  , keyDownUp);
  window.addEventListener("keypress",   keyPress);
  window.addEventListener("resize" , resize);

});
