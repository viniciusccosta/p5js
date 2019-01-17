class Food {
  constructor(col, row){
    this.col   = col;
    this.row   = row;
    this.eaten = false;
  }

  update(player){
    if(player.col == this.col && player.row == this.row){
      this.eaten = true;
    }
  }

  show(){
    push();
    let x = this.col*cellSize + cellSize/2;
    let y = this.row*cellSize + cellSize/2;
    imageMode(CENTER);
    image(
      foodImg,
      x,
      y,
      ((cellSize*0.5) / foodImg.width)  * foodImg.width,
      ((cellSize*0.5) / foodImg.height) * foodImg.height
    );
    pop();
  }
}
