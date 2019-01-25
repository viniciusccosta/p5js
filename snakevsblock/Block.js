class Block{
  constructor(x,y,w,h, value){
    this.body = Matter.Bodies.rectangle(x,y,w,h);
    //this.pos = createVector(x,y);

    this.w = w;
    this.h = h;
    this.value = value == null ? 20 : value;
    //this.velocity = createVector(0,universalSpeed);

    this.offscreen = false;
  }

  update(){
    //this.pos.add(this.velocity);
    this.body.position.y += universalSpeed; // TODO: Matter.Body.setPosition() ?

    //if(this.pos.y > height + this.h){
    if(this.body.position.y > height + this.h){
      this.offscreen = true;
    }
  }

  show(){
    push();

    fill(127,127,255,255);
    //rect(this.pos.x, this.pos.y, this.w, this.h, 8);
    rect(this.body.position.x, this.body.position.y, this.w, this.w, 8);

    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    //text(this.value, this.pos.x, this.pos.y);
    text(this.value, this.body.position.x, this.body.position.y);

    pop();
  }
}
