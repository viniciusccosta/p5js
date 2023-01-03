class Border {
  constructor(x,y){
    this.body = Bodies.rectangle(x, y, cellSize, cellSize, {isStatic: true});
    this.body.collisionFilter.group    = 0;
    this.body.collisionFilter.category = 512;
    this.body.collisionFilter.mask     = 1+2+4+8+16+32+64+128+256+512;
  }
  show(){
    push();
    let x      = this.body.position.x;
    let y      = this.body.position.y;

    let img    = borderImg;
    let width  = ( (cellSize*0.9)/img.width )  * img.width;
    let height = ( (cellSize*0.9)/img.height ) * img.height;
    image(img,x,y,width,height);
    pop();
  }
}
