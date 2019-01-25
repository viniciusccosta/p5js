const rows = 4;
const cols = 5;

let ball; // Player
let blocks; // List of blocks
let distMin; // Minimal distance between two rows
let blockW; // Block Width
let universalSpeed = 5; // Used to reduce speed when player hits a block

// MATTER JS:
let engine;

function setup() {
  createCanvas(350, 620);
  rectMode(CENTER);

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

	// ===============================================
	// MATTER.JS:

	// WORLD:
	engine = Matter.Engine.create();

	// GRAVITY:
	engine.world.gravity.scale = 0; // default: 0.001

	// PLAYER:
	for(let t of ball.tail) {
		t.ignoreGravity = true;
		t.isSleeping = true;
		Matter.World.add(engine.world, t); // NOT GOOD :/
	}

	// TODO: Add to world when "snake" increase length
	// TODO: Remove from world when collide

	Matter.Events.on(engine, 'collisionActive', function(event) {
	  for (let i = 0; i < event.pairs.length; i++) {
			let pair = event.pairs[i];

	    if ( (pair.bodyA.label === 'snake' || pair.bodyB.label === 'snake') ) {
	      //Matter.Events.trigger(ball.tail[0], 'collision', { pair : pair });
	    }
	  }
	});

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			let b = blocks[row][col];
			//universalSpeed = 0.1; // TODO: Only because it's not ignoring grativy
			//Matter.World.add(engine.world, b.body); // TODO: Why only the center box?
		}
	}

	// ===============================================

}

function draw() {
  background(200);

  // ========================================================================================
  // Blocks:
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let block = blocks[row][col];

      if (block != null) {
        block.update();
        block.show();

        if (block.offscreen) {
          // TODO: Generate randomly block
        }
      }
    }
  }

  // ========================================================================================
  // MATTER.JS:
  Matter.Engine.update(engine);

  // ========================================================================================

  // Player:
  ball.update();
  ball.show();
}

// TODO: Collision
// TODO: Walls/Obstacles
// TODO: Food
// TODO: Randomly generate blocks
// TODO: Rename from "ball vs blocks" to "snake vs blocks" everywhere (github included)
