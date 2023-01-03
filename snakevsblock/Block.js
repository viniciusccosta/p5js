class Block{
  constructor(x,y,w,h,value){
    this.body = Matter.Bodies.rectangle(x,y,w,h,
      {
        inertia: Infinity,
        restitution: 0
      }
    );

    this.w = w;
    this.h = h;
    this.value = value == null ? 20 : value;

    this.offscreen = false;
  }

  update(){
    Matter.Body.setVelocity(this.body, createVector(0, universalSpeed));

    if(this.body.position.y > height + this.h){
      this.offscreen = true;
    }
  }

  show(){
    push();

    fill(127,127,255,255);
    rect(this.body.position.x, this.body.position.y, this.w, this.w, 8);

    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(this.value, this.body.position.x, this.body.position.y);

    pop();
  }

  collided(){
    this.value--;
    return this.value <= 0;
  }
}
