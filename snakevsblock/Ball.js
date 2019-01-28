class Ball {
  // TODO: Add to world when "snake" increase length
  // TODO: Remove from world when collide

  constructor(x, y) {
    this.r = 10;
    this.tail = [];

    this.options = {
      label: "snake",
      isSleeping: false,
      inertia: Infinity,
      restitution: 0
    };
    for (let i = 9; i >= 0; i--) { this.tail.push(Matter.Bodies.circle(x, y + 2 * i * this.r, this.r, this.options)); }

    this.y = y;
    this.lastCollision = millis();
    this.dead = false;
  }

  update() {
    if(!this.dead && this.tail.length > 0){ // this.tail.length is not necessary
      let lastIndex = this.tail.length - 1;

      // MOVE:
      for (let i = 0; i < lastIndex; i++) {
        let vel_x = lerp(this.tail[i].position.x, this.tail[i + 1].position.x, 0.40);
        Matter.Body.setPosition(this.tail[i], createVector(vel_x, this.tail[i].position.y)); // TODO: setVelocity() ?
      }
      this.tail[lastIndex].position.x = mouseX; // TODO: setVelocity() ?

      // EDGES/BORDERS:
      this.tail[lastIndex].position.x = constrain(this.tail[lastIndex].position.x, 0 + this.r, width - this.r); // TODO: setVelocity() ?
    }
  }

  show() {
    push();
    fill(255, 255, 0);

    for (let t of this.tail) {
      fill(255, 255, 0);
      ellipse(t.position.x, t.position.y, this.r * 2);
    }
    pop();
  }

  collided() {
    let t;

    if(this.tail.length > 1){ // TODO: this.tail.length > 0 !
      if(millis() - this.lastCollision > 100){ // "x" milliseconds to each collision
        t = this.tail.pop(); // TODO: All the balls above should go up "this.r*2"
        this.lastCollision = millis();
      }
    }else{
      this.dead = true;
    }

    return t;
  }

}
