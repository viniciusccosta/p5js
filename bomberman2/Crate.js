class Crate{
  constructor(x,y,indImg){
    this.body = Bodies.rectangle(x, y, cellSize, cellSize, {isStatic: true} );
    this.body.collisionFilter.group    = 0;
    this.body.collisionFilter.category = 256;
    this.body.collisionFilter.mask     = 1+2+4+8+256+512;

    this.indImg = indImg;
  }
  show(){
    push();

    let img    = crateImg[this.indImg];
    let x      = this.body.position.x;
    let y      = this.body.position.y;
    let width  = ( (cellSize*0.9)/img.width )  * img.width;
    let height = ( (cellSize*0.9)/img.height ) * img.height;
    image(img,x,y,width,height);

    pop();
  }
}
