class Ghost{
  constructor(col, row, color, follow, img){
    this.pos   = createVector(col*cellSize, row*cellSize);
    this.col   = col;
    this.row   = row;
    this.color = color;
    this.follow = follow;
    this.img    = img;
  }

  show(){
    push();
    let x = this.col*cellSize + cellSize/2;
    let y = this.row*cellSize + cellSize/2;
    imageMode(CENTER);
    image(
      this.img,
      this.pos.x,
      this.pos.y,
      ((cellSize*0.95) / this.img.width)  * this.img.width,
      ((cellSize*0.95) / this.img.height) * this.img.height
    );
    pop();
  }

  update(player){
    let playerPos = createVector(player.col*cellSize, player.row*cellSize);
    let n = 1.75;
    playerPos.sub(this.pos);
    playerPos.setMag(n);

    if(this.follow[0] && this.follow[1]){
      this.pos.x += playerPos.x;
      this.pos.y += playerPos.y;
    }
    else if(this.follow[0] && !this.follow[1]) {
      this.pos.x += playerPos.x;
      this.pos.y += playerPos.y/2;
    } else if(!this.follow[0] && this.follow[1]){
      this.pos.x += playerPos.x/2;
      this.pos.y += playerPos.y;
    }else{
      this.pos.x += playerPos.x/2;
      this.pos.y += playerPos.y/2;
    }

  }
}
