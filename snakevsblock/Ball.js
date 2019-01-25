class Ball{
  constructor(x,y){
    this.r = 10;

    this.tail = [];
    for(let i = 14; i >= 1; i--){
      //this.tail.push( createVector(x, y + 2*i*this.r) );
      this.tail.push( Matter.Bodies.circle(x, y + 2*i*this.r, this.r, {label: "snake"}) );
    }
    //this.tail.push(createVector(x,y));
    this.tail.push( Matter.Bodies.circle( x, y, this.r, {label: "snake"} ) );

  }

  update(){
    // TODO: It's not only "pop()", we have to bring all the tail up
    // TODO: Matter.Body.setPosition() ?

    let lastIndex = this.tail.length - 1;

    // MOVE:
    for(let i = 0; i < lastIndex; i++){
      //this.tail[i].x = lerp(this.tail[i].x, this.tail[i+1].x, 0.40);
      this.tail[i].position.x = lerp(this.tail[i].position.x, this.tail[i+1].position.x, 0.40);
    }
    //this.tail[lastIndex] = createVector(mouseX, this.tail[lastIndex].y);
    this.tail[lastIndex].position.x = mouseX;

    // EDGES/BORDERS:
    //this.tail[lastIndex].x = constrain(this.tail[lastIndex].x, 0 + this.r, width - this.r);
    this.tail[lastIndex].position.x = constrain(this.tail[lastIndex].position.x, 0 + this.r, width - this.r);

  }

  show(){
    fill(255,255,0);
    let cnt = this.tail.length;

    for(let t of this.tail){
      cnt--;
      fill(255/cnt, 255/cnt,0);
      //ellipse(t.x,t.y,this.r*2);
      ellipse( t.position.x, t.position.y, this.r*2 );
    }
  }
}
