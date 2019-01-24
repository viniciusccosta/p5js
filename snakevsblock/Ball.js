class Ball{
  constructor(x,y){
    this.pos  = createVector(x,y);
    this.r    = 10;
    this.speed =10;
    this.velocity = createVector(0,-universalSpeed);

    this.tail = [];
    for(let i = 1; i <= 14; i++){
      this.tail.push( createVector(this.pos.x, this.pos.y + 2*i*this.r) ); // pos.y = 10 e r = 3 --> 10 + 2*1*3 = 16--> 10 + 2*2*3 = 22
      // or: this.tail.push ( createVector(this.pos.x, this.tail[-1] + 2*this.r) )
    }

  }

  update(){
    // TODO: TAIL IS HORRIBLE! HAHA!
    // TODO: Move with mouse/touchscreen, not keyboard

    // TAIL:
    if(this.tail.length > 0){
      for(let i = this.tail.length - 1; i > 0; i--){
        this.tail[i].y += this.velocity.y;
        this.tail[i].x  = this.tail[i-1].x;
      }
      this.tail[0].x  = this.pos.x;
      this.tail[0].y += this.velocity.y;
    }

    // MOVEMENT:
    this.pos.add(this.velocity);

    // LIMITS:
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
    fill(255,255,0);
    ellipse(this.pos.x,this.pos.y,this.r*2);

    for(let t of this.tail){
      fill(255,127,0);
      ellipse(t.x,t.y,this.r*2);
    }
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
