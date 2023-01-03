class Disk{
  constructor(x,y,w,h){
    this.w          = w;
    this.h          = h;
    this.body       = Bodies.rectangle(x,y, this.w, this.h, {isStatic: false} );
    this.color      = [ round(random(25,200)) , round(random(25,200)) , round(random(25,200)) ];
    this.levitating = false;
  }

  show(){
    push();

    fill( this.color );
    if(this.levitating){
      rect(this.body.position.x, height*0.25, this.w, this.h, 8);
    }else{
      rect(this.body.position.x, this.body.position.y, this.w, this.h, 8);
    }

    pop();
  }

  levitate(){
    this.levitating = true;
  }

  fall(){
    this.levitating = false;
  }
}
