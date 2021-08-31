const left_attacks = ["attack-left-up", "attack-left-down", "attack-left-jab"];
const right_attacks = ["attack-right-up", "attack-right-down", "attack-right-jab"];

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

    if(object.type == "bomb" && object.velocity_x == 0){
      object.die(world)
    }

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
      case -2:     this.collideSpike          (object, world             );break;
      case -3: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)){
                world.hitModal = true
                return; 
               }
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;

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

  collideSpike:function(object) {
    if(object.type == "player"){
      object.dead = true
    }
  },

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
  this.attacking    = false
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

  frame_sets: { "twirl":[16, 17, 18, 19, 20] },

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

Game.Bomb = function(x, y, dir) {

  Game.MovingObject.call(this, x, y, 10, 10);

  Game.Animator.call(this, Game.Bomb.prototype.frame_sets["move-left"], 50);

  this.direction_x  = dir;
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.dead         = false;
  this.deadCount    = 0;
  this.type = "bomb"
};
Game.Bomb.prototype = {

  frame_sets: {
    "move-left"    : [95,94],  //2
    "death"        : [96,97]   //2
  },

  moveLeft: function() {

      this.direction_x = -1;
      this.velocity_x -= 4;
  
    },
  
  moveRight:function(frame_set) {
  
      this.direction_x = 1;
      this.velocity_x += 4;
  
    },

  move:function() {
    
    if(this.direction_x < 0){
        this.moveLeft()
    }else{
        this.moveRight()
    }
  },

  die:function(world){
    world.sounds.explode.play()
    
    this.dead = true
  },

  updateAnimation:function(world) {

    const bombTime = 50

    if(this.dead){
      this.changeFrameSet(this.frame_sets["death"], "loop", 5);
      this.deadCount += 1
      //delay = 10 + 3
      if(this.deadCount > 15){
        
        world.bombs.splice(world.bombs.indexOf(this), 1)
      }
    }

    else if (this.direction_x < 0) {
      this.changeFrameSet(this.frame_sets["move-left"], "loop", bombTime);
    }

    else if (this.direction_x > 0) {
      this.changeFrameSet(this.frame_sets["move-left"], "loop", bombTime);
    }

    this.animate();

  },

  updatePosition:function(gravity=0.0, friction=0.4) {

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
Object.assign(Game.Bomb.prototype, Game.MovingObject.prototype);
Object.assign(Game.Bomb.prototype, Game.Animator.prototype);
Game.Bomb.prototype.constructor = Game.Bomb;


Game.Player = function(x, y) {

  Game.MovingObject.call(this, x, y, 7, 16);

  Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-left"], 10);

  this.jumping      = true;
  this.attacking    = false;
  this.attack_type  = 0;
  this.direction_x  = -1;
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.attack_count = 0;
  this.deadCount    = 0;
  this.dead         = false
  this.index        = Math.floor(Math.random() * 3);
  this.type         = "player"

};
Game.Player.prototype = {

  frame_sets: {

    "idle-left"         : [0],                         //1
    "jump-left"         : [1,2,3],                     //3
    "move-left"         : [4, 5, 6, 7],                //4
    "idle-right"        : [8],                         //1
    "jump-right"        : [9, 10, 11],                 //3
    "move-right"        : [12, 13, 14, 15],            //4
    //frame_sets: { "twirl":[16, 17, 18, 19, 20] },    //5
    "attack-left-up"    : [21,22,23,24,25,26,27,28],   //8
    "attack-left-down"  : [29,30,31,32,33,34,35,36],   //8
    "attack-left-jab"   : [37,38,39,40,41,42,43,44],   //8
    "attack-right-up"   : [45,46,47,48,49,50,51,52],   //8
    "attack-right-down" : [53,54,55,56,57,58,59,60],   //8
    "attack-right-jab"  : [61,62,63,64,65,66,67,68],   //8
    "death-right"       : [69,70,71,72,73],            //5
    "death-left"        : [74,75,76,77,78]             //5
  },

  jump: function(world) {
    
    /* Made it so you can only jump if you aren't falling faster than 10px per frame. */
    if (!this.jumping && this.velocity_y < 10) {
      world.sounds.jump.play()
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


  attack:function(world) {
    this.attacking = true
    world.sounds.attack.play()
    
  },

  updateAnimation:function(world) {
    if(this.dead){
      world.sounds.death.play()
      if(this.direction_x < 0)
        this.changeFrameSet(this.frame_sets["death-left"], "loop", 3);
      else
        this.changeFrameSet(this.frame_sets["death-right"], "loop", 3);
      //delay = 10 + 3
      this.deadCount += 1
      this.velocity_x = 0
      this.velocity_y = 0
      if(this.deadCount > 13){    
        world.respawn()
        this.deadCount = 0
        this.dead = false
      }
    }
    
    else if(this.attacking) {
      
      let frame_set = []
      
      this.attack_count+= 1
      if (this.direction_x < 0) {
        frame_set = this.frame_sets[left_attacks[this.index]]
      }
      else{
        frame_set = this.frame_sets[right_attacks[this.index]]
      } 
      
      if(frame_set != undefined){
        this.changeFrameSet(frame_set, "loop", 2);
      }
      else{
        console.log(this.index)
      }

      if(this.attack_count >= 10){
        this.attacking = false
        this.attack_count = 0
        
        this.index = Math.floor(Math.random() * 3);
      }
    }

    else if (this.velocity_y < 0) {

      if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "pause", 8);
      else this.changeFrameSet(this.frame_sets["jump-right"], "pause", 8);

    } else if (this.direction_x < 0) {

      if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 2);
      else this.changeFrameSet(this.frame_sets["idle-left"], "pause");

    } else if (this.direction_x > 0) {

      if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 2);
      else this.changeFrameSet(this.frame_sets["idle-right"], "pause");

    }
    this.animate();

  },

  updateAttack:function(world) {

    if(this.attacking) {
      
      x = this.x
      y = this.y

      //console.log(x, y, enemy.x, enemy.y)

      for(var i = 0; i < world.enemies.length; i++) {
          enemy = world.enemies[i]
          dist = 24
          if(y-enemy.y > -10 && y-enemy.y <= 0){
            if (this.direction_x < 0) {
              if(x-enemy.x < dist && x-enemy.x >= 0){
                //console.log(x-enemy.x)
            
                //console.log("Hit enemy", i)
                enemy.die(world)
              }
            }
            else{
              if(x-enemy.x > -dist && x-enemy.x <= 0){
                //console.log(x-enemy.x)
                //console.log("Hit enemy", i)
                enemy.die(world)

              }
            } 
          }
      }
      

    }

  },

  checkCollideEnemy:function(world) {
    x = this.x
    y = this.y
    //Collide with Enemy Body
    for(var i = 0; i < world.enemies.length; i++) {
        enemy = world.enemies[i]
        if(enemy.dead)
        {
          return
        }
        //console.log(enemy)
        dist = 14

        if( ((enemy.x + enemy.width - (this.x + this.width) >= 0)) && (enemy.x + enemy.width - (this.x + this.width) < dist) &&
        (enemy.y + enemy.height - (this.y + this.height) >= 0) && ((enemy.y + enemy.height - (this.y + this.height) < dist))) {
          
          //console.log(enemy.x + enemy.width - (this.x + this.width))
          //console.log("Enemy Kill player")
          this.dead = true

        }
    }
    //Collide with Bomb
    for(var i = 0; i < world.bombs.length; i++) {
      bomb = world.bombs[i]
      if(bomb.dead)
      {
        return
      }
      //console.log(enemy)
      dist = 12
      

      if( ((bomb.x + bomb.width - (this.x + this.width) >= 0)) && (bomb.x + bomb.width - (this.x + this.width) < dist) &&
      (bomb.y+8 + bomb.height - (this.y + this.height) >= 0) && ((bomb.y+8 + bomb.height - (this.y + this.height) < dist))) {
        
        //console.log(bomb.x + bomb.width - (this.x + this.width))
        //console.log("Enemy Kill player")
        bomb.die(world);
        this.dead = true;
      }
  }
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


Game.Enemy1 = function(x, y) {

  Game.MovingObject.call(this, x, y, 13, 16);

  Game.Animator.call(this, Game.Enemy1.prototype.frame_sets["idle-left"], 3);

  this.direction_x  = -1;
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.maxRight     = 50;
  this.maxLeft      = 50;
  this.dead         = false;
  this.deadCount    = 0;
  this.type         = "enemy";
  this.enemyType    = 0;
};
Game.Enemy1.prototype = {

  frame_sets: {

    "idle-left"         : [79],                        //1
    "move-left"         : [79, 80, 81, 82, 83],        //5
    "idle-right"        : [84],                        //1
    "move-right"        : [84, 85, 86, 87, 88],        //5
    "death"             : [89, 90, 91, 92, 93]         //5
  },

  moveLeft: function() {
    this.direction_x = -1;
    this.velocity_x -= 0.7;

  },

  moveRight:function() {
    this.direction_x = 1;
    this.velocity_x += 0.7;

  },

  move:function() {
    
    //console.log(this.maxRight,this.maxLeft)
    while(this.maxRight > 0)
    {
      this.moveRight()
      this.maxRight -= 1
      return
    }
    while(this.maxLeft > 0){
      this.moveLeft()
      this.maxLeft -= 1
      return
    }
    this.maxLeft = 50
    this.maxRight = 50
  },

  die:function(world){
    if(!this.dead){
      world.sounds.enemy_death.play()
    }
    this.dead = true
  },

  updateAnimation:function(world) {

    if(this.dead){
      this.changeFrameSet(this.frame_sets["death"], "loop", 3);
      this.deadCount += 1
      //delay = 10 + 3
      if(this.deadCount > 13){
        world.enemies.splice(world.enemies.indexOf(this), 1)
      }
    }

    else if (this.direction_x < 0) {

      if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 3);
      else this.changeFrameSet(this.frame_sets["idle-left"], "pause");
    }

    else if (this.direction_x > 0) {

      if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 3);
      else this.changeFrameSet(this.frame_sets["idle-right"], "pause");

    }

    

    this.animate();

  },

  updatePosition:function(gravity=0.7, friction=0.4) {

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
Object.assign(Game.Enemy1.prototype, Game.MovingObject.prototype);
Object.assign(Game.Enemy1.prototype, Game.Animator.prototype);
Game.Enemy1.prototype.constructor = Game.Enemy1;

Game.Enemy2 = function(x, y) {

  Game.MovingObject.call(this, x, y, 13, 16);

  Game.Animator.call(this, Game.Enemy2.prototype.frame_sets["idle-left"], 3);

  this.direction_x  = -1;
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.maxRight     = 50;
  this.maxLeft      = 50;
  this.dead         = false;
  this.deadCount    = 0;
  this.type         = "enemy";
  this.enemyType    = 1;
  this.bombCount    = 0;
};
Game.Enemy2.prototype = {

  frame_sets: {

    "idle-left"         : [79],                         //1
    "move-left"         : [79, 79, 80, 79, 79, 80, 79, 80, 81, 82, 83], //11
    "idle-right"        : [84],                         //1
    "move-right"        : [84, 85, 84, 85, 84, 85, 84, 85, 86, 87, 88], //11
    "death"             : [89, 90, 91, 92, 93]          //5
  },

  move:function(world) {
    //Change directions
    this.direction_x = (world.player.x - this.x)
    return;
  },

  die:function(world){
    if(!this.dead){
      world.sounds.enemy_death.play()
    }
    this.dead = true
  },

  updateAnimation:function(world) {


    //Create bomb at animation #6
    const anim_length = 12
    this.bombCount += 1
    //Delay = num frames * anim leng
    if(this.bombCount > anim_length*11){
      world.bombs.push(new Game.Bomb(this.x, this.y, this.direction_x))
      this.bombCount = 0
    }


    if(this.dead){
      this.changeFrameSet(this.frame_sets["death"], "loop", 3);
      this.deadCount += 1
      //delay = 10 + 3
      if(this.deadCount > 13){
        world.enemies.splice(world.enemies.indexOf(this), 1)
      }
    }

    else if (this.direction_x < 0) {

      this.changeFrameSet(this.frame_sets["move-left"], "loop", anim_length);
      
    }

    else if (this.direction_x > 0) {

      this.changeFrameSet(this.frame_sets["move-right"], "loop", anim_length);

    }

    

    this.animate();

  },

  updatePosition:function(gravity=0.7, friction=0.4) {

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
Object.assign(Game.Enemy2.prototype, Game.MovingObject.prototype);
Object.assign(Game.Enemy2.prototype, Game.Animator.prototype);
Game.Enemy2.prototype.constructor = Game.Enemy2;

Game.TileSet = function(columns, tile_size) {

  this.columns    = columns;
  this.tile_size  = tile_size;

  let f = Game.Frame;

  //f = (x, y, width, height, offset_x = 0, offset_y = 0) 
  this.frames =  [new f(224,0, 29,32,0,-15),                                                                                                                    // idle-left - 1
                    new f(64, 416, 29, 32, 0, -15), new f(96, 416, 29, 32, 0, -15), new f(128, 416, 29, 32, 0, -15),                                            // jump-left - 3                                                       
                    new f(32, 288, 29, 32, 0, -15), new f( 64, 288, 29, 32, 0, -15), new f( 96, 288, 29, 32, 0, -15), new f( 128, 288, 29, 32, 0, -15),         // walk-left - 4

                    new f(32, 0, 29,32,0,-15),                                                                                                                  // idle-right - 1
                    new f(64,160, 29, 32, 0, -15), new f(96,160, 29, 32, 0, -15), new f(128,160, 29, 32, 0, -15),                                               // jump-right - 3
                    new f(32, 32, 29, 32, 0, -15), new f( 64, 32, 29, 32, 0, -15), new f( 96, 32, 29, 32, 0, -15), new f( 128, 32, 29, 32, 0, -15),             // walk-right - 4

                    new f(0, 0, 16, 16, 0, 0), new f(16, 0, 16, 16, 0, 0), new f(32, 0, 16, 16, 0, 0), new f(48, 0, 16, 16, 0, 0), new f(64, 0, 16, 16, 0, 0),  // coin - 5

                    new f(32, 320, 32, 32, 0, -15), new f(64, 320, 32, 32, 0, -15), new f( 96, 320, 32, 32, 0, -15), new f( 128, 320, 32, 32, 0, -15),          // Attack Up Left - 8
                    new f(160, 320, 32, 32, 0, -15), new f(192, 320, 32, 32, 0, -15), new f( 224, 320, 32, 32, 0, -15), new f( 256, 320, 32, 32, 0, -15),       // ___________________

                    new f(32, 352, 32, 32, 0, -15), new f(64, 352, 32, 32, 0, -15), new f( 96, 352, 32, 32, 0, -15), new f( 128, 352, 32, 32, 0, -15),          // Attack Down Left - 8
                    new f(160, 352, 32, 32, 0, -15), new f(192, 352, 32, 32, 0, -15), new f( 224, 352, 32, 32, 0, -15), new f( 256, 352, 32, 32, 0, -15),       // ___________________

                    new f(32, 384, 32, 32, 0, -15), new f(64, 384, 32, 32, 0, -15), new f( 96, 384, 32, 32, 0, -15), new f( 128, 384, 32, 32, 0, -15),          // Attack Jab Left - 8
                    new f(160, 384, 32, 32, 0, -15), new f(192, 384, 32, 32, 0, -15), new f( 224, 384, 32, 32, 0, -15), new f( 256, 384, 32, 32, 0, -15),       // ___________________

                    
                    new f(32, 64, 32, 38, 0, -15), new f( 64, 64, 32, 32, 0, -15), new f( 96, 64, 32, 32, 0, -15), new f( 128, 64, 32, 32, 0, -15),             // Attack Up Right - 8
                    new f(160, 64, 32, 38, 0, -15), new f( 192, 64, 32, 32, 0, -15), new f( 224, 64, 32, 32, 0, -15), new f( 256, 64, 32, 32, 0, -15),          // ___________________
                    
                    new f(32, 96, 32, 38, 0, -15), new f( 64, 96, 32, 32, 0, -15), new f( 96, 96, 32, 32, 0, -15), new f( 128, 96, 32, 32, 0, -15),             // Attack Down Right - 8
                    new f(160, 96, 32, 38, 0, -15), new f( 192, 96, 32, 32, 0, -15), new f( 224, 96, 32, 32, 0, -15), new f( 256, 96, 32, 32, 0, -15),          // ___________________
                    
                    new f(32, 128, 32, 38, 0, -15), new f( 64, 128, 32, 32, 0, -15), new f( 96, 128, 32, 32, 0, -15), new f( 128, 128, 32, 32, 0, -15),         // Attack Jab Right - 8
                    new f(160, 128, 32, 38, 0, -15), new f( 192, 128, 32, 32, 0, -15), new f( 224, 128, 32, 32, 0, -15), new f( 256, 128, 32, 32, 0, -15),      // ___________________

                    new f(32, 224, 32, 32, 0, -15), new f(64, 224, 32, 32, 0, -15), new f( 96, 224, 32, 32, 0, -15), new f( 128, 224, 32, 32, 0, -15),          // Player Death Left - 5
                    new f(160, 224, 32, 32, 0, -15),
                    new f(32, 480, 32, 32, 0, -15), new f(64, 480, 32, 32, 0, -15), new f( 96, 480, 32, 32, 0, -15), new f( 128, 480, 32, 32, 0, -15),          // Player Death Right - 5
                    new f(160, 480, 32, 32, 0, -15),
                    
                    new f(96, 0, 16, 16, 0, 0), new f(112, 0, 16, 16, 0, 0), new f(128, 0, 16, 16, 0, 0), new f(144, 0, 16, 16, 0, 0), new f(160, 0, 16, 16, 0, 0),   // Goblin Run left - 5
                    new f(0, 0, 16, 16, 0, -1), new f(16, 0, 16, 16, 0, 0), new f(32, 0, 16, 16, 0, 0), new f(48, 0, 16, 16, 0, 0), new f(64, 0, 16, 16, 0, 0),       // Goblin Run right - 5
                    new f(16, 64, 16, 16, 0, -1), new f(0, 64, 16, 16, 0, 0), new f(32, 16, 16, 16, 0, 0), new f(48, 16, 16, 16, 0, 0), new f(64, 16, 16, 16, 0, 0),  // Goblin Die - 5

                    
                    new f(0, 0, 8, 16, 0, -8), new f(16, 0, 8, 16, 0, -8),                                                                                            // Bomb Move - 2
                    new f(22, 0, 15, 32, 0, -8), new f(37, 0, 18, 32, 0, -8)                                                                                          // Bomb Explode - 2

                  ];
  };
  
Game.TileSet.prototype = { constructor: Game.TileSet };

Game.World = function(friction = 0.85, gravity = 2) {
  
  this.collider     = new Game.Collider();
  
  this.gameData           = {}

  this.friction     = friction;
  this.gravity      = gravity;

  this.columns      = 28;
  this.rows         = 18;

  this.tile_set     = new Game.TileSet(9, 16);
  this.player       = new Game.Player(10, 240);

  this.zone_id      = "00";

  this.coins        = [];// the array of coins in this zone;
  this.coin_count   = 0;// the number of coins you have.
  this.level_coin_coint = 0
  this.level        = 0
  this.doors        = [];
  this.door         = undefined;
  this.health       = 5;

  this.height       = this.tile_set.tile_size * this.rows;
  this.width        = this.tile_set.tile_size * this.columns;
  this.pie_chart    = undefined;
  this.tile_sheet_size = 16;
  this.canAttack    = true
  this.gameDone     = false

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
    //this.coin_bins = [1,1,1,1,1,1,1,1,1,1,1,1,1]
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
        var sounds = Object.assign({}, this.sounds);
        var dep_sound = sounds.deposit
        dep_sound.play()
        this.coin_bins[binNum] += 1
        this.coin_count--
      }

      this.openDoors()
      
    }


    //Withdraws coin into respective bin
    this.withdraw = function(playerX, playerY){
      binNum = this.getCoinBin(playerX, playerY)
      //console.log(this.is_bin)
      if(binNum > -1 && this.is_bin && this.coin_bins[binNum] > 0){
        var sounds = Object.assign({}, this.sounds);
        var wit_sound = sounds.withdraw
        wit_sound.play()
        this.coin_bins[binNum] -= 1
        this.coin_count++
      }
      this.closeDoors()
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

    this.coins              = new Array();
    this.doors              = new Array();
    this.enemies            = new Array();
    this.bombs              = new Array();
    this.collision_map      = zone.collision_map;
    this.graphical_map      = zone.graphical_map;
    this.columns            = zone.columns;
    this.rows               = zone.rows;
    this.zone_id            = zone.id;
    this.tile_set           = new Game.TileSet(zone.tile_set_columns, zone.tile_sheet_size);
    this.is_bin             = zone.is_bin
    this.spawn_point        = zone.spawn_point
    this.level_num_coins    = zone.coins.length
    this.level_logged       = 0
    this.levels_log_attempted   = 0 
    this.enemies_map        = zone.enemies_map
    this.is_last_level      = zone.is_last_level
    this.hitModal           = false
    this.doorsOpen          = false
    this.sounds         =   {
                              coin:     new Audio('./sounds/coin.wav'),
                              explode:  new Audio('./sounds/bombexplode.mp3'),
                              attack:   new Audio('./sounds/attack.wav'),
                              jump:     new Audio('./sounds/jump.wav'),
                              death:    new Audio('./sounds/death.wav'),
                              enemy_death: new Audio('./sounds/enemy_death.mp3'),
                              lock:    new Audio('./sounds/lock.mp3'),
                              unlock:    new Audio('./sounds/unlock.mp3'),
                              deposit:new Audio('./sounds/deposit.mp3'),
                              withdraw: new Audio('./sounds/withdraw.mp3'),
                            }
                          
    
    //Set volume of sounds
    for(var key in this.sounds) {
      this.sounds[key].volume = 0.4;
    }
    this.sounds.jump.volume = 0.2;               
    
    //Create Enemies
    for (let index = zone.enemies_map.length - 1; index > -1; -- index) {
        x = zone.enemies_map[index][1] * 16
        y = zone.enemies_map[index][2] * 16

        if(zone.enemies_map[index][0] == 0){
          this.enemies[index] = new Game.Enemy1(x, y)
        }
        else if(zone.enemies_map[index][0] == 1){
          this.enemies[index] = new Game.Enemy2(x, y)
        }
    }

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

    this.closeDoors = function()
    {

      //Make empty space into solid blocks
      //Arrary pos 419 and 447 are the door
      if(this.is_bin && this.coin_count > 0)
      {
        //Close Doors
        //Collision Block
        this.collision_map[419] = 10
        this.collision_map[447] = 10
        //Known tile values:
        this.graphical_map[419] = 56
        this.graphical_map[447] = 56

        
        if(this.doorsOpen){
          this.sounds.lock.play()
        }
        this.doorsOpen = false
      }
      //Else leave doors open
    }

    this.openDoors = function()
    {
      if(this.is_bin && this.coin_count <= 0)
      {
        //Close Doors
        //Collision Block
        this.collision_map[419] = -1
        this.collision_map[447] = -1
        //Known tile values:
        this.graphical_map[419] = -1
        this.graphical_map[447] = -1
        
        if(!this.doorsOpen){
          this.sounds.unlock.play()
        }
        this.doorsOpen = true
      }
      //Else leave doors closed
    }

    this.closeDoors()
    this.openDoors()
  },

  update:function() {
    if(track.ended){
      track_num  = Math.floor(Math.random() * 4)
      //console.log("Playing Track", track_num)
      track = music[track_num]
      track.volume = 0.1
      track.play()
    }

    this.player.updatePosition(this.gravity, this.friction);
    
    this.collideObject(this.player);

    for (let index = this.coins.length - 1; index > -1; -- index) {

      let coin = this.coins[index];

      coin.updatePosition();
      coin.animate();

      if (coin.collideObject(this.player)) {

        this.coins.splice(this.coins.indexOf(coin), 1);
        this.coin_count ++;
        this.level_coin_coint++;

        this.sounds.coin.play()

      }

    }

    //Collide with door
    for(let index = this.doors.length - 1; index > -1; -- index) {

      let door = this.doors[index];

      if (door.collideObjectCenter(this.player)) {
        this.door = door;
        //console.log(this.level, this.level_num_coins)
        this.levels_log_attempted += 1
        //console.log(this.levels_log_attempted, this.level_logged)
        if(this.levels_log_attempted - this.level_logged == 1){
          //console.log("Log Data")
          this.logData(this.zone_id, this.level_num_coins, this.level_coin_coint, this.is_bin, this.coin_bins)
          this.level_coin_coint = 0
          this.levels_logged += 1
          this.level_logged_attempted = this.level_logged
        }//Else repeated log

        
        if(this.is_last_level){
          this.gameDone = true
          return
        }
  
      };

    }

    //Update Player
    this.player.updateAnimation(this);
    this.player.updateAttack(this);
    this.player.checkCollideEnemy(this);

    //Update Enemies
    for(let index = this.enemies.length - 1; index > -1; -- index) {

      let enemy = this.enemies[index];
      if(!enemy.dead){
        enemy.move(this)
      }
      enemy.updatePosition();
      enemy.updateAnimation(this);
      this.collideObject(enemy);
    }

    //Update Bombs
    for(let index = this.bombs.length - 1; index > -1; -- index) {

      let bomb = this.bombs[index];
      if(!bomb.dead){
        bomb.move(this)
      }
      bomb.updatePosition();
      bomb.updateAnimation(this);
      this.collideObject(bomb);
    }


  },

  respawn:function(){
    this.health--
    //Respawn Player
    const respawnX = this.spawn_point.x
    const respawnY = this.spawn_point.y
    //console.log(respawnX, respawnY, this.spawn_point)
    this.player.setCenterX   (respawnX);
    this.player.setOldCenterX(respawnX);
    this.player.setCenterY   (respawnY);
    this.player.setOldCenterY(respawnY);
    return
  },
  
  logData: function(level_num, level_num_coins, coins_collected, is_bin, coin_bins){
    //console.log("Log of data")
    //console.log(this.gameData, this.game_num)
    level_num = "level-"+ level_num
    game_num = "game-" + this.game_num
    this.gameData[game_num].indvGameData[level_num] = {
      is_bin: is_bin,
      currentBins : coin_bins.slice(),
      percentageCollectedFromLevel: coins_collected/level_num_coins
    }
    //console.log(this.gameData)
    var data = { cookie_id: cookieId, gameData: this.gameData};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch('/gameDataLevel', options);
  } 

};