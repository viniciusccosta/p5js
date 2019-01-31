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

      // ------------------------------------
      // Tail:
      for (let i = 0; i < lastIndex; i++) {
        /*
        let new_pos = createVector(this.tail[i+1].position.x, this.tail[i+1].position.y + this.r + this.r)    //
        let cur_pos = createVector(this.tail[i].position.x, this.tail[i].position.y)
        let pos     = new_pos.sub ( cur_pos )
        //pos.x       = constrain(pos.x,  -5,  5)
        //pos.y       = constrain(pos.y,  -1,  1)           // The head will move slowly to up
        Matter.Body.setVelocity(this.tail[i], pos)*/


        let vel_x   = lerp(this.tail[i].position.x, this.tail[i + 1].position.x, 0.40);
        let vel_y   = lerp(this.tail[i].position.y, this.tail[i + 1].position.y + 2*this.r, 0.50);
        //Matter.Body.setPosition(this.tail[i], createVector(vel_x, this.tail[i].position.y)); // TODO: setVelocity() ?
        Matter.Body.setPosition(this.tail[i], createVector(vel_x, vel_y)); // TODO: setVelocity() ?
      }

      // ------------------------------------
      // Head:
      /*
      let mouse_pos = createVector(mouseX, this.y)        // Where the head must go
      let curPos    = createVector(this.tail[lastIndex].position.x, this.tail[lastIndex].position.y) // Current position
      let pos       = mouse_pos.sub( curPos )             // Vector from current position to where we wanna go

      pos.x = constrain(pos.x, -15, 15)
      pos.y = constrain(pos.y,  -1,  1)                   // The head will move slowly to up

      Matter.Body.setVelocity(this.tail[lastIndex], pos)*/

      this.tail[lastIndex].position.y = lerp(this.tail[lastIndex].position.y, this.y, 0.1)   // TODO: setVelocity() ?
      this.tail[lastIndex].position.x = mouseX;                                               // TODO: setVelocity() ?

      // ------------------------------------
      // EDGES/BORDERS:
      // TODO: CONSTRAIN
      this.tail[lastIndex].position.x = constrain(this.tail[lastIndex].position.x, 0 + this.r, width - this.r); // TODO: setVelocity() ?

      // ------------------------------------
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
        t = this.tail.pop();
        this.lastCollision = millis();
      }
    }else{
      this.dead = true;
    }

    return t;
  }

}
