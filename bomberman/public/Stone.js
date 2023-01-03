class Stone {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }
  show() {
    push();
    fill(75);
    image(
      stoneImg,
      this.col*cellSize,
      this.row*cellSize,
      (cellSize / stoneImg.width) * stoneImg.width,
      (cellSize / stoneImg.height) * stoneImg.height
    );
    pop();
  }
}
