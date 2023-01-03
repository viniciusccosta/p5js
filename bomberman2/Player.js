class Player {
  constructor(id, x, y, controler) {
    let mOptions = {
      frictionAir: 0.2,
      restitution: 0,
    };

    this.body      = Bodies.circle(x, y, cellSize * 0.5, mOptions);
    this.body.collisionFilter.group    = 0;
    this.body.collisionFilter.category = pow(2,id);   // 1,2,4 or 8
    this.body.collisionFilter.mask     = 256 + 512;   // Collide to crates, bombs, stones and borders

    this.velocity  = createVector(0, 0);
    this.speed     = int(w/200);          // | Canvas1: width = 881 --> speed = 4 | Canvas2: width = 1281 --> speed = 6 |
    this.controler = controler;
    this.dead      = false;

    this.powers    = [1, 1];  // powers[0] = How many bombs the player can plant, powers[1] = bomb range
    this.bombCnt   = 0;

    this.id = id;             // TODO: It's not ID. It's player 1, player 2, player N.
    this.dir = "DOWN";
    this.animations = new Map();
    this.animations.set("UP",    new Animation(playerImgs[this.id].get("UP"),    6));
    this.animations.set("RIGHT", new Animation(playerImgs[this.id].get("RIGHT"), 6));
    this.animations.set("DOWN",  new Animation(playerImgs[this.id].get("DOWN"),  6));
    this.animations.set("LEFT",  new Animation(playerImgs[this.id].get("LEFT"),  6));
    this.animations.set("DEAD",  new Animation(ghostImgs,  4));
  }
  show() {
    push();
    translate(this.body.position.x, this.body.position.y);

    let img;
    if(!this.dead) {
      img = this.animations.get(this.dir).getImg();
    }
    else {
      img = this.animations.get("DEAD").getImg();
    }

    let width  = ((cellSize * 0.85) / img.width) * img.width;
    let height = ((cellSize * 0.85) / img.height) * img.height;
    image(img, 0, 0, width, height);

    pop();
  }

  update() {
    // Movement:
    if (this.controler.keyHeld.get(this.controler.right)) {
      this.velocity.x = this.speed;
      this.dir = "RIGHT";
    } else if (this.controler.keyHeld.get(this.controler.left)) {
      this.velocity.x = -this.speed;
      this.dir = "LEFT";
    } else {
      this.velocity.x = 0;
    }

    // TODO: Should have a "diagonal" dir for image...

    if (this.controler.keyHeld.get(this.controler.down)) {
      this.velocity.y = this.speed;
      this.dir = "DOWN";
    } else if (this.controler.keyHeld.get(this.controler.up)) {
      this.velocity.y = -this.speed;
      this.dir = "UP";
    } else {
      this.velocity.y = 0;
    }

    // If it's not dead, we need to get current image:
    if(!this.dead){
      if (this.velocity.x == 0 && this.velocity.y == 0) {
        this.animations.get(this.dir).pause();
      } else {
        this.animations.get(this.dir).play();
      }

      this.animations.get(this.dir).update();
    }

    // If it's dead, we need to keep the ghost moving:
    else {
      if(this.animations.get("DEAD").paused){
        this.animations.get("DEAD").play();
      }
      this.animations.get("DEAD").update();
    }

    this.move();
  }
  move() {
    Matter.Body.setVelocity(this.body, this.velocity);
  }

  plantBomb() {
    if (!this.dead && this.bombCnt < this.powers[0]) {
      this.bombCnt++;
      let col = int(this.body.position.x / cellSize);
      let row = int(this.body.position.y / cellSize);
      let x = col * cellSize + cellSize / 2;
      let y = row * cellSize + cellSize / 2;

      return new Bomb(x, y, this.id, this.powers[1]);
    }
  }
  bombExploded() {
    this.bombCnt--;
  }
  die() {
    this.dead = true;
    this.velocity.x = 0;
    this.velocity.y = 0;

    this.body.collisionFilter.category = pow(2,this.id) * pow(2,4); // (1,2,4 or 8) shiftLeft (4)
    this.body.collisionFilter.mask     = 512;                       // Only collide to borders
  }
  upgradePower(pup){
    switch(pup.indImg){
      case 0:
        this.powers[0] += 1;
        break;
      case 1:
        this.powers[1] += 1;
        break;
    }
  }
}
