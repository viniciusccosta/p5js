class Crate {
  constructor(col, row){
    this.col        = col;
    this.row        = row;
    this.destroyed  = false;
  }
  show(){
    push();
    fill(244, 182, 66);
    image(
      crateImg,
      this.col*cellSize,
      this.row*cellSize,
      (cellSize / crateImg.width) * crateImg.width,
      (cellSize / crateImg.height) * crateImg.height
    );
    //rect(this.col * cellSize, this.row * cellSize, cellSize, cellSize);
    pop();
  }

  bombExploded( hittenCells ){
    if(hittenCells.has([this.col, this.row].toString())) this.destroy();
  }
  destroy(){
    this.destroyed = true;
  }
}
