let time = 0;
let wave = [];
let espaco = 200;
var funcName = "";

function drawCircles(qtd){
	var x;
	var y;
	var n;
	var radius;
	
	if (funcName == "square wave"){
		x   = 0;
		y   = 0;

		for (let i = 0; i < qtd; i++){
			n 		= 2*i + 1;
			radius 	= 65 * (4/(PI*n));

			ellipse(x,y,radius*2);

			x += radius * cos(n*PI*time);
			y += radius * sin(n*PI*time);
		}
	}
	else if (funcName == "triangle wave"){
		x   = 0;
		y   = 0;
		
		for (let i = 0; i < qtd; i++){
			n 		= 2*i + 1;
			radius 	= 102 * ( (8)/(PI*PI) ) * ( (pow(-1,(n-1)/2))/(n*n) );
			
			ellipse(x,y,radius*2);
			
			x += radius * cos(n*PI*time);
			y += radius * sin(n*PI*time);
		}
	}
	else{
		x = 0;
		y = 0;
	}
	
	return [x,y];
}

function changeWave(name){
	funcName = name;
}

function setup() {
  createCanvas(600, 450);
	slider = createSlider(1,100,3);
	slider.position(5,5);
	
	sqrWave = createButton("Square Wave");
	sqrWave.mousePressed(() => {changeWave("square wave")});
	
	triangWave = createButton("Triangle Wave");
	triangWave.mousePressed(() => {changeWave("triangle wave")});
}

function draw() {
  background(100);
	
	// ----------------------------------
	// Valor Slider:
	qtd = slider.value();
	text(qtd,150,18);
	
	// ----------------------------------
	// Novo canto superior esquerdo:
	translate(150,200);
	//fill(0,255,0);
	//ellipse(0,0,5);

	// ----------------------------------
	// Círculos:
	noFill();
	stroke(255);
	
	[x,y] = drawCircles(qtd);
	
	// ----------------------------------
	// Desenho:
	if (funcName != ""){
		// ----------------------------------
		// Ponto:
		fill(255,0,0);
		ellipse(x,y,10);

		// ----------------------------------
		// Onda:
		wave.unshift(y);

		beginShape();
		noFill();
		for (let i = 0; i < wave.length; i++){
			vertex(i+espaco,wave[i]);
		}
		endShape();
		
		// ----------------------------------
		// Seta:
		line(x,y,espaco,wave[0]);
	}
		
	// ----------------------------------
	// Próxima Iteração:
	if (wave.length > 300){ wave.pop(); }
	time = (time + 0.01) % 360;
	
	// ----------------------------------
}