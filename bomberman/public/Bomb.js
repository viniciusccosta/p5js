class Bomb {
  constructor(col, row, range, endMillis) {
    this.col = col;
    this.row = row;
    this.range = range == null ? 1 : range;
    this.endMillis = endMillis == null ? new Date().getTime() + 3000 : endMillis; // When bomb have to explode.

    this.exploded = false;
    this.color = [0, 0, 0];

    this.r = cellSize * 0.70;
    this.hittenCells = new Map();

    this.explosionStarted = false;
    this.explosionFinished = false;
    this.expAlpha = 255;            // How transparent will become the explosion
  }
  show() {
    if (!this.exploded) {
      push();
      imageMode(CENTER);
      tint(this.color[0], this.color[1], this.color[2]);
      image(
        bombImg,
        this.col*cellSize + cellSize/2,
        this.row*cellSize + cellSize/2,
        ((this.r) / bombImg.width)  * bombImg.width,
        ((this.r) / bombImg.height) * bombImg.height
      );
      //fill(this.color[0], this.color[1], this.color[2], 200);
      //ellipse((this.col * cellSize) + cellSize / 2, (this.row * cellSize) + cellSize / 2, this.r);
      pop();
    }

    else if (this.explosionStarted) {
      push();
      noStroke();
      fill(255, 0, 0, this.expAlpha);
      for (var [k, cel] of this.hittenCells) {
        rect(cel[0] * cellSize, cel[1] * cellSize, cellSize, cellSize);
      }
      imageMode(CENTER);
      tint(255, this.expAlpha); // Apply transparancy without changing color
      image(
        explImg,
        this.col*cellSize + cellSize/2,
        this.row*cellSize + cellSize/2,
        (cellSize / explImg.width)  * explImg.width,
        (cellSize / explImg.height) * explImg.height
      );
      pop();
    }
  }
  update() {
    // Bomb Size:
    this.r += 0.2; // Increasing size

    // Bomb Color:
    this.color[0] += 3.8; // 256 valores / (25 frames * 3 segundos)

    // Bomb Time:
    if (now > this.endMillis) {
      this.explode();
    }

    // Explosion Time:
    if (this.explosionStarted) {
      if (this.expAlpha <= 1) {
        this.explosionFinished = true;
      } else {
        this.expAlpha -= 15; // x = (256 valores) / (25 frames * 3 segundos)
      }
    }
  }

  explode() {
    // TODO: Sometimes the bomb doesn't stop at a crate
    this.exploded = true;
    var itmsDstyd;

    // Where the bomb is:
    this.hittenCells.set([this.col, this.row].toString(), [this.col, this.row]);

    // Down:
    itmsDstyd = 0;
    for (var offset = 1; offset <= this.range; offset++) {
      var neigh = [this.col, this.row + offset];

      if (neigh[0] >= 0 && neigh[0] < qtdCols && neigh[1] >= 0 && neigh[1] < qtdRows) {
        if (stones.has(neigh.toString()) || itmsDstyd > 0) break;
        else this.hittenCells.set([neigh[0], neigh[1]].toString(), neigh);

        if (crates.has(neigh.toString())) itmsDstyd++;
        if (powerups.has(neigh.toString())) itmsDstyd++;
        if (bombs.has(neigh.toString())) {
          if (!bombs.get(neigh.toString()).exploded) {
            bombs.get(neigh.toString()).explode(); // When a Bomb explode, it explodes others bombs nearby
          }
        }
      }
    }

    // Right:
    itmsDstyd = 0;
    for (var offset = 1; offset <= this.range; offset++) {
      var neigh = [this.col + offset, this.row];

      if (neigh[0] >= 0 && neigh[0] < qtdCols && neigh[1] >= 0 && neigh[1] < qtdRows) {
        if (stones.has(neigh.toString()) || itmsDstyd > 0) break;
        else this.hittenCells.set([neigh[0], neigh[1]].toString(), neigh);

        if (crates.has(neigh.toString())) itmsDstyd++;
        if (powerups.has(neigh.toString())) itmsDstyd++;
        if (bombs.has(neigh.toString())) {
          if (!bombs.get(neigh.toString()).exploded) {
            bombs.get(neigh.toString()).explode(); // When a Bomb explode, it explodes others bombs nearby
          }
        }
      }
    }

    // Up:
    itmsDstyd = 0;
    for (var offset = 1; offset <= this.range; offset++) {
      var neigh = [this.col, this.row - offset];

      if (neigh[0] >= 0 && neigh[0] < qtdCols && neigh[1] >= 0 && neigh[1] < qtdRows) {
        if (stones.has(neigh.toString()) || itmsDstyd > 0) break;
        else this.hittenCells.set([neigh[0], neigh[1]].toString(), neigh);

        if (crates.has(neigh.toString())) itmsDstyd++;
        if (powerups.has(neigh.toString())) itmsDstyd++;
        if ([this.col, this.row].toString != neigh.toString() && bombs.has(neigh.toString())) {
          if (!bombs.get(neigh.toString()).exploded) {
            bombs.get(neigh.toString()).explode(); // When a Bomb explode, it explodes others bombs nearby
          }
        }
      }
    }

    // Left:
    itmsDstyd = 0;
    for (var offset = 1; offset <= this.range; offset++) {
      var neigh = [this.col - offset, this.row];

      if (neigh[0] >= 0 && neigh[0] < qtdCols && neigh[1] >= 0 && neigh[1] < qtdRows) {
        if (stones.has(neigh.toString()) || itmsDstyd > 0) break;
        else this.hittenCells.set([neigh[0], neigh[1]].toString(), neigh);

        if (crates.has(neigh.toString())) itmsDstyd++;
        if (powerups.has(neigh.toString())) itmsDstyd++;
        if (bombs.has(neigh.toString())) {
          if (!bombs.get(neigh.toString()).exploded) {
            bombs.get(neigh.toString()).explode(); // When a Bomb explode, it explodes others bombs nearby
          }
        }
      }
    }
  }
  startExplosion() {
    expSound.play();
    this.expTimeStart = millis();
    this.explosionStarted = true;
  }
}
