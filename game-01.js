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
Game.World = function(friction = 0.9, gravity = 3) {

  this.friction = friction;
  this.gravity  = gravity;

  /* Player is now its own class inside of the Game.World object. */
  this.player   = new Game.World.Player();

  /* Here is the map data. Later on I will load it from a json file, but for now
  I will just hardcode it here. */
  this.columns   = 18;
  this.rows      = 13;
  this.tile_size = 16;
  this.map = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,60,61,64,-1,-1,20,21,21,21,22,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,37,38,38,38,38,21,21,21,21,
    21,53,21,21,21,21,21,21,21,21,55,55,55,55,38,38,38,38];

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
