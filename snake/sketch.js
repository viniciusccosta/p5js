let scl = 20;
let w = 400; // Precisar ser múltiplo de "scl"
let h = 400; // Precisar ser múltiplo de "scl"

let snake;
let food;

function keyPressed() {

	switch (keyCode) {
		case UP_ARROW:
			snake.chgDir(0, -1);
			break;
		case DOWN_ARROW:
			snake.chgDir(0, 1);
			break;
		case RIGHT_ARROW:
			snake.chgDir(1, 0);
			break;
		case LEFT_ARROW:
			snake.chgDir(-1, 0);
			break;
	}
}

function setup() {
	createCanvas(w, h);

	snake = new Snake();
	food = new Food();
	
	frameRate(12);
}

function draw() {
	background(220);

	fill(0);
	rect(0, 0, w, scl);
	rect(0, 0, scl, h);
	rect(h - scl, 0, scl, w);
	rect(0, w - scl, h, scl);

	if (snake.eaten(food)) {
		snake.grow();
		food.update();
	}

	snake.update();
	if (snake.died()) {
		setup();
	}


	snake.show();
	food.show();

	textSize(30);
	textAlign(CENTER);
	text('Nicole Beatriz', 0, floor(h / 2) - 30, w, floor(h / 2));

}