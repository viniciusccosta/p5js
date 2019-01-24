class Block{
  constructor(x,y,w,h, value){
    this.pos = createVector(x,y);
    this.w = w;
    this.h = h;
    this.value = value == null ? 20 : value;
    this.velocity = createVector(0,universalSpeed);

    this.offscreen = false;
  }

  update(){
    this.velocity.y = universalSpeed;
    
    this.pos.add(this.velocity);
    if(this.pos.y > height + this.h){
      this.offscreen = true;
    }
  }

  show(){
    push();

    fill(127,127,255,255);
    rect(this.pos.x, this.pos.y, this.w, this.h, 8);

    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(this.value, this.pos.x, this.pos.y);

    pop();
  }
}
