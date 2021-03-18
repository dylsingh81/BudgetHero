// Frank Poth 03/23/2018

/* I moved the world object into its own class and I made the Player class a class
inside of Game.World. I am doing this in order to compartmentalize my objects more
accurately. The Player class will never be used outside of the World class, and the
World class will never be used outside of the Game class, therefore the classes will
be nested: Game -> Game.World -> Game.World.Player */

const Game = function() {

  /* The world object is now its own class. */
  this.world = new Game.World();

  /* The Game.update function works the same as in part 2. */
  this.update = function() {

    this.world.update();

  };

};

Game.prototype = { constructor : Game };

/* The world is now its own class. */
Game.World = function(friction = 0.9, gravity = 2) {

  this.friction = friction;
  this.gravity  = gravity;

  /* Player is now its own class inside of the Game.World object. */
  this.player   = new Game.World.Player();

  /* Here is the map data. Later on I will load it from a json file, but for now
  I will just hardcode it here. */
  this.columns   = 28;
  this.rows      = 16;
  //this.rows      = 18;
  this.tile_size = 16;
  
  this.map = [6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6537,6536,6535,6534,6533,6532,6531,6530,6529,6528,6535,
    6527,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6534,
    6528,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6533,
    6529,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6532,
    6530,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6531,
    6531,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5852,5189,
    6532,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5852,5189,5866,
    6533,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5852,5189,5188,5866,
    6534,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5852,5189,5188,5866,5866,
    6535,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6019,5189,5188,5866,5866,5866,
    6536,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6103,5188,5866,5866,5866,5866,
    6537,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6272,6611,6612,6613,6613,
    6537,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    6537,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2792,2793,2794,2795,2796,2797,
    2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2876,2877,2878,2879,2880,2881,]  
  /*
  this.map = [9,1,0,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,3,
    9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,
    9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,
    9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,
    9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,
    9,64,64,64,64,64,64,64,64,64,64,64,64,64,64,75,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,
    9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,48,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,
    9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,48,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,
    9,64,64,64,64,64,64,64,64,64,64,64,64,64,64,48,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,
    30,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,48,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,
    29,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,75,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,
    29,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,30,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    19,18,19,19,19,3,19,19,19,19,3,19,19,19,19,3,19,19,19,19,3,19,19,19,19,3,19,30,
    10,9,10,10,10,30,10,10,10,10,30,10,10,10,10,30,10,10,10,10,30,10,10,10,10,30,10,30,];
    */

  /* Height and Width now depend on the map size. */
  this.height   = this.tile_size * this.rows;
  this.width    = this.tile_size * this.columns;

};

/* Now that world is a class, I moved its more generic functions into its prototype. */
Game.World.prototype = {

  constructor: Game.World,

  collideObject:function(object) {// Same as in part 2.

    if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
    else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
    if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
    else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

  },

  update:function() {

    this.player.velocity_y += this.gravity;
    this.player.update();

    this.player.velocity_x *= this.friction;
    this.player.velocity_y *= this.friction;

    this.collideObject(this.player);

  }

};

/* The player is also its own class now. Since player only appears in the context
of Game.World, that is where it is defined. */
Game.World.Player = function(x, y) {

  this.color1     = "#404040";
  this.color2     = "#f0f0f0";
  this.height     = 12;
  this.jumping    = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.width      = 12;
  this.x          = 100;
  this.y          = 50;

};

Game.World.Player.prototype = {

  constructor : Game.World.Player,

  jump:function() {

    if (!this.jumping) {

      this.jumping     = true;
      this.velocity_y -= 20;

    }

  },

  moveLeft:function()  { this.velocity_x -= 0.5; },
  moveRight:function() { this.velocity_x += 0.5; },

  update:function() {

    this.x += this.velocity_x;
    this.y += this.velocity_y;

  }

};
