class Cell{
  constructor(col, row, fixed, value){
    this.col   = col;
    this.row   = row;
    this.fixed = fixed;
    this.value = value;

    this.writing    = false;
    this.commenting = false;
    this.comments   = null;
  }
  show(){
    push();
    rectMode(CENTER); // TODO: Should not be here for each iteration

    let x = this.col*cellWidth  + cellWidth/2;
    let y = this.row*cellHeight + cellHeight/2;

    // Category:
    if(this.fixed){
      fill(200, 200, 200);
      rect(x, y, cellWidth, cellHeight)
    }else if(this.writing){
      fill(100, 200, 100);
      rect(x, y, cellWidth, cellHeight)
    }else if(this.commenting){
      fill(50, 100, 200);
      rect(x, y, cellWidth, cellHeight)
    }else{
      fill(240);
      rect(x, y, cellWidth, cellHeight)
    }

    // Text:
    if(this.value != null && this.value != 0){
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(32);   // TODO: Hardcode size?
      text(this.value, x, y);
    } else if(this.comments != null){
      // TODO: Limit 6 chars per line inside cell (1 2 3 \n4 5 6\n 7 8 9)
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(15); // TODO: Hardcode size?
      text(Array.from(this.comments.values()).sort().join(" "), x, y + 1, cellWidth*0.75, cellHeight); // TODO: Sort every frame? TODO: cellWidth*0.75?
    }

    pop();
  }

  update(){
    if(this.commenting && this.value != null){
      this.value    = null;
    }else if(this.writing && this.comments != null){
      this.comments = null;
    }
  }
  change(v){
    if(this.writing)         this.write(v)
    else if(this.commenting) this.comment(v)
  }

  write(v){
    this.value = v;
  }
  comment(v){
    if(this.comments == null) this.comments = new Set();

    this.comments.add(v);
  }
  clear(){
    this.value    = null;
    this.comments = null;
  }
}
