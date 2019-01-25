class Ball{
  constructor(x,y){
    this.pos      = createVector(x,y);
    this.r        = 10;
    this.speed    = (2*this.r)*0.1;
    this.velocity = createVector(0,0); // the ball can't move up/down, because there's a limit!

    this.tail = [];
    for(let i = 3; i >= 1; i--){
      this.tail.push( createVector(this.pos.x, this.pos.y + 2*i*this.r) );
    }
    this.tail.push(this.pos);

  }

  update(){
    // TODO: TAIL IS HORRIBLE! HAHA!
    // TODO: Move with mouse/touchscreen, not keyboard
    // TODO: It's not only "pop()", we have to bring all the tail up

    let lastIndex = this.tail.length - 1;

    // MOVE:
    for(let i = 0; i < lastIndex; i++){
      this.tail[i].x = lerp(this.tail[i].x, this.tail[i+1].x, 0.15);
    }
    this.tail[lastIndex].add(this.velocity);

    // EDGES/BORDERS:
    this.tail[lastIndex].x = constrain(this.tail[lastIndex].x, 0 + this.r, width - this.r);
    if(this.tail[lastIndex].x <= this.r || this.tail[lastIndex].x >= width - this.r) {
      this.velocity.x = 0;
    }

  }

  show(){
    fill(255,255,0);
    let cnt = this.tail.length;

    for(let t of this.tail){
      fill(255/cnt, 255/cnt,0);
      cnt--;
      ellipse(t.x,t.y,this.r*2);
    }
  }

  move(kc){
    switch(kc){
      case RIGHT_ARROW:
        this.velocity.x += this.speed;
        break;
      case LEFT_ARROW:
        this.velocity.x -= this.speed;
        break;
    }

    this.velocity.x = constrain(this.velocity.x, -this.speed, this.speed);
  }
}
