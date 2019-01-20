const cols = 9;
const rows = 9;

let h;
let w;

let curCell;
let boxes;
let difficult = 50;
let diffs = new Map();

function setup() {
  // ---------------------------------------------
  // Canvas:
  cellHeight = (windowHeight / rows) * 0.8;
  cellWidth = cellHeight; // ( windowWidth  / cols ) * 0.8; // make it square!
  createCanvas(cellWidth * cols + 1, cellHeight * rows + 1);
  noLoop(); // We don't have to draw if the user didn't interect

  // ---------------------------------------------
  // Difficult:
  diffs.set("easy",   50);  // 50
  diffs.set("hard",   26);  // 26
  diffs.set("expert", 17);  // 17

  let radio = createRadio("RADIO BUTTON");
  for (let [k, diff] of diffs) {
    radio.option(k);
  }

  let btn = createButton("change");
  btn.mousePressed(function() {
    changeDifficult(radio);
  });

  let btn2 = createButton("FINISH");
  btn2.mousePressed(function() {
    finish();
  });

  // ---------------------------------------------
  // Start Game:
  resetGame();
}

function resetGame() {
  curCell = null;
  boxes = null;
  generateGrid();
}

function draw() {
  for (let box of boxes) {
    box.update();
    box.show();
  }
}

function mousePressed() {
  // If user clicked out of canvas:
  let insideCanvas = true;
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
    insideCanvas = false;
  }

  let col = int(mouseX / cellWidth);
  let row = int(mouseY / cellHeight);

  for (let box of boxes) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        let cel = box.cells[i][j];

        if (insideCanvas && cel.col == col && cel.row == row) {
          curCell = cel;

          if (mouseButton == LEFT) {
            cel.writing = !cel.writing;
            cel.commenting = false;
          } else if (mouseButton == RIGHT) {
            cel.writing = false;
            cel.commenting = !cel.commenting;
          }
        } else {
          cel.writing = false;
          cel.commenting = false;
        }
      }
    }
  }

  redraw();
  return false;
}

function keyPressed() {
  // TODO: Use the keyboard to change "selected" cell

  if (curCell) {
    if (key >= 1 && key <= 9) {
      curCell.change(key.toString());
    } else {
      switch (keyCode) {
        case 8:
          curCell.clear(); // Backspace/Delete key
          break;
        case LEFT_ARROW:
          break;
        case RIGHT_ARROW:
          break;
        case UP_ARROW:
          break;
        case DOWN_ARROW:
          break;
      }
    }
  }

  redraw();
  return false;
}

function generateGrid() {
  // Generator:
  let gen = new Generator();
  let map = gen.getMap();

  // Boxes:
  boxes = [];
  for (let i = 0; i < 9; i++) boxes.push(new Box(i)); // [Box0, Box1, Box2, Box3,..., Box8]

  // Cells:
  for (row = 0; row < rows; row++) {
    for (col = 0; col < cols; col++) {
      let cell = new Cell(col, row, true, map[row][col])

      let boxrow = int(row / 3);
      let boxcol = int(col / 3);
      let indexBox = boxrow * 3 + boxcol; // | 0 -> 1 -> 2 | 3 -> 4 -> 5 | 6 -> 7 -> 8 |

      boxes[indexBox].addCell(cell);
    }
  }

  // Sudoku it!
  let nonFixedCells = new Set();

  while (nonFixedCells.size < 81 - difficult) {
    let rnd = round(random(0, 80));

    if (!nonFixedCells.has(rnd)) {
      nonFixedCells.add(rnd);

      // Index from all cells to "internal index" of a specific box
      let row = int(rnd / 9);
      let col = rnd % 9;

      let boxrow = int(row / 3);
      let boxcol = int(col / 3);

      let indexBox = boxrow * 3 + boxcol;
      let box = boxes[indexBox];

      let colInsideBox = col % 3;
      let rowInsideBox = row % 3;
      let cell = box.cells[rowInsideBox][colInsideBox];

      cell.fixed = false;
      cell.value = 0;
    }
  }
}

function changeDifficult(radio) {
  difficult = diffs.get(radio.value());
  resetGame();
}

function finish() {
  // TODO: !!! OPTIMIZE !!!

  // ---------------------------------------------
  // POO to Matrix:
  let map = new Array(9);
  for (let row = 0; row < 9; row++) {
    map[row] = new Array(9).fill(0);
  }

  for (let box of boxes) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let cell = box.cells[row][col];
        if (cell.value == 0) return;            // If there's an empty cell do nothing

        map[cell.row][cell.col] = cell.value;
      }
    }
  }

  // ---------------------------------------------
  for(let row = 0; row < 9; row++){
    for(let col = 0; col < 9; col++){

      // Row:
      for(let offset = 1; offset < 9; offset++){
        let neighrow = row + offset;
        if(neighrow < 9){
          if(map[row][col] == map[neighrow][col] && map[row][col] > 0){
            print("SAME COL", row, col, neighrow, col);
          }
        }
      }

      // Col:
      for(let offset = 1; offset < 9; offset++){
        let neighcol = col + offset;
        if(neighcol < 9){
          if(map[row][col] == map[row][neighcol] && map[row][col] > 0){
            print("SAME ROW", row, col, row, neighcol);
          }
        }
      }

      // Box:
      let boxrow = int(row / 3);
      let boxcol = int(col / 3);
      let neighrow = boxrow * 3;
      let neighcol = boxcol * 3;

      for(let rowoff = 0; rowoff < 3; rowoff++){
        for(let coloff = 0; coloff < 3; coloff++){
          if( (neighrow + rowoff) == row && (neighcol + coloff) == col){
            continue; // We don't want to compare to ourselves
          }

          if(map[row][col] == map[(neighrow + rowoff)][(neighcol + coloff)] && map[row][col] > 0){
            print("SAME BOX", row, col, (neighrow + rowoff), (neighcol + coloff) );
          }
        }
      }

    }
  }

  // ---------------------------------------------
}

// TODO: When there's a conflict, we should highlight those Cells
// TODO: "dehighlight" a cell when user click on it.
