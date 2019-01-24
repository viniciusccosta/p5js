class Ball{
  constructor(x,y){
    this.pos  = createVector(x,y);
    this.r    = 10;
    this.tail = [];
    this.speed = 4;
    this.velocity = createVector(0,0);
  }

  update(){
    this.pos.add(this.velocity);
    if(this.pos.x < this.r) {
      this.pos.x = this.r;
      this.velocity.x = 0;
    }
    if(this.pos.x > width - this.r){
      this.pos.x = width - this.r;
      this.velocity.x = 0;
    }
  }

  show(){
    push();
    fill(255,255,0);
    ellipse(this.pos.x,this.pos.y,this.r*2);
    pop();
  }

  move(k, kc){
    switch(kc){
      case RIGHT_ARROW:
        this.velocity.x += this.velocity.x >= this.speed  ? 0 : this.speed;
        break;
      case LEFT_ARROW:
        this.velocity.x += this.velocity.x <= -this.speed  ? 0 : -this.speed;
        break;
    }
  }
}
