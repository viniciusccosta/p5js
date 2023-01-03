class Fruit extends Food {
  constructor(col, row){
    super(col, row);
  }

  show(){
    push();
    let x = this.col*cellSize + cellSize/2;
    let y = this.row*cellSize + cellSize/2;
    fill(255,0,0);
    ellipse(x, y, cellSize*0.25);
    pop();
  }
}
