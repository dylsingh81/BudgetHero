/* In this example, the controller only alerts the user whenever they press a key,
but it also defines the ButtonInput class, which is used for tracking button states. */

const Controller = function() {

  this.left  = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up    = new Controller.ButtonInput();
  this.attack = false;
  this.deposit = false
  this.withdraw = false

  this.keyDownUp = function(type, key_code) {

    var down = (type == "keydown") ? true : false;

    switch(key_code) {
      case 37: this.left.getInput(down);  break;
      case 38: this.up.getInput(down);    break;
      case 39: this.right.getInput(down);
    }

  };

  this.spacePressed = function(){
    
    this.attack = true
  }

  this.wPressed = function(){
    this.withdraw = true
  }

  this.dPressed = function(){
    this.deposit = true
  }

  this.keyPress = function(type, key_code) {
    
    switch(key_code) {
      case 32: this.spacePressed(); break;
      case 68: case 100: this.dPressed(); break; // d + D key
      case 87: case 119: this.wPressed(); break; // w + W Key
    }
  };
};

Controller.prototype = {

  constructor : Controller

};

Controller.ButtonInput = function() {

  this.active = this.down = false;

};

Controller.ButtonInput.prototype = {

  constructor : Controller.ButtonInput,

  getInput : function(down) {

    if (this.down != down) this.active = down;
    this.down = down;

  }

};

