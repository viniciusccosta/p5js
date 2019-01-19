const cols = 9;
const rows = 9;
let h;
let w;
let curCell;
let boxes;

function setup() {
  cellHeight = (windowHeight / rows) * 0.8;
  cellWidth  = cellHeight; //( windowWidth  / cols ) * 0.8; // make it square!
  createCanvas(cellWidth * cols + 1, cellHeight * rows + 1);

	generateGrid();
	noLoop(); // We don't have to draw if the user didn't interect
}
function draw() {
	for(let box of boxes){
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

  let col  	   = int(mouseX /  cellWidth);
  let row  	   = int(mouseY / cellHeight);

  for (let box of boxes) {
		for(var i = 0; i < 3; i++){
			for(var j = 0; j < 3; j++){
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
    } else{
				switch(keyCode){
					case 8:
						curCell.clear(); 									// Backspace/Delete key
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

function generateGrid(){
	// Boxes:
	boxes = [];
	for(let i = 0; i < 9; i++) boxes.push( new Box(i) ); 	// [Box0, Box1, Box2, Box3,..., Box8]

	// Cells:
	for (row = 0; row < rows; row++) {
    for (col = 0; col < cols; col++) {
			let cell = new Cell(col, row, false, 0)

			let boxrow   = int(row / 3);
			let boxcol   = int(col / 3);
			let indexBox = boxrow * 3 + boxcol; 							// | 0 -> 1 -> 2 | 3 -> 4 -> 5 | 6 -> 7 -> 8 |

			boxes[indexBox].addCell(cell);
    }
  }

	 // Values:
	 boxes[0].fillRandomly();
	 boxes[4].fillRandomly();
	 boxes[8].fillRandomly();
}

// TODO: Cells should be just an 2D matrix (it would make it alot easier HAHA)
