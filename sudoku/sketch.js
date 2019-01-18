const cols = 9;
const rows = 9;
let h;
let w;
let cells
let curCell;
let data;

function preload() {
  data = loadJSON('maps.json'); // TODO: Is this the best way?
	// How to generate a random map ?
}
function setup() {
  cellHeight = (windowHeight / rows) * 0.8;
  cellWidth = cellHeight; //( windowWidth  / cols ) * 0.8; // make it square!
  createCanvas(cellWidth * cols + 1, cellHeight * rows + 1);

  loadMap("easy"); // TODO: User choose which difficult
}
function draw() {

  for (let cel of cells) {
    cel.update();
    cel.show();
  }

  // Borders:
  push();
  fill(255, 0);
  strokeWeight(4);
  for (let row = 0; row < rows; row += 3) {
    for (let col = 0; col < cols; col += 3) {
      rect(row * cellWidth + 1, col * cellHeight + 1, 3 * cellWidth - 1, 3 * cellHeight - 1);
    }
  }
  pop();
}

function mousePressed() {
  // If user clicked out of canvas:
  let insideCanvas = true;
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
    insideCanvas = false;
  }

  let col = int(mouseX / cellWidth);
  let row = int(mouseY / cellHeight);

  for (let cel of cells) {
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

  return false;
}
function keyPressed() {
  if (curCell) {
    if (key >= 1 && key <= 9) {
      curCell.change(key.toString());
    } else if (keyCode == 8) {
      curCell.clear();
    }
  }

  return false;
}

function loadMap(difficult) {
  cells = [];
  let maps = data[difficult];
  let map = maps["1"]; // TODO: Choose a random map from this difficult

  for (row = 0; row < rows; row++) {
    for (col = 0; col < cols; col++) {
      let key = [col, row].toString();
      cells.push(new Cell(col, row, map[key]["fixed"], map[key]["value"]));
    }
  }

}

// TODO: Cells should be just an 2D matrix? Why POO? kkkkkk
// TODO: Class "BIG AREA" ?
