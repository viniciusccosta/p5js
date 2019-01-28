const rows = 4;
const cols = 5;

let ball; // Player
let blocks; // List of blocks
let distMin; // Minimal distance between two rows
let blockW; // Block Width
let universalSpeed = 2; // Used to reduce speed when player hits a block

// MATTER JS:
let engine;

function setup() {
  createCanvas(300, 600);
  rectMode(CENTER);

	// ===============================================
	// OBJECTS:

	// -------------
  // Player:
  ball = new Ball(width * random(1), height * 0.5);

	// -------------
  // Blocks:
  blocks  = [];
  blockW  = width / cols;
  distMin = blockW * 2;

  for (let row = 0; row < rows; row++) {
    blocks[row] = [];
    for (let col = 0; col < cols; col++) {
      blocks[row][col] = new Block(
				(col * blockW)   + blockW / 2,
				(-row * distMin) + blockW / 2,
				blockW,
				blockW,
				row*rows + col); // TODO: Randomly
    }
  }
	// -------------

  // ===============================================
  // MATTER.JS:

	// -------------
  // World:
  engine = Matter.Engine.create();

  for (let b of blocks) Matter.World.add(engine.world, b);

	// -------------
  // Gravity:
  engine.world.gravity.scale = 0;

	// -------------
  // Player:
  for (let t of ball.tail) { Matter.World.add(engine.world, t); }

	// -------------
	// Blocks:
	for (let row = 0; row < rows; row++){
		for (let col = 0; col < cols; col++){
			let b = blocks[row][col]
			Matter.World.add(engine.world, b.body);
		}
	}

  Matter.Events.on(engine, 'collisionActive', function(event) {
    for (let i = 0; i < event.pairs.length; i++) {
  		let pair = event.pairs[i];

      if ( (pair.bodyA.label === 'snake' && pair.bodyB.label !== 'snake')
			||   (pair.bodyA.label !== 'snake' && pair.bodyB.label === 'snake') ) {

				// --------------------------------------
				// BALL:
				let t = ball.collided();
				if(t){
					Matter.World.remove(engine.world, t);
				}

				// --------------------------------------
				// BLOCKS:
				for(let row = 0; row < rows; row++){
					for(let col = 0; col < cols; col++){
						let block = blocks[row][col];

						if(block != null){
							if(block.body === pair.bodyA || block.body === pair.bodyB){
								let remove = block.collided();
								if(remove){
									Matter.World.remove(engine.world, block.body);
									blocks[row][col] = null;
								}
							}
						}

					}
				}

				// --------------------------------------

      }
    }
  });

	// -------------

  // ===============================================

}

function draw() {
  background(200);
	Matter.Engine.update(engine);

  // ========================================================================================
  // MATTER.JS:
  for (let row = 0; row < rows; row++){
		for (let col = 0; col < cols; col++){
			let b = blocks[row][col]
			if(b != null){
				b.update();
				b.show();
			}
		}
	}

  // ========================================================================================
  // Player:
	if(!ball.dead){
	  ball.update();
  	ball.show();
	}
	else{
		push();
		fill(255,0,255);
		textSize(64);
		textAlign(CENTER, CENTER);
		text("FIM", width/2, height/2);
		pop();
		noLoop();
	}
}

// TODO: Collision
// TODO: Walls/Obstacles
// TODO: Food
// TODO: Randomly generate blocks
// TODO: Rename from "ball vs blocks" to "snake vs blocks" everywhere (github included)
