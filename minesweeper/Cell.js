class Cell {
  constructor(row, col, value = 0) {
    this.row     = row;
    this.col     = col;
    this.value   = value; // "-1" = BOMB, from "0" to "8" = how many bombs around
    this.hidden  = true;
    this.marked  = false;
    this.exploded = false;
  }
  
  reveal(){
  	this.hidden = false;
  }
  
  mark(){
  	this.marked = !this.marked;
  }
  
  explode(){
  	this.exploded = true;
  }
  
  show(){
    if (this.exploded){
      	print("BOOOM");
        [rowP,colP] = indexToPixel(this.row, this.col, true);
      	fill(255,0,0); 		// BOOM!
        ellipse(colP,rowP,cellSize*0.40);
    }
    
    else if (this.marked){
      [rowP,colP] = indexToPixel(this.row, this.col, true);

      if (this.hidden){
        fill(0,0,255); 		// Just a blue flag
      } else if(this.value == -1){
      	fill(0,255,0); 		// User "flagged" a bomb! Well done, user!
      } else{
      	fill(255,255,0); 	// User "flagged" a wrong spot, waste of flag!
      }
      
      ellipse(colP,rowP,cellSize*0.40);
    }
    
    else if (!this.hidden){
      // Bomb:
      if(this.value < 0){
        [rowP,colP] = indexToPixel(this.row, this.col, true);
        fill(0,0,0);
        ellipse(colP,rowP,cellSize*0.40);
      }
      
      // Show how many bombs nearby:
      else if(this.value > 0){
        [rowP,colP] = indexToPixel(this.row, this.col, true);
        fill(179, 0, 255); //fill(191, 66, 244);
        textSize(25);
        textAlign(CENTER, CENTER);
        text(this.value, colP, rowP);
      }
      
      // 0 bombs nearby:
      else{
        [rowP,colP] = indexToPixel(this.row, this.col, false);
      	fill(220);
        rect(colP,rowP,cellSize,cellSize);
      }
      
    }
  }
}