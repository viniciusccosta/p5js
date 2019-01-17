p5.disableFriendlyErrors = true; // disables FES

const cols 		 = 30; // 26
const rows 		 = 20; // 29
const cellSize = 35; // 20
const rate  	 = 60; // 40

let player;
let foods 		  	= new Map();
let specialFdsLoc = new Set();
let portalLoc 		= []; 					// Where the player can pass through the wall
let ghostHouse 	  = [];
let ghosts 				= [];
let playerImgs 		= new Map();
let ghostsImgs 	  = new Map();
let foodImg;
let sFoodImg;

function preload(){
	playerImgs.set("CLOSED", new Map());
	playerImgs.get("CLOSED").set("RIGHT", loadImage("images/close_right.png"));
	playerImgs.get("CLOSED").set("DOWN", 	loadImage("images/close_down.png"));
	playerImgs.get("CLOSED").set("LEFT", 	loadImage("images/close_left.png"));
	playerImgs.get("CLOSED").set("UP", 		loadImage("images/close_up.png"));

	playerImgs.set("OPENED", new Map());
	playerImgs.get("OPENED").set("RIGHT", loadImage("images/open_right.png"));
	playerImgs.get("OPENED").set("DOWN", 	loadImage("images/open_down.png"));
	playerImgs.get("OPENED").set("LEFT", 	loadImage("images/open_left.png"));
	playerImgs.get("OPENED").set("UP", 		loadImage("images/open_up.png"));

	foodImg = loadImage("images/hamburger.png");
	sFoodImg = loadImage("images/fries.png");

	ghostsImgs.set("ORANGE", loadImage("images/ghost1.png"));
	ghostsImgs.set("RED", 	 loadImage("images/ghost2.png"));
	ghostsImgs.set("PINK", 	 loadImage("images/ghost3.png"));
	ghostsImgs.set("BLUE", 	 loadImage("images/ghost4.png"));
}
function setup() {
	// Canvas:
	//frameRate(rate);
	var cnv = createCanvas(cols*cellSize, rows*cellSize);
	cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

	// Map:
	loadMap();

	// Food:
	for(let col = 1; col < cols - 1; col++){
		for(let row = 1; row < rows - 1; row++){
			let pos = [col, row];
			if ( specialFdsLoc.has(pos.toString()) ){
				foods.set( [col,row].toString() , new SpecialFood(col, row) );
			}else{
				foods.set( [col,row].toString(), new Food(col, row) );
			}
		}
	}

	// Player:
	player = new Player(cols-2,rows-2);

	// Ghosts:
	ghosts.push(
		new Ghost(int(cols/2 + 1), int(rows/2), {r: 255, g:   0, b:   0}, [false,false], ghostsImgs.get("ORANGE")) );
	ghosts.push(
		new Ghost(int(cols/2 - 1), int(rows/2), {r:   0, g: 255, b:   0}, [false, true], ghostsImgs.get("RED")) );
	ghosts.push(
		new Ghost(int(cols/2), int(rows/2 + 1), {r:   0, g:   0, b: 255}, [true, false], ghostsImgs.get("PINK")) );
	ghosts.push(
		new Ghost(int(cols/2), int(rows/2 - 1), {r: 255, g:   0, b: 255}, [true,  true], ghostsImgs.get("BLUE")) );

}
function draw() {
	// Background
	background(0);
	drawMap();

	// Food:
	push();
	for(let [k,food] of foods){
		food.show();

		food.update(player);
		if(food.eaten){
			if(food instanceof SpecialFood){
				player.getPower();
			}
			foods.delete(k); 			// TODO: If food eaten, delete from array or just make it invisible ?
		}
	}
	pop();

	// Ghosts:
	for(let ghost of ghosts){
		ghost.update(player);
		ghost.show();
	}

	// Player:
	player.update();
	player.show();

	// frameRate
	/*push();
	fill(255);
	textSize(32);
	textAlign(LEFT, CENTER);
	text(round(getFrameRate()), 0, 20);
	pop();*/
}

function keyPressed(){
	player.move(keyCode);
}

function loadMap(){
	// SpecialFood are not randomly generate:
	specialFdsLoc.add( [     2,     2].toString() );
	specialFdsLoc.add( [cols-3,     2].toString() );
	specialFdsLoc.add( [     2,rows-3].toString() );
	specialFdsLoc.add( [cols-3,rows-3].toString() );

	// Teletransport Rows:
	portalLoc.push( int(rows/2 - 2), int(rows/2 + 2) );

	// Ghost House:
	ghostHouse.push( [int(cols/2 - 3), portalLoc[0]] ); // UPPER LEFT
	ghostHouse.push( [int(cols/2 + 3), portalLoc[1]] ); // BOTTOM RIGHT

}
function drawMap(){
	// ----------------------------------------------------
	// OutSide Stroke:
	push();
	stroke(0,0,255);
	strokeWeight(cellSize);
	noFill();
	rect(0,0, width, height);
	pop();

	// ----------------------------------------------------
	// Portal:
	push()
	noStroke();
	fill(0);
	rect(
		0,
		portalLoc[0]*cellSize,
		width,
		(portalLoc[1] - portalLoc[0])*cellSize
	);
	pop();

	// ----------------------------------------------------
	// Ghost House:
	push();
	noFill();
	stroke(0,0,255);
	strokeWeight(cellSize/2);
	rect(
		ghostHouse[0][0]*cellSize,
		ghostHouse[0][1]*cellSize,
		(ghostHouse[1][0] - ghostHouse[0][0])*cellSize,
		(ghostHouse[1][1] - ghostHouse[0][1])*cellSize
	);
	pop();

	// ----------------------------------------------------

}
