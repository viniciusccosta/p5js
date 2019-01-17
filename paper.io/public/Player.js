class Player {
  constructor(row, col, id, color, imgIndex, island, tail) {
    // Unique ID:
    this.id = id;

    // Position:
    this.row = row; // Axis Y
    this.col = col; // Axis X

    // Pyshics:
    this.hSpeed = 0;
    this.vSpeed = 0;

    // Features:
    this.dead = false;

    this.color = [random(25, 250), random(15, 150), random(20, 200)];
    if (color != null) this.color = color;

    this.imgIndex = int(random(0, imgs.length)); // Needed to broadcast
    if (imgIndex != null) this.imgIndex = imgIndex;

    this.img = loadImage(imgs[this.imgIndex]);


    // Score:
    this.island = new MyMap();
    if (island == null) {
      for (var rowOff = -1; rowOff <= 1; rowOff++) {
        for (var colOff = -1; colOff <= 1; colOff++) {
          if (this.col + colOff >= -limit && this.col + colOff < limit && this.row + rowOff >= -limit && this.row + rowOff < limit) {
            var pos = [this.col + colOff, this.row + rowOff];
            this.island.add(pos);
          }
        }
      }
    } else {
      this.island = island;
    }

    this.tail = (tail == null) ? new MyMap() : tail;

    this.margin = {
      upperLeft: 0,
      bottomRight: 0
    }; // The initial values don't matter
  }
  show() {
    push();
    noStroke();

    // Island:
    fill(this.color[0], this.color[1], this.color[2], 225);
    for (var [key, position] of this.island) {
      rect(position[0] * cellSize, position[1] * cellSize, cellSize, cellSize, 4);
    }

    // Tail:
    fill(this.color[0], this.color[1], this.color[2], 75);
    for (var [key, position] of this.tail) {
      if (!(position[0] == this.col && position[1] == this.row)) { // Not drawing ourselves
        rect(position[0] * cellSize, position[1] * cellSize, cellSize, cellSize, 8);
      }
    }

    pop();
  }
  showPlayer() {
    push();
    // Player:
    var x = int((this.col * cellSize) / cellSize) * cellSize;
    var y = int((this.row * cellSize) / cellSize) * cellSize;

    image(this.img, x, y, (cellSize / this.img.width) * this.img.width, (cellSize / this.img.height) * this.img.height);
    pop();
  }
  update() {
    if (!this.dead) {
      if (cnt == 0) {
        // Position:
        if (!((round(this.row) <= -limit && this.vSpeed < 0) || (round(this.row) >= limit - 1 && this.vSpeed > 0))) {
          this.row = (this.row + this.vSpeed);
        } else {
          this.vSpeed = 0;
        }

        if (!((round(this.col) <= -limit && this.hSpeed < 0) || (round(this.col) >= limit - 1 && this.hSpeed > 0))) {
          this.col = (this.col + this.hSpeed);
        } else {
          this.hSpeed = 0;
        }

        // Tail:
        var pos = [this.col, this.row] // Current position

        // Leaving the island
        if (!this.island.has(pos.toString())) { // Leaving the island
          // First step out of the island |  Still the same place that we were last time we checked | Did we just hit the tail ?
          if (this.tail.size > 0 && pos.toString() != this.tail.last.toString() && this.tail.has(pos.toString())) {
            this.die();
          } else {
            this.tail.add(pos);
          }
        }

        // Returned to island or still inside the island:
        else if (this.tail.size > 0) {
          for (var [key, val] of this.tail) {
            this.island.add(val);
          }

          // Creating Margin to FloodFill:
          // Sorted by Column:
          var posicoes = Array.from(this.island.values()).sort(function comparar(a, b) {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0; // If we got here, it's because a[0]=b[0] and a[1]=b[0].
          });
          var lowerCol = posicoes[0][0];
          var greaterCol = posicoes[posicoes.length - 1][0]

          // Sorted by Row:
          var posicoes = posicoes.sort(function comparar(a, b) {
            if (a[1] < b[1]) return -1;
            if (a[1] > b[1]) return 1;
            return 0; // If we got here, it's because a[0]=b[0] and a[1]=b[0].
          });
          var lowerRow = posicoes[0][1];
          var greaterRow = posicoes[posicoes.length - 1][1];

          this.margin = {
            upperLeft: [lowerCol, lowerRow],
            bottomRight: [greaterCol, greaterRow]
          };
          this.floodFill();

          // Reset tail:
          this.tail = new MyMap();
        }
      }
    }
  }
  move(dir) {
    switch (dir) {
      case UP_ARROW:
        this.hSpeed = 0;
        if (this.vSpeed > -1) this.vSpeed -= 1;
        break;
      case DOWN_ARROW:
        this.hSpeed = 0;
        if (this.vSpeed < 1) this.vSpeed += 1;
        break;
      case LEFT_ARROW:
        if (this.hSpeed > -1) this.hSpeed -= 1;
        this.vSpeed = 0;
        break;
      case RIGHT_ARROW:
        if (this.hSpeed < 1) this.hSpeed += 1;
        this.vSpeed = 0;
        break;
      default:
        break;
    }
  }
  die() {
    this.dead = true;
    socket.disconnect();
  }
  floodFill() {
    var outsiders = new MyMap(); // Neighbors within margin but that we are not going to add to the island

    var pilha = [];
    pilha.push([this.margin.upperLeft[0] - 1, this.margin.upperLeft[1] - 1]);

    // Finding outsiders:
    while (pilha.length > 0) {
      var col;
      var row;
      [col, row] = pilha.pop();
      col = int(col);
      row = int(row);

      // Left and Right Neighbors:
      for (var rowOff = -1; rowOff <= 1; rowOff++) {
        for (var colOff = -1; colOff <= 1; colOff++) {
          if (rowOff == 0 && colOff == 0) continue; // We don't wanna check ourselves

          var neigh = [int(col) + colOff, int(row) + rowOff];
          // Neighbor that's it's not in the island and we didn't visited yet:
          if (!this.island.has(neigh.toString()) && !outsiders.has(neigh.toString())) {
            // It's within the margin:
            if (neigh[0] >= this.margin.upperLeft[0] - 1 && neigh[1] >= this.margin.upperLeft[1] - 1 && neigh[0] <= this.margin.bottomRight[0] + 1 && neigh[1] <= this.margin.bottomRight[1] + 1) {
              pilha.push(neigh);
              outsiders.add(neigh);
            }
          }
        }
      }
    } // while (pilha.length > 0)

    // Adding every cell that we not visited to the island:
    var newArea = Array.from(this.tail.values());

    for (var col = this.margin.upperLeft[0]; col <= this.margin.bottomRight[0]; col++) {
      for (var row = this.margin.upperLeft[1]; row <= this.margin.bottomRight[1]; row++) {
        var neigh = [int(col), int(row)];

        // If it's not an outside and it's not in the island:
        if (!this.island.has(neigh.toString()) && !outsiders.has(neigh.toString())) {
          this.island.add([col, row]);
          newArea.push([col, row]);
        }
      }
    }
    socket.emit("conquered", newArea);

  }
}
