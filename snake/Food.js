class Food{
	
	constructor(){
		this.pos   = createVector(0,0);
		this.pos.x = round( (random()*( (w-scl-scl)-(0+scl))+(0+scl))/scl) * scl;
		this.pos.y = round( (random()*( (h-scl-scl)-(0+scl))+(0+scl))/scl) * scl;
	}
	
	update(){
		this.pos.x = round( (random()*( (w-scl-scl)-(0+scl))+(0+scl))/scl) * scl;
		this.pos.y = round( (random()*( (h-scl-scl)-(0+scl))+(0+scl))/scl) * scl;
		
		/*
		Um número que seja múltiplo de "scl" e que esteja entre "w-scl-scl" e "0+scl"
			round( (random()*( (w-scl)-0)+0)/scl) * scl
			
		Um número que seja múltiplo de "scl" e que esteja entre "h-scl-scl" e "0+scl"
			round( (random()*( (h-scl)-0)+0)/scl) * scl)
		*/
	}
	
	show(){
		fill(255,0,0);
		rect(this.pos.x, this.pos.y, scl, scl);
	}

}