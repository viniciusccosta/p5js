const rows = 4;
const cols = 5;

let ball; 							// Player
let blocks; 						// List of blocks
let distMin; 						// Minimal distance between two rows
let blockW; 						// Block Width
let universalSpeed = 2; // Used to reduce speed when player hits a block

function setup() {
  createCanvas(350, 620);
  rectMode(CENTER);

  // Player:
  ball = new Ball(width * 0.5, height * 0.5);

  // Blocks:
	blocks  = [];
	blockW 	= width/cols;
	distMin = blockW * 4;

	for(let row = 0; row < rows; row++){
		blocks[row] = [];
		for(let col = 0; col < cols; col++){
			blocks[row][col] = new Block( ( col * blockW)  + blockW/2, (-row * distMin) + blockW/2, blockW, blockW, row );
		}
	}
}

function draw() {
  background(200);

	translate(0, height/2 - ball.pos.y);

  // Blocks:
  for (let row = 0; row < rows; row++) {
		let rnd = random(0, 0);

    for (let col = 0; col < cols; col++) {
      let block = blocks[row][col];

      if (block != null) {
        block.update();
				block.show();

				if(block.offscreen){
					blocks[row][col] = new Block(
						block.pos.x,
						0 /*block.pos.y - (rows*distMin + blockW/2)*/,
						blockW,
						blockW,
						row); // TODO: Generate semi-randomly
				}
      }
    }
  }


  // Player:
	ball.move();
	ball.update();
  ball.show();
}

function keyPressed(){
	ball.move(key, keyCode);
}

// TODO: Collision
// TODO: Walls/Obstacles
// TODO: Food
