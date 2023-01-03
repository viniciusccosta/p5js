// Module aliases
var Engine = Matter.Engine;
var World  = Matter.World;
var Bodies = Matter.Bodies;

let engine;
let ground;
let groundHeight;
let rods = [];
let curDisk = null;
let c;

let cntDisk  	= 3; 		 	// Initial amout of disks
let finished  = false; 	// Draw "GAME OVER" when true
let cntMvs 	  = 0; 		 	// How many moves have the user done
let maxLevels = 10; 	  // How many disks in the hardest level. Ps: less than 11!

function setup() {
	//  =========== Global Settings ===========
  rectMode(CENTER);
  imageMode(CENTER);
	noLoop();

	//  =========== Canvas ===========
	c = createCanvas(windowWidth*0.75, windowHeight*0.75);

	//  =========== Engine ===========
	// Engine:
	/*engine = Engine.create();
	engine.world.gravity.scale = 0;*/

	// =========== Bodies ===========
	// Ground:
	groundHeight = height*0.1;
	ground = Bodies.rectangle(width/2, height, width, groundHeight, {isStatic: false} );

	// Rods:
	let rodsH = height * 0.65;
	let rodsY = height - (groundHeight/2) - (rodsH/2);
	rods.push( new Rod( (1*width)/4, rodsY, rodsH, 0) );
	rods.push( new Rod( (2*width)/4, rodsY, rodsH, 1) );
	rods.push( new Rod( (3*width)/4, rodsY, rodsH, 2) );

	// Disks:
	for(let i = 0; i < cntDisk; i++){
		rods[0].addDisk();
	}

	// =========== World ===========
	// Add bodies to the world:
	/*World.add(engine.world, ground);
	for(let  rod of  rods) World.add(engine.world,  rod.body);
	for(let disk of disks) World.add(engine.world, disk.body);*/
}

function draw() {
	background(230);

	// =========== GROUND ===========
	push();
	fill(0,0,0);
	rect( ground.position.x, ground.position.y, width, ground.bounds.max.y - ground.bounds.min.y );
	pop();

	// =========== RODS ===========
	for(let  rod of  rods) {  rod.show(); }
	if(curDisk != null) curDisk.show();

	// =========== TEXT ===========
	if(finished){
		push();
		fill(255,0,255);
		textSize(100);
		textAlign(CENTER, CENTER);
		text("GAME OVER", width/2, height/2);
		pop();
	}else{
		push();
		fill(0);
		textSize(40);
		textAlign(CENTER, CENTER);
		text("Moves: " + cntMvs, width*0.1, height*0.1);
		pop();
	}

	// =========== Engine ===========
	//Engine.update(engine);

}

function mousePressed(){
	if(finished) return false;

	for(let rod of rods){
		if( mouseX >= rod.body.position.x - width*(0.24/2) && mouseX <= rod.body.position.x + width*(0.24/2) ){ // (width)*(0.24/2) --> Rod.addDisk() value
			if( mouseY >= rod.body.position.y - rod.h/2 && mouseY <= rod.body.position.y + rod.h/2 ){
				if(curDisk == null){
					curDisk = rod.levitateDisk();
				}else{
					if(rod.diskIn(curDisk)){
						cntMvs++;
						curDisk = null;
						if(isGameOver()) gameOver();
					}
				}
				break;
			}
		}
	}

	redraw();
	return false;
}

function isGameOver(){
	return rods[0].disks.length == 0 && rods[1].disks.length == 0;
}

function gameOver(){

	if(cntDisk < maxLevels){
		rods  	= [];
		curDisk = null;
		cntMvs  = 0;
		cntDisk++;
		setup();
	}else{
		finished = true;
		redraw();
	}

}
