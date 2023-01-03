class Player{
  constructor(col, row){
    this.col   = col;
    this.row   = row;
    this.dir   = "";
    this.cnt   = 0;
    this.step  = 0.25;

    this.moving = false;
    this.closed = true;
    this.curImg = playerImgs.get("CLOSED").get("LEFT");

    this.powerEndTime;
    this.power = false;
  }

  update(){
    // TODO: User can't pass through obstacles, ghost's house included.

    this.cnt = (this.cnt + 1) % int(rate*0.05); // %frameRate to change each second, %frameRate/2 to change each half second

    if(this.cnt == 0){
      this.moving = false;

      switch(this.dir){
        case "RIGHT":
          if(this.row > portalLoc[0] && this.row < portalLoc[1]){
            if(this.col >= cols - 1) this.col = 0;
            else this.col += this.step;
            this.moving = true;
          }
          else if(this.col < cols - 2) {
            this.col += this.step;
            this.moving = true;
          }
          break;
        case "DOWN":
          if(this.row < rows - 2 && this.col > 0 && this.col < cols-1) {
            this.row += this.step;
            this.moving = true;
          }
          break;
        case "LEFT":
          if(this.row > portalLoc[0] && this.row < portalLoc[1]){
            if(this.col <= 0) this.col = cols - 1;
            else this.col -= this.step;
            this.moving = true;
          }
          else if(this.col > 1) {
            this.col -= this.step;
            this.moving = true;
          }
        break;
        case "UP":
          if(this.row > 1 && this.col > 0 && this.col < cols-1) {
            this.row -= this.step;
            this.moving = true;
          }
          break;
      }

      if(this.power){
        let now = millis();
        if(now > this.powerEndTime){
          this.power = false;
        }
      }

      if(this.moving){
        this.closed = !this.closed;
        if(this.closed)   this.curImg = playerImgs.get("CLOSED").get(this.dir);
        else              this.curImg = playerImgs.get("OPENED").get(this.dir);
      }
    }

  }
  show(){
    image(
      this.curImg,
      this.col * cellSize,
      this.row * cellSize,
      ( (cellSize*1) / this.curImg.width)  * this.curImg.width,
      ( (cellSize*1) / this.curImg.height) * this.curImg.height,
    );
  }

  move(kc){
    switch(kc){
      case RIGHT_ARROW:
        if(this.dir == "UP" || this.dir == "DOWN"){ this.row = round(this.row); }
        this.dir  = "RIGHT";
        break;
      case DOWN_ARROW:
        if(this.dir == "RIGHT" || this.dir == "LEFT"){ this.col = round(this.col); }
        this.dir = "DOWN";
        break;
      case LEFT_ARROW:
        if(this.dir == "UP" || this.dir == "DOWN"){ this.row = round(this.row); }
        this.dir = "LEFT";
        break;
      case UP_ARROW:
        if(this.dir == "RIGHT" || this.dir == "LEFT"){ this.col = round(this.col); }
        this.dir = "UP";
        break;
    }
  }
  getPower(){
    this.power = true;
    this.powerEndTime = millis() + 10000; // 10 seconds
  }
}
