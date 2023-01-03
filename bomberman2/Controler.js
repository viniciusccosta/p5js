class Controler{
  constructor(left, up, right, down, plant){
    this.up    = up;
    this.down  = down;
    this.right = right;
    this.left  = left;
    this.plant = plant;

    this.keyHeld = new Map();
    this.keyHeld.set(this.up,    false);
    this.keyHeld.set(this.down,  false);
    this.keyHeld.set(this.right, false);
    this.keyHeld.set(this.left,  false);
    this.keyHeld.set(this.plant, false);

  }

  mKeyPressed(keyCode){
    this.keyHeld.set(keyCode,true);
  }
  mKeyReleased(keyCode){
    this.keyHeld.set(keyCode,false);
  }
}
