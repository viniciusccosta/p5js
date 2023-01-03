class PowerUp{
  constructor(col, row, which){
    this.col   = col;
    this.row   = row;
    this.which = which;       // TODO: [0,1,2] | [Increase Speed, Increse Bomb Range, Increse How Many Bombs]

    this.curImg;
    switch(this.which){
      case 0:
        break;
      case 1:
        this.curImg = pupImgs.get("FIRE");
        break;
      case 2:
        this.curImg = pupImgs.get("BOMB");
        break;
    }

    this.life  = 2;
    this.destroyed = false;
  }
  show(){
    push();
    imageMode(CENTER);
    image(
      this.curImg,
      this.col*cellSize + cellSize/2,
      this.row*cellSize + cellSize/2,
      ( (cellSize*0.7) / this.curImg.width) * this.curImg.width,
      ( (cellSize*0.7) / this.curImg.height) * this.curImg.height
    );
    pop();
  }

  bombExploded(hittenCells){
    if(hittenCells.has([this.col, this.row].toString())) this.life--;
    if(this.life <= 0) this.destroy();
  }
  destroy(){
    this.destroyed = true;
  }
}
