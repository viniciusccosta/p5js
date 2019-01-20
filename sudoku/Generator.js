class Generator {
  constructor() {
    this.map = new Array(9);
    for (let i = 0; i < 9; i++) {
      this.map[i] = new Array(9).fill(0);
    }
  }

  getMap() {
    /* It's gonna generate a random table everything called. */
    this.generate(0, 0);
    return this.map;
  }
  generate(row, col) {
    // RECURSIVE:
    let possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let triedValues = new Set();

    // -------------------------------------------------
    while (triedValues.size < possibleValues.length) {
      let rnd = random(possibleValues);

      // Valid value:
      if (!triedValues.has(rnd)) {
        triedValues.add(rnd);

        if (this.isValidValue(row, col, rnd)) {
          this.map[row][col] = rnd; // TODO: Is this the right place?

          let neighbor = this.getNeighbor(row, col);

          // Reached end of the table:
          if (neighbor == null) {
            return true;
          } else {
            let endOfTable = this.generate(neighbor[0], neighbor[1]);

            if (endOfTable) {
              return true; // End of table, tell recursion stack that we're done.
            } else {
              this.map[neighbor[0]][neighbor[1]] = 0;
              /*
                My neighbor tried all values and none of them can be used,
                so, we should try another value and call him again.
                To do so, the only thing that we have to do it's make sure that our neighbor's value is empty,
                because we're inside this while loop that we're going to try another values!
              */
            }

          } // else neighbor == null

        } // valid neightbor
      } // tried neightbor
    } // while
    // -------------------------------------------------

    return false;
  }
  getNeighbor(row, col) {
    let neighbor = [];

    neighbor[0] = row;
    neighbor[1] = col + 1;

    // End of row:
    if (neighbor[1] >= cols) {
      neighbor[0] = row + 1;
      neighbor[1] = 0;
    }

    // End of table:
    if (neighbor[0] >= rows) {
      neighbor = null;
    }

    return neighbor;
  }
  isValidValue(row, col, value) {
    // TODO: We don't have to look the entire table, only: entire row, entire col and box.
    let myBoxRow = int(row / 3);
    let myBoxCol = int(col / 3);

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let boxrow = int(i / 3);
        let boxcol = int(j / 3);

        if (row == i || col == j || (myBoxRow == boxrow && myBoxCol == boxcol)) {
          if (this.map[i][j] == value) {
            return false;
          }
        }

      }
    }

    return true;
  }
}
