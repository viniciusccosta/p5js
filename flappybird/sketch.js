// =============================================================================
let bird;
var pipes;
var score;
let qtd;
var space;

// =============================================================================
function preload(){
	bird	= new Bird(0, 0);
	bg 		= loadImage("background.png"); //https://publicdomainvectors.org/en/free-clipart/A-red-bug/37662.html
}

// =============================================================================
function setup() {
	createCanvas(windowWidth, windowHeight);

  bird.x 		= width * 0.1;
  bird.y  	= int(height/2);

	score 		= 0;
	pipes 		= [];
	qtd 			= 4;  	// How many pipes. Suggestion: 4
	space 	  = 3.5 * (2*bird.r);

	generatePipes();
}

// =============================================================================
function draw() {
	// Background:
	background(bg);

	// Pipes:
	for (var i = 0; i < pipes.length; i++){
		// Upper pipe:
		pipe1 = pipes[i].upper;
		pipe1.show();
		pipe1.move();

		// Bottom pipe:
		pipe2 = pipes[i].bottom;
		pipe2.show();
		pipe2.move();

		// Score:
		var dist = (bird.x-bird.r) - (pipe1.x + pipe1.width);
		if(dist >= 0 && dist < pipe1.speed) score++;

		// Update pipe:
		if (pipe1.x + pipe1.width < 0 && pipe2.x + pipe2.width < 0 ){

			if(score >= qtd && score < qtd*5) 						space = random(2.8 * (2*bird.r), 3.1 * (2*bird.r)); // GREEN
			else if(score >= qtd*5  && score < qtd*10)  	space = random(2.3 * (2*bird.r), 2.7 * (2*bird.r)); // YELLOW
			else if(score >= qtd*15 && score < qtd*25)  	space = random(1.8 * (2*bird.r), 2.2 * (2*bird.r)); // RED
			else if(score >= qtd*20)  										space = random(1.5 * (2*bird.r), 1.7 * (2*bird.r)); // BLACK

			pipe1.update(space);
			pipe2.update(space,pipe1.height);
		}
	}

	// Bird:
	bird.show();
	bird.update();

	// Score:
	push();
	fill(0);
	textAlign(LEFT, TOP);
	textSize(64);
	text(score, 20, 20);
	pop();

	// Bird is dead:
	if( isGameOver() ){
		gameOver();
	}
}

// =============================================================================
function keyPressed(){
	if (key == " "){
		bird.up();
	}
}

function touchStarted(){
	bird.up();
}

// =============================================================================
function generatePipes(){
	for (var i = 0; i < qtd; i++){
		// Upper Pipe
		x1    = width + i * 1/qtd * width;
		y1    = 0;
		ph1   = round( random(height*0.05, height-space-10) ); 	// random height
		pipe1 = new Pipe(x1,y1,ph1, space);

		// Bottom Pipe
		x2    = x1;
		y2    = ph1 + space;
		ph2   = height - y2;
		ph2 	= ph2 > 0 ? ph2 : 0;
		pipe2 = new Pipe(x2,y2,ph2, space);

		// List:
		pipes.push( {upper: pipe1, bottom: pipe2} );
	}
}

// =============================================================================
function isGameOver(){
	for (var pairPipes of pipes){
		pipeUpper  = pairPipes.upper;
		pipeBottom = pairPipes.bottom;

		if (bird.collided(pipeUpper) || bird.collided(pipeBottom)) return true;
	}

	return false;
}

// =============================================================================
function gameOver(){
	setup();
}

// =============================================================================
// TODO: Easter Egg with score 131015 = Oct 13,2015
