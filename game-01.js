// Frank Poth 04/18/2018

/* Changes since part 6:

  1. Added the coins array to the zone file.
  2. Moved the collideObject method out of Game.Door and into Game.Object.
  3. Renamed collideObject to collideObjectCenter and made a new collideObject function for rectangular collision detection.
  4. Added the Game.Coin class and Game.Grass class.
  5. Added frames for coins and grass to the tile_set.
  6. Made a slight change to the Game.Animator constructor.
  7. Added coin_count to count coins  .
  8. Added the grass array to the zone file. Also reflected in Game.World

*/

const Game = function() {

  this.world    = new Game.World();

  this.update   = function() {

    this.world.update();

  };

};
Game.prototype = { constructor : Game };

// Made the default animation type "loop":
Game.Animator = function(frame_set, delay, mode = "loop") {

 this.count       = 0;
 this.delay       = (delay >= 1) ? delay : 1;
 this.frame_set   = frame_set;
 this.frame_index = 0;
 this.frame_value = frame_set[0];
 this.mode        = mode;

};
Game.Animator.prototype = {

 constructor:Game.Animator,

 animate:function() {

   switch(this.mode) {

     case "loop" : this.loop(); break;
     case "pause":              break;

   }

 },

 changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {

   if (this.frame_set === frame_set) { return; }

   this.count       = 0;
   this.delay       = delay;
   this.frame_set   = frame_set;
   this.frame_index = frame_index;
   this.frame_value = frame_set[frame_index];
   this.mode        = mode;

 },

 loop:function() {

   this.count ++;

   while(this.count > this.delay) {

     this.count -= this.delay;

     this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;

     this.frame_value = this.frame_set[this.frame_index];

   }

 }

};

Game.Collider = function() {

  /* I changed this so all the checks happen in y first order. */
  this.collide = function(value, object, tile_x, tile_y, tile_size, world) {

    switch(value) {

      case  1:     this.collidePlatformTop    (object, tile_y            ); break;
      case  2:     this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  3: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  4:     this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  5: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  6: if (this.collidePlatformRight  (object, tile_x + tile_size)) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  7: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  8:     this.collidePlatformLeft   (object, tile_x            ); break;
      case  9: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 10: if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 12: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 13: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 14: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 15: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case -2:     this.collideSpike          (world                     );break;

    }

  }

};
Game.Collider.prototype = {

  constructor: Game.Collider,

  collidePlatformBottom:function(object, tile_bottom) {

    if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {

      object.setTop(tile_bottom);
      object.velocity_y = 0;
      return true;

    } return false;

  },

  collidePlatformLeft:function(object, tile_left) {

    if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {

      object.setRight(tile_left - 0.01);
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformRight:function(object, tile_right) {

    if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {

      object.setLeft(tile_right);
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformTop:function(object, tile_top) {

    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {

      object.setBottom(tile_top - 0.01);
      object.velocity_y = 0;
      object.jumping    = false;
      return true;

    } return false;

  },

  collideSpike:function(world) {
    console.log("Hit Spike")
    world.health--
    //Respawn Player
    const respawnX = world.spawn_point.x
    const respawnY = world.spawn_point.y
    //console.log(respawnX, respawnY, world.spawn_point)
    world.player.setCenterX   (respawnX);
    world.player.setOldCenterX(respawnX);
    world.player.setCenterY   (respawnY);
    world.player.setOldCenterY(respawnY);
    return
  }

 };

// Added default values of 0 for offset_x and offset_y
Game.Frame = function(x, y, width, height, offset_x = 0, offset_y = 0) {

  this.x        = x;
  this.y        = y;
  this.width    = width;
  this.height   = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;

};
Game.Frame.prototype = { constructor: Game.Frame };

Game.Object = function(x, y, width, height) {

 this.height = height;
 this.width  = width;
 this.x      = x;
 this.y      = y;

};
Game.Object.prototype = {

  constructor:Game.Object,

  /* Now does rectangular collision detection. */
  collideObject:function(object) {

    if (this.getRight()  < object.getLeft()  ||
        this.getBottom() < object.getTop()   ||
        this.getLeft()   > object.getRight() ||
        this.getTop()    > object.getBottom()) return false;

    return true;

  },

  /* Does rectangular collision detection with the center of the object. */
  collideObjectCenter:function(object) {

    let center_x = object.getCenterX();
    let center_y = object.getCenterY();

    if (center_x < this.getLeft() || center_x > this.getRight() ||
        center_y < this.getTop()  || center_y > this.getBottom()) return false;

    return true;

  },

  getBottom : function()  { return this.y + this.height;       },
  getCenterX: function()  { return this.x + this.width  * 0.5; },
  getCenterY: function()  { return this.y + this.height * 0.5; },
  getLeft   : function()  { return this.x;                     },
  getRight  : function()  { return this.x + this.width;        },
  getTop    : function()  { return this.y;                     },
  setBottom : function(y) { this.y = y - this.height;          },
  setCenterX: function(x) { this.x = x - this.width  * 0.5;    },
  setCenterY: function(y) { this.y = y - this.height * 0.5;    },
  setLeft   : function(x) { this.x = x;                        },
  setRight  : function(x) { this.x = x - this.width;           },
  setTop    : function(y) { this.y = y;                        }

};

Game.MovingObject = function(x, y, width, height, velocity_max = 15) {

  Game.Object.call(this, x, y, width, height);

  this.jumping      = false;
  this.velocity_max = velocity_max;// added velocity_max so velocity can't go past 16
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.x_old        = x;
  this.y_old        = y;

};
/* I added setCenterX, setCenterY, getCenterX, and getCenterY */
Game.MovingObject.prototype = {

  getOldBottom : function()  { return this.y_old + this.height;       },
  getOldCenterX: function()  { return this.x_old + this.width  * 0.5; },
  getOldCenterY: function()  { return this.y_old + this.height * 0.5; },
  getOldLeft   : function()  { return this.x_old;                     },
  getOldRight  : function()  { return this.x_old + this.width;        },
  getOldTop    : function()  { return this.y_old;                     },
  setOldBottom : function(y) { this.y_old = y    - this.height;       },
  setOldCenterX: function(x) { this.x_old = x    - this.width  * 0.5; },
  setOldCenterY: function(y) { this.y_old = y    - this.height * 0.5; },
  setOldLeft   : function(x) { this.x_old = x;                        },
  setOldRight  : function(x) { this.x_old = x    - this.width;        },
  setOldTop    : function(y) { this.y_old = y;                        }

};
Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;

/* The coin class extends Game.Object and Game.Animation. */
Game.Coin = function(x, y) {

  Game.Object.call(this, x, y, 7, 14);
  Game.Animator.call(this, Game.Coin.prototype.frame_sets["twirl"], 15);

  this.frame_index = Math.floor(Math.random() * 2);

  /* base_x and base_y are the point around which the coin revolves. position_x
  and y are used to track the vector facing away from the base point to give the coin
  the floating effect. */
  this.base_x     = x;
  this.base_y     = y;
  this.position_x = Math.random() * Math.PI * 2;
  this.position_y = this.position_x * 2;

};
Game.Coin.prototype = {

  frame_sets: { "twirl":[12, 13, 14, 15, 16] },

  updatePosition:function() {

    this.position_x += 0.1;
    this.position_y += 0.2;

    this.x = this.base_x + Math.cos(this.position_x) * 2;
    this.y = this.base_y + Math.sin(this.position_y);

  }

};
Object.assign(Game.Coin.prototype, Game.Animator.prototype);
Object.assign(Game.Coin.prototype, Game.Object.prototype);
Game.Coin.prototype.constructor = Game.Coin;


Game.Door = function(door) {

 Game.Object.call(this, door.x, door.y, door.width, door.height);

 this.destination_x    = door.destination_x;
 this.destination_y    = door.destination_y;
 this.destination_zone = door.destination_zone;

};
Game.Door.prototype = {};
Object.assign(Game.Door.prototype, Game.Object.prototype);
Game.Door.prototype.constructor = Game.Door;

Game.Player = function(x, y) {

  Game.MovingObject.call(this, x, y, 7, 16);

  Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-left"], 10);

  this.jumping     = true;
  this.direction_x = -1;
  this.velocity_x  = 0;
  this.velocity_y  = 0;

};
Game.Player.prototype = {

  frame_sets: {

    "idle-left" : [0],
    "jump-left" : [1],
    "move-left" : [2, 3, 4, 5],
    "idle-right": [6],
    "jump-right": [7],
    "move-right": [8, 9, 10, 11]

  },

  jump: function() {

    /* Made it so you can only jump if you aren't falling faster than 10px per frame. */
    if (!this.jumping && this.velocity_y < 10) {

      this.jumping     = true;
      this.velocity_y -= 15;

    }

  },

  moveLeft: function() {

    this.direction_x = -1;
    this.velocity_x -= 0.65;

  },

  moveRight:function(frame_set) {

    this.direction_x = 1;
    this.velocity_x += 0.65;

  },

  updateAnimation:function() {

    if (this.velocity_y < 0) {

      if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "pause");
      else this.changeFrameSet(this.frame_sets["jump-right"], "pause");

    } else if (this.direction_x < 0) {

      if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 5);
      else this.changeFrameSet(this.frame_sets["idle-left"], "pause");

    } else if (this.direction_x > 0) {

      if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 5);
      else this.changeFrameSet(this.frame_sets["idle-right"], "pause");

    }

    this.animate();

  },

  updatePosition:function(gravity, friction) {

    this.x_old = this.x;
    this.y_old = this.y;

    this.velocity_y += gravity;
    this.velocity_x *= friction;

    /* Made it so that velocity cannot exceed velocity_max */
    if (Math.abs(this.velocity_x) > this.velocity_max)
    this.velocity_x = this.velocity_max * Math.sign(this.velocity_x);

    if (Math.abs(this.velocity_y) > this.velocity_max)
    this.velocity_y = this.velocity_max * Math.sign(this.velocity_y);

    this.x    += this.velocity_x;
    this.y    += this.velocity_y;

  }

};
Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;

Game.TileSet = function(columns, tile_size) {

  this.columns    = columns;
  this.tile_size  = tile_size;

  let f = Game.Frame;

  //f = (x, y, width, height, offset_x = 0, offset_y = 0) 
  this.frames =  [new f(224,0, 29,32,0,-15), // idle-left
                    new f(96,416, 29, 32, 0, -15), // jump-left
                    new f(32, 288, 29, 32, 0, -15), new f( 64, 288, 29, 32, 0, -15), new f( 98, 288, 29, 32, 0, -15), new f( 128, 288, 29, 32, 0, -15), // walk-left
                    new f(32, 0, 29,32,0,-15), // idle-right
                    new f(96,160, 29, 32, 0, -15), // jump-right
                    new f(32, 32, 29, 32, 0, -15), new f( 64, 32, 29, 32, 0, -15), new f( 98, 32, 29, 32, 0, -15), new f( 128, 32, 29, 32, 0, -15), // walk-right
                    new f(0, 0, 16, 16, 0, 0), new f(16, 0, 16, 16, 0, 0), new f(32, 0, 16, 16, 0, 0), new f(48, 0, 16, 16, 0, 0), new f(64, 0, 16, 16, 0, 0)   // coin  
                  ];
  };
  
Game.TileSet.prototype = { constructor: Game.TileSet };

Game.World = function(friction = 0.85, gravity = 2) {
  
  this.collider     = new Game.Collider();

  this.friction     = friction;
  this.gravity      = gravity;

  this.columns      = 28;
  this.rows         = 18;

  this.tile_set     = new Game.TileSet(9, 16);
  this.player       = new Game.Player(20, 200);

  this.zone_id      = "00";

  this.coins        = [];// the array of coins in this zone;
  this.coin_count   = 0;// the number of coins you have.
  this.level        = 0
  this.doors        = [];
  this.door         = undefined;
  this.health       = 3

  this.height       = this.tile_set.tile_size * this.rows;
  this.width        = this.tile_set.tile_size * this.columns;
  this.tile_sheet_size = 16
  this.ip           = -1

  //Handle all binning functions
  {
    //Map of where to print coin text information
    this.coins_map = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,505,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,505,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,505,-1,-1,-1,-1,-1,505,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,505,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,505,-1,-1,-1,-1,-1,505,-1,-1,-1,-1,-1,-1,505,-1,-1,-1,-1,505,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,505,-1,-1,-1,-1,505,-1,-1,-1,-1,-1,-1,-1,-1,-1,505,-1,-1,-1,-1,505,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,]  
    //Map of where the bins are mapped to space
    this.bins_map = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1,-1,
      -1,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1,-1,
      -1,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1,-1,
      -1,2,2,2,2,2,2,3,3,3,3,3,-1,-1,-1,-1,-1,4,4,4,4,4,4,4,4,4,4,-1,
      -1,2,2,2,2,2,2,3,3,3,3,3,-1,-1,-1,-1,4,4,4,4,4,4,4,4,4,4,4,-1,
      -1,2,2,2,2,2,2,3,3,3,3,3,-1,-1,-1,-1,4,4,4,4,4,4,4,4,4,4,4,-1,
      -1,5,5,5,5,5,5,5,5,6,6,6,-1,-1,-1,-1,-1,7,7,8,8,8,8,8,8,8,8,-1,
      -1,5,5,5,5,5,5,5,5,6,6,6,-1,-1,-1,-1,7,7,7,8,8,8,8,8,8,8,8,-1,
      -1,5,5,5,5,5,5,5,5,6,6,6,-1,-1,-1,-1,7,7,7,8,8,8,8,8,8,8,8,-1,
      -1,9,9,9,9,9,9,10,10,10,10,10,-1,-1,-1,-1,-1,11,11,11,11,11,12,12,12,12,12,-1,
      -1,9,9,9,9,9,9,10,10,10,10,10,-1,-1,-1,-1,-1,11,11,11,11,11,12,12,12,12,12,-1,
      -1,9,9,9,9,9,9,10,10,10,10,10,-1,-1,-1,-1,-1,11,11,11,11,11,12,12,12,12,12,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]    
    
    this.num_coins = 10
    //13 Bins
    this.coin_bins = [0,0,0,0,0,0,0,0,0,0,0,0,0]
    this.bins_grouping = []
    //Create coin bins
    for (let index = 0; index < this.coin_bins.length; index++) {
        binFirstIndex = this.bins_map.indexOf(index)
        binLastIndex = this.bins_map.lastIndexOf(index)
        pixelX1 = (binFirstIndex % this.columns) * this.tile_sheet_size
        pixelX2 = (binLastIndex % this.columns) * this.tile_sheet_size
        pixelY1 = Math.floor(binFirstIndex / this.columns) * this.tile_sheet_size
        pixelY2 = Math.floor(binLastIndex / this.columns) * this.tile_sheet_size 
        this.bins_grouping.push([pixelX1, pixelX2, pixelY1, pixelY2])
    }
    //Gets bin index given x and y
    this.getCoinBin = function(x, y){
      for (let i = 0; i < this.bins_grouping.length; i++) {
        bin = this.bins_grouping[i]
        if(x > bin[0] && x < bin[1] && y > bin[2] && y < bin[3])
          return i
      }
      return -1
    }
    //Deposits coin into respective bin
    this.deposit = function(playerX, playerY){
      
      binNum = this.getCoinBin(playerX, playerY)
      //console.log(this.is_bin)
      if(binNum > -1 && this.is_bin && this.coin_count > 0){
        this.coin_bins[binNum] += 1
        this.coin_count--
      }
    }
    //Withdraws coin into respective bin
    this.withdraw = function(playerX, playerY){
      binNum = this.getCoinBin(playerX, playerY)
      //console.log(this.is_bin)
      if(binNum > -1 && this.is_bin && this.coin_bins[binNum] > 0){
        this.coin_bins[binNum] -= 1
        this.coin_count++
      }
    }

    this.setIp = function(ip){
      this.ip = ip
    }
  }
};
Game.World.prototype = {

  constructor: Game.World,

  collideObject:function(object) {

    /* I got rid of the world boundary collision. Now it's up to the tiles to keep
    the player from falling out of the world. */
    //Dylan added back
    if      (object.getLeft()   < 0          ) { object.setLeft(0);             object.velocity_x = 0; }
    else if (object.getRight()  > this.width ) { object.setRight(this.width);   object.velocity_x = 0; }
    if      (object.getTop()    < 0          ) { object.setTop(0);              object.velocity_y = 0; }
    else if (object.getBottom() > this.height) { object.setBottom(this.height); object.velocity_y = 0; object.jumping = false; }


    var bottom, left, right, top, value;

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size, this);

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size, this);

    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size, this);

    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size, this);

  },

  setup:function(zone) {

    this.coins            = new Array();
    this.doors              = new Array();
    this.collision_map      = zone.collision_map;
    this.graphical_map      = zone.graphical_map;
    this.columns            = zone.columns;
    this.rows               = zone.rows;
    this.zone_id            = zone.id;
    this.tile_set           = new Game.TileSet(zone.tile_set_columns, zone.tile_sheet_size);
    this.is_bin             = zone.is_bin
    this.spawn_point        = zone.spawn_point
    this.level_num_coins    = zone.coins.length 


    for (let index = zone.coins.length - 1; index > -1; -- index) {

      let coin = zone.coins[index];
      this.coins[index] = new Game.Coin(coin[0] * this.tile_set.tile_size + 5, coin[1] * this.tile_set.tile_size - 2);

    }

    for (let index = zone.doors.length - 1; index > -1; -- index) {

      let door = zone.doors[index];
      this.doors[index] = new Game.Door(door);

    }

    if (this.door) {

      if (this.door.destination_x != -1) {

        this.player.setCenterX   (this.door.destination_x);
        this.player.setOldCenterX(this.door.destination_x);// It's important to reset the old position as well.

      }

      if (this.door.destination_y != -1) {

        this.player.setCenterY   (this.door.destination_y);
        this.player.setOldCenterY(this.door.destination_y);

      }

      this.door = undefined;// Make sure to reset this.door so we don't trigger a zone load.

    }

  },

  update:function() {

    this.player.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player);

    for (let index = this.coins.length - 1; index > -1; -- index) {

      let coin = this.coins[index];

      coin.updatePosition();
      coin.animate();

      if (coin.collideObject(this.player)) {

        this.coins.splice(this.coins.indexOf(coin), 1);
        this.coin_count ++;

      }

    }

    //Collide with door
    for(let index = this.doors.length - 1; index > -1; -- index) {

      let door = this.doors[index];

      if (door.collideObjectCenter(this.player)) {
        this.door = door;
        logData(this.level, this.level_num_coins, this.coin_count, this.is_bin)
      };

    }

    this.player.updateAnimation();

  }

};

function logData(level_num, level_num_coins, coins_collected, is_bin){
  //console.log("Log of data")
  //console.log(level_num,level_num_coins, coins_collected)
  if(is_bin){
    console.log("is bin")
  }
  else{
    console.log("Percentage Coins Collected: ", coins_collected/level_num_coins)
  }
}