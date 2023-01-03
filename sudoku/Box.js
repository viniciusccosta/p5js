class Box {
  constructor(index){
    this.index = index;
    this.row   = int(index / 3);  // Ex: 5 (row = 1, col = 2) --> 5 // 3 = 1
    this.col   = index % 3;       // Ex: 5 (row = 1, col = 2) --> 5 % 3  = 2

    this.cells = [];
    for(let i = 0; i < 3; i++){
      this.cells[i] = [null,null,null];
    }
  }
  update(){
    for(let row = 0; row < 3; row++){
      for(let col = 0; col < 3; col++){
        this.cells[row][col].update();
      }
    }
  }
  show(){
    push();
    for(let row = 0; row < 3; row++){
      for(let col = 0; col < 3; col++){
        this.cells[row][col].show();
      }
    }
    pop();

    push();
    fill(255, 0);
    strokeWeight(4);
    rect(this.col * 3 * cellWidth + 1, this.row * 3 * cellHeight + 1, 3 * cellWidth - 1, 3 * cellHeight - 1);
    pop();
  }

  addCell(cell){
    for(let row = 0; row < 3; row++){
      for(let col = 0; col < 3; col++){
        if(this.cells[row][col] == null){
          this.cells[row][col] = cell;
          return;
        }
      }
    }
  }
  fillRandomly(){
    let possibleValues = [1,2,3,4,5,6,7,8,9];
    let alreadyPicked  = new Set();

    for(let row = 0; row < 3; row++){
      for (let col = 0; col < 3; col++){

        let value = random(possibleValues);
        while(alreadyPicked.has(value)){
          value = random(possibleValues);
        }

        alreadyPicked.add(value);
        this.cells[row][col].value = value;
      }
    }

  }
}
