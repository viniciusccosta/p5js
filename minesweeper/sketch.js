cellSize  = 40;
qtdRows   = 20; // 20
qtdCols   = 40; // 40
cells 	  = null;
bombs     = null;
ended 	  = null;
cnt 		  = 0;
qtdMarked = 0;

function setup() {
  //a = createElement("text","ARÔ");
	createCanvas(cellSize*qtdCols+1, cellSize*qtdRows+1);
  frameRate(10);
  cnt 		  = qtdCols*qtdRows;
  qtdMarked = 0;
  cells 	  = [];
	bombs     = [];
  ended 	  = false;
    
  // ----------------------------------------
  // Creating cells:
  for (var row = 0; row < qtdRows; row++){
		for (var col = 0; col < qtdCols; col++){
      	cell = new Cell(row,col, 0);      
      	cells.push(cell);
		}
  }
  
  // ----------------------------------------
  // Generating bombs:
  maxBombs  	 = 1;//floor(qtdRows*qtdCols * 0.15); // Maximum amount of bombs
  bombsIndexes = new Set();
	
  // Enquanto não tivermos "maxBombs" valores, iremos gerar numeros aleatorios
  while(bombsIndexes.size < maxBombs){
    valor = int(random(0,qtdRows*qtdCols));
  	bombsIndexes.add( valor );
  }
    
  for(let index of bombsIndexes){
		bomb = cells[index];
    bomb.value = -1;
    bombs.push(bomb);
  }
  
  // ----------------------------------------
  // Calculating cells values:
  for (var i = 0; i < bombs.length; i++){
    bomb = bombs[i];
    bomb.value = -1;
    
    for (var offRow = -1; offRow <= 1; offRow++){
      for(var offCol = -1; offCol <= 1; offCol++){

        // We don't wanna check ourselves:	
        if(offRow != 0 || offCol != 0){

          neighRow = bomb.row + offRow;
          neighCol = bomb.col + offCol;
          
          if(neighRow >= 0 && neighRow < qtdRows && neighCol >= 0 && neighCol < qtdCols){
            index    = index2DToIndex1D(neighRow, neighCol);
            neighbor = cells[index];

            // Only if it's not a bomb:
            if (neighbor.value >= 0){
              neighbor.value++;
            }
            
          } // valid neighbor
        } // not myself
      } // for offCol
    } // for offRow
	} // for bombs
  
  // ----------------------------------------
  print("Quantidade de bombas:", bombs.length);
  document.getElementById("divqtdbombs").innerHTML = String(bombs.length + " bombas<br>Faltam: " + cnt + " celulas <br>");
  
  // ----------------------------------------
}
function draw() {
  background(240);
	// GRID:
	for (var row = 0; row < qtdRows; row++){
		for (var col = 0; col < qtdCols; col++){
      // Background:
			strokeWeight(1);
			fill(245);
			rect(col*cellSize,row*cellSize,cellSize,cellSize,3);
		}
	}
  
  for (var i = 0; i < cells.length; i++){
  	cells[i].show();
  }
  
  if (cnt == 0){
    if(ended){
			fill(255,0,255);
  		textSize(45);
    	textAlign(CENTER, CENTER);
    	text("YOU\nLOSE",width/2,height/2);
    }else{
			fill(255,0,255);
  		textSize(45);
    	textAlign(CENTER, CENTER);
    	text("YOU\nWIN",width/2,height/2);
    }

    noLoop();
  }
  
}
function mousePressed(){
  if (mouseY < height && mouseX < width && mouseX > 0 && mouseY > 0){
    
    [row,col] = pixelToIndex(mouseY, mouseX);
    index 		= index2DToIndex1D(row,col);
    cell 			= cells[index];
    
    if (mouseButton == LEFT && !cell.marked){
      if (cell.hidden == true){
        cell.reveal();
        cnt--;
      }

      if (cell.value < 0){
        ended = true;
        cell.explode();
        for (var i = 0; i < cells.length; i++){
          cells[i].reveal();
        }
      }else if(cell.value == 0){
        floodFill(row, col);
      }
    }
    else if(mouseButton == RIGHT){
      if(qtdMarked < maxBombs){
        if (cell.marked) {
          cnt++;
        }
        else {
          cnt--; 
        }
	
        // TODO: 
        
        cell.mark();
        qtdMarked++;
      }
    }
  }
  
  document.getElementById("divqtdbombs").innerHTML = String(bombs.length + " bombas<br>Faltam: " + cnt + " celulas <br>");
  return false;
}

function gameOver(){
	setup();
}
function floodFill(row, col){
	pilha = [];
  pilha.push( [row,col] );
  
  while (pilha.length > 0 ){
    [cur_row, cur_col] = pilha.pop();
    
    for (var offRow = -1; offRow <= 1; offRow++){
      for(var offCol = -1; offCol <= 1; offCol++){

        // We don't wanna check ourselves:	
        if(offRow != 0 || offCol != 0){
          var neighRow = cur_row + offRow;
          var neighCol = cur_col + offCol;

          if(neighRow >= 0 && neighRow < qtdRows && neighCol >= 0 && neighCol < qtdCols){
            var index    = index2DToIndex1D(neighRow, neighCol);
            var neighbor = cells[index];

            // Only if it's not a bomb:
            if (neighbor.value >= 0 && neighbor.hidden == true){
              neighbor.reveal();
              cnt--;
              if (neighbor.value == 0){
              	pilha.push( [neighbor.row, neighbor.col] );
              }
            } // Vizinho ainda não visitado
          } // Vizinho válido
        } // Não sou eu mesmo
      } // for offCol
    } // for offRow
 }// while
  
}

function index1DToIndex2D(index){
	// Convert "index", of an array, to "row,col", of a matrix.
  col = index % qtdCols; 			 // "qtdCols" if you made "for row, for col" when added to array
  row = floor(index/qtdCols);	// "qtdCols" if you made "for row, for col" when added to array
}
function index2DToIndex1D(row,col){
  // Convert "row,col", of a matrix, to "index", of an array.
  index = row*qtdCols + col;
  return index;
}
function pixelToIndex(rowP, colP){
  row = floor( (rowP) / cellSize );
  col = floor( (colP) / cellSize );
  
  return [row,col];
}
function indexToPixel(row, col, center){
  if (center){
    rowP = row*cellSize + cellSize/2;
    colP = col*cellSize + cellSize/2;
  }else{
      rowP = row*cellSize;
    	colP = col*cellSize;
  }

	return [rowP,colP];
}