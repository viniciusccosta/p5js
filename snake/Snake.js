class Snake {
	constructor() {
		this.pos = createVector(scl, scl);
		this.dir = createVector(1, 0);

		this.body = [];
		this.body.push(this.pos); // Adicionando a cabeça da snake ao array
	}

	chgDir(hor, ver) {

		if (abs(this.dir.x - hor) <= 1 && abs(this.dir.y - ver) <= 1) {
			this.dir.x = hor;
			this.dir.y = ver;
		}

		/*
			Não permitiremos ele fazer 180°:
				abs( ( 0, 1) - ( 0,-1) ) = (0, 2) 
				abs( ( 0,-1) - ( 0, 1) ) = (0, 2)
				abs( ( 1, 0) - (-1, 0) ) = (2, 0)
				abs( (-1, 0) - ( 1, 0) ) = (2, 0)				
		*/
	}
	eaten(food) {
		let a = abs(this.pos.x - food.pos.x);
		let b = abs(this.pos.y - food.pos.y);

		return sqrt(a * a + b * b) < scl;
	}
	died() {
		let lastIndex = this.body.length - 1;
		let head = this.body[lastIndex];

		// Está na borda:
		if ((head.x <= 0 || head.x + scl >= w) && (this.dir.x) != 0) {
			return true;
		} else if ((head.y <= 0 || head.y + scl >= h) && (this.dir.y) != 0) {
			return true;
		}

		return false;
	}
	grow() {
		let lastIndex = this.body.length - 1;
		let head = this.body[lastIndex];
		this.body.push(head);
	}

	update() {
		let newPos = createVector(
			constrain(this.pos.x + this.dir.x * scl, 0, w - scl),
			constrain(this.pos.y + this.dir.y * scl, 0, h - scl)
		);
		
		this.body.shift();
		this.body.push(newPos);
		this.pos = newPos;

		/*
			Andando de "scl" em "scl" (posição inicial deve ser múltiplo de scl ):
				(this.pos.x + this.dir.x * scl)
				(this.pos.y + this.dir.y * scl)
			
			Atravessando paredes:
				(this.pos.x + this.dir.x * scl) % w
				(this.pos.y + this.dir.y * scl) % h;
				
			Infelizmente, o JS não faz módulo de números negativos, por isso:
				while(this.pos.x < 0) this.pos.x += w;
				while(this.pos.y < 0) this.pos.y += h;
		*/
	}
	show() {
		let i = 0;
		for (; i < this.body.length-1; i++){
			fill(0,127,0);
			rect(this.body[i].x, this.body[i].y, scl, scl);
		}
		fill(0,255,0);
		rect(this.body[i].x, this.body[i].y, scl, scl);
	}
	
}