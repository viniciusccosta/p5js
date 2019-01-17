class PowerUp{
  constructor(x,y,indImg){
    this.body   = Bodies.circle(x, y, cellSize * 0.5, {isStatic: true} );
    this.hidden = true;
    this.indImg = indImg;
  }
  show(){
    if(!this.hidden){
      push();

      let img    = pupImgs[this.indImg];
      let x      = this.body.position.x;
      let y      = this.body.position.y;
      let width  = ( (cellSize*0.9)/img.width )  * img.width;
      let height = ( (cellSize*0.9)/img.height ) * img.height;
      image(img,x,y,width,height);

      pop();
    }
  }

}
