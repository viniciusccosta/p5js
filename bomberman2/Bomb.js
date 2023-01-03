class Bomb{
  constructor(x, y, playerID, range) {
    this.body     = Bodies.circle(x, y, cellSize * 0.5, {isStatic: true});
    this.body.collisionFilter.group    = 0;
    this.body.collisionFilter.category = 256;
    this.body.collisionFilter.mask     = 1+2+4+8+256+512;

    this.endMillis     = millis() + 3000; // 3 seconds
    this.exploded      = false;
    this.size          = 0.75;
    this.color         = [55,0,0];
    this.inWorld       = false;

    this.range         = range;
    this.playerID      = playerID;
    this.affectedCells = new Map();

    this.explosionStarted  = false;
    this.explosionEnded    = false;
    this.explosionDuration = 0.5;
    this.explosionMillis   = this.endMillis + this.explosionDuration * 1000;  // 1 second
    this.explosionColor    = [255,0,0,255];
  }
  show() {
    if(!this.explosionStarted){
      push();
      let x      = this.body.position.x;
      let y      = this.body.position.y;

      let img    = bombImg;
      let width  = ( (cellSize*this.size)/img.width )  * img.width;
      let height = ( (cellSize*this.size)/img.height ) * img.height;
      image(img,x,y,width,height);

      pop();
    }else{
      // TODO: If bombs explodes together it's drawing where shouldn't be drawn, why?
      push();
      noStroke();

      this.explosionColor[3] -= (256 / (60 * this.explosionDuration)); // (256 valores) / (60 frames * 1 segundo)

      fill(this.explosionColor);
      for(let [k, cell] of this.affectedCells){
        if(!stones.has(cell.toString())){
          let x = cell[0]*cellSize + cellSize/2;
          let y = cell[1]*cellSize + cellSize/2;
          rect(x,y,cellSize, cellSize, 8);
        }
      }
      pop();
    }
  }
  update(){
    let now = millis();

    if(!this.explosionStarted){
      if(now > this.endMillis){
        this.explode();
      }
      this.size += 0.002;       // de 0.75 para  1.00 são  25 valores, ou seja, ( (  25 valores ) / (60 frames * 3 segundos ) )
      this.color[0] += 1.1;     // de 0.00 para 55.00 são 200 valores, ou seja, ( ( 200 valores ) / (60 frames * 3 segundos ) )
      // TODO: Color should increase exponentialy
    }

    else if(now > this.explosionMillis){
      this.explosionEnded = true;
    }

  }

  explode(){
    this.exploded = true;

    // BFS from bomb's position
    let bomb_col   = int( this.body.position.x / cellSize );
    let bomb_row   = int( this.body.position.y / cellSize );

    // LEFT:
    for(let colOff = 1; colOff <= this.range; colOff++){
      let neigh = [bomb_col - colOff, bomb_row];
      if(neigh[0] > 3){
        this.affectedCells.set(neigh.toString(), neigh);
        if(neigh[0] <= 0 || crates.has(neigh.toString()) || stones.has(neigh.toString()) || bombs.has(neigh.toString())){ break; }
      }
    }

    // UP:
    for(let rowOff = 1; rowOff <= this.range; rowOff++){
      let neigh = [bomb_col, bomb_row - rowOff];
      if(neigh[1] > 0){
        this.affectedCells.set(neigh.toString(), neigh);
        if(neigh[0] <= 0 || crates.has(neigh.toString()) || stones.has(neigh.toString()) || bombs.has(neigh.toString())){ break; }
      }
    }

    // RIGHT:
    for(let colOff = 1; colOff <= this.range; colOff++){
      let neigh = [bomb_col + colOff, bomb_row];
      if(neigh[0] <= cols + 3){
        this.affectedCells.set(neigh.toString(), neigh);
        if(neigh[0] <= 0 || crates.has(neigh.toString()) || stones.has(neigh.toString()) || bombs.has(neigh.toString())){ break; }
      }
    }

    // DOWN:
    for(let rowOff = 1; rowOff <= this.range; rowOff++){
      let neigh = [bomb_col, bomb_row + rowOff];
      if(neigh[1] <= rows){
        this.affectedCells.set(neigh.toString(), neigh);
        if(neigh[0] <= 0 || crates.has(neigh.toString()) || stones.has(neigh.toString()) || bombs.has(neigh.toString())){ break; }
      }
    }

  }
  startExplosion(){
    this.explosionStarted = true;
  }
}
