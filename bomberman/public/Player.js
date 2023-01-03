class Player {
  constructor(col, row, id, idxImg) {
    this.center_x = col * cellSize + cellSize / 2;
    this.center_y = row * cellSize + cellSize / 2;

    this.id     = id;
    this.idxImg = idxImg == null ? 0 : idxImg;

    this.r      = cellSize * 0.50;
    this.powers = [cellSize*0.2, 1, 1]; // Speed, Range Bomb
    this.dead   = false;
    this.bombs  = new Map(); // TODO: I need to know how many bombs that I have plantted still "alive" to know if I can plant another one or not

    this.curImgKey = "DOWN";
  }
  show() {
    var curImg = playersImgs[this.idxImg].get(this.curImgKey);

    image(
      curImg,
      this.center_x - cellSize/2,
      this.center_y - cellSize/2,
      (cellSize / curImg.width)  * curImg.width,
      (cellSize / curImg.height) * curImg.height
    );
  }
  move(kc,cstrn) {
    // TODO: Do something about the speed :/
    switch (kc) {
      case RIGHT_ARROW:
        this.curImgKey = "RIGHT";

        if (this.center_x + this.r < qtdCols * cellSize && !this.hasStone("RIGHT") && !this.hasCrate("RIGHT") && !this.hasBomb("RIGHT")) {
          if(cstrn){
            this.center_x = (int(this.center_x/cellSize) + 1) * cellSize + cellSize/2; // center of (currentColumn + 1)
            this.center_y = (int(this.center_y/cellSize) + 0) * cellSize + cellSize/2;
          }else{
            this.center_x += this.powers[0];
          }
          this.hasPowerup();
        }
        break;
      case UP_ARROW:
        this.curImgKey = "UP";

        if (this.center_y - this.r > 0 && !this.hasStone("UP") && !this.hasCrate("UP") && !this.hasBomb("UP")) {
          if(cstrn){
            this.center_x = (int(this.center_x/cellSize) + 0) * cellSize + cellSize/2;
            this.center_y = (int(this.center_y/cellSize) - 1) * cellSize + cellSize/2;
          }else{
            this.center_y -= this.powers[0];
          }
          this.hasPowerup();
        }
        break;
      case LEFT_ARROW:
        this.curImgKey = "LEFT";

        if (this.center_x - this.r > 0 && !this.hasStone("LEFT") && !this.hasCrate("LEFT") && !this.hasBomb("LEFT")) {
          if(cstrn){
            this.center_x = (int(this.center_x/cellSize) - 1) * cellSize + cellSize/2;
            this.center_y = (int(this.center_y/cellSize) + 0) * cellSize + cellSize/2;
          }else{
            this.center_x -= this.powers[0];
          }
          this.hasPowerup();
        }
        break;
      case DOWN_ARROW:
        this.curImgKey = "DOWN";

        if (this.center_y + this.r < qtdRows * cellSize && !this.hasStone("DOWN") && !this.hasCrate("DOWN") && !this.hasBomb("DOWN")) {
          if(cstrn){
            this.center_x = (int(this.center_x/cellSize) + 0) * cellSize + cellSize/2;
            this.center_y = (int(this.center_y/cellSize) + 1) * cellSize + cellSize/2;
          }else{
            this.center_y += this.powers[0];
          }
          this.hasPowerup();
        }
        break;
      case 32: // SPACE
        if(this.bombs.size < this.powers[2]){
          var pos  = [int(this.center_x / cellSize), int(this.center_y / cellSize)];
          var now  = millis();
          var bomb = new Bomb(pos[0],pos[1],this.powers[1]);

          //this.bombs.set(pos.toString(), bomb); // TODO: Same object (new Bomb()) for different lists O_O
          //bombs.set(pos.toString(), bomb);      // TODO: Same object (new Bomb()) for different lists O_O

          broadcast("bombPlanted", bomb);
        }
        break;
    }

  }

  bombExploded(hittenCells) {
    var pos = [int(this.center_x / cellSize), int(this.center_y / cellSize)];
    if (hittenCells.has(pos.toString())) this.die();

    for(var [k,cel] of hittenCells){
      if (this.bombs.has(k)) this.bombs.delete(k);
    }

  }
  die() {
    this.dead   = true;
    this.curImgKey = "DEAD";
  }

  hasStone(dir) {
    switch (dir) {
      case "RIGHT":
        for (var [k, stone] of stones) {
          if (int(this.center_y / cellSize) == stone.row) {
            var dif = abs(this.center_x - (stone.col * cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;

      case "LEFT":
        for (var [k, stone] of stones) {
          if (int(this.center_y / cellSize) == stone.row) {
            var dif = abs(this.center_x - (stone.col * cellSize + cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;

      case "UP":
        for (var [k, stone] of stones) {
          if (int(this.center_x / cellSize) == stone.col) {
            var dif = abs(this.center_y - (stone.row * cellSize + cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;

      case "DOWN":
        for (var [k, stone] of stones) {
          if (int(this.center_x / cellSize) == stone.col) {
            var dif = abs(this.center_y - (stone.row * cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;
    }
  }
  hasCrate(dir) {
    switch (dir) {
      case "RIGHT":
        for (var [k, crate] of crates) {
          if (int(this.center_y / cellSize) == crate.row) {
            var dif = abs(this.center_x - (crate.col * cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;

      case "LEFT":
        for (var [k, crate] of crates) {
          if (int(this.center_y / cellSize) == crate.row) {
            var dif = abs(this.center_x - (crate.col * cellSize + cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;

      case "UP":
        for (var [k, crate] of crates) {
          if (int(this.center_x / cellSize) == crate.col) {
            var dif = abs(this.center_y - (crate.row * cellSize + cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;

      case "DOWN":
        for (var [k, crate] of crates) {
          if (int(this.center_x / cellSize) == crate.col) {
            var dif = abs(this.center_y - (crate.row * cellSize))
            if (dif <= this.r) {
              return true;
            }
          }
        }
        return false;
    }
  }
  hasBomb(dir) {
    var offSet;

    switch(dir){
      case "RIGHT":
        offSet = [1,0];
        break
      case "LEFT":
        offSet = [-1,0];
        break
      case "UP":
        offSet = [0,-1];
        break
      case "DOWN":
        offSet = [0,1];
        break
    }

    var nextPos = [ int(this.center_x/cellSize) + offSet[0], int(this.center_y/cellSize) + offSet[1] ];
    if(bombs.has(nextPos.toString())) return true;

    return false;
  }
  hasPowerup() {
    var pos = [int(this.center_x / cellSize), int(this.center_y / cellSize)];
    if (powerups.has(pos.toString())) {
      var pup     = powerups.get(pos.toString());
      //var pup_pos = [pup.col * cellSize + cellSize / 2, pup.row * cellSize + cellSize / 2];
      //var dist    = sqrt(pow(this.center_x - pup_pos[0], 2) + pow(this.center_y - pup_pos[1], 2));

      //if (dist <= (this.r + pup.r)) {
        broadcast("pupPicked", pup);

        switch (pup.which) {
          case 0:
            if (this.powers[0] < cellSize)
              this.powers[0] += cellSize*0.1;
            break;
          case 1:
            this.powers[1] += 1; // Range increase one cell
            break;
          case 2:               // This player can plant one more bomb
            this.powers[2] += 1;
            break;
        //}
      }
    }
  }
}
