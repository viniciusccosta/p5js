const rows = 4;
const cols = 5;

let ball; // Player
let blocks; // List of blocks
let distMin; // Minimal distance between two rows
let blockW; // Block Width
let universalSpeed = 2; // Used to reduce speed when player hits a block

// MATTER JS:
let engine;
let tail = [];
let cnstrs = [];
let vel;
let useMatter = true;

function setup() {
  createCanvas(350, 620);
  rectMode(CENTER);
  //frameRate(10);

  // MATTER.JS:
  if (useMatter) {
    // ==================================================================================================
    // WORLD:
    engine = Matter.Engine.create();

    // SNAKE:
    vel = createVector(0, 0);
    let r = 8;
    let d = 2 * r;
    for (let i = 0; i < 10; i++) {
      tail.push(Matter.Bodies.circle(width / 2 + random(0, 0), i * d + r + width / 2, r));
    }
    for (let t of tail) Matter.World.add(engine.world, t);

    // CONSTRAINTS:
    for (let i = 0; i < tail.length - 1; i++) {
      cnstrs.push(Matter.Constraint.create({
        bodyA: tail[i],
        bodyB: tail[i + 1],
        length: d
      }));

      tail[i + 1].frictionAir = 0.1;
    }
    for (let c of cnstrs) Matter.World.add(engine.world, c);

    // GRAVITY:
    engine.world.gravity.scale = 0.001; // default: 0.001
    tail[0].ignoreGravity = true;
    Matter.Events.on(engine, 'beforeUpdate', function() {
      var gravity = engine.world.gravity;

      Matter.Body.applyForce(tail[0], {
        x: 0,
        y: 0
      }, {
        x: -gravity.x * gravity.scale * tail[0].mass * tail.length,
        y: -gravity.y * gravity.scale * tail[0].mass * tail.length
      });

    });
    // ==================================================================================================
  }

  // Player:
  ball = new Ball(width * 0.5, height * 0.5);

  // Blocks:
  blocks = [];
  blockW = width / cols;
  distMin = blockW * 4;

  for (let row = 0; row < rows; row++) {
    blocks[row] = [];
    for (let col = 0; col < cols; col++) {
      blocks[row][col] = new Block((col * blockW) + blockW / 2, (-row * distMin) + blockW / 2, blockW, blockW, row);
    }
  }

}

function draw() {
  background(200);

  // ========================================================================================
  // Blocks:
  for (let row = 0; row < rows; row++) {
    let rnd = random(0, 0);

    for (let col = 0; col < cols; col++) {
      let block = blocks[row][col];

      if (block != null) {
        block.update();
        block.show();

        if (block.offscreen) {
          blocks[row][col] = new Block(
            block.pos.x,
            0 /*block.pos.y - (rows*distMin + blockW/2)*/ ,
            blockW,
            blockW,
            row); // TODO: Generate semi-randomly
        }
      }
    }
  }

  // ========================================================================================
  // MATTER.JS:
  if (useMatter) {
    fill(0, 255, 255);
    for (let teste of tail) ellipse(teste.position.x, teste.position.y, 2 * teste.circleRadius);

    fill(255, 0, 0);
    ellipse(tail[0].position.x, tail[0].position.y, 2 * tail[0].circleRadius);
    Matter.Body.setVelocity(tail[0], vel);

    Matter.Engine.update(engine);
  }

  // ========================================================================================

  // Player:
  ball.move();
  ball.update();
  ball.show();
}

function keyPressed() {
  ball.move(keyCode);

  // MATTER.JS
  if (useMatter) {
    switch (keyCode) {
      case LEFT_ARROW:
        vel.x -= 5;
        vel.x = constrain(vel.x, -5, 5);
        break;
      case RIGHT_ARROW:
        vel.x += 5;
        vel.x = constrain(vel.x, -5, 5);
        break;
    }
  }

}

// TODO: Collision
// TODO: Walls/Obstacles
// TODO: Food
