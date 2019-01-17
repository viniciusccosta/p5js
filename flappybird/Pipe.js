class Pipe{
  // ===========================================================================
  constructor(x, y, height, space){
    this.x = x;
    this.y = y;

    this.height  = height;
    this.upper   = this.y == 0; // Boolean
    this.width   = 50;
    this.speed   = 3;
    this.space   = space;
  }

  // ===========================================================================
  move(){
    this.x = this.x - this.speed;
  }

  // ===========================================================================
  show(){
    push();

    // Color:
    if (this.space < 1.8 * (2*bird.r)) fill(0,0,0);                                             // BLACK = HARDCODE
    else if (this.space >= 1.8 * (2*bird.r) && this.space < 2.3 * (2*bird.r)) fill(255,  0,0);  // RED = HARD
    else if( this.space >= 2.3 * (2*bird.r) && this.space < 2.8 * (2*bird.r)) fill(255,255,0);  // YELLOW = MEDIUM
    else if( this.space >= 2.8 * (2*bird.r) && this.space < 3.2 * (2*bird.r)) fill(  0,255,0);  // GREEN = EASY
    else  fill(0,0,255);                                                                        // BLUE = BABY MODE

    // Polygon:
    if (this.upper) rect(this.x, this.y - 10, this.width, this.height + 10, 8);
    else            rect(this.x, this.y, this.width, this.height + 10, 8);
    pop();
  }

  // ===========================================================================
  update(space, heightUpper){
    this.x     = width;
    this.space = space;

    if(this.upper){
      this.y      = 0;
      this.height = round( random(height*0.05, height-this.space-10) );
    }else{
      // If it's the bottom_pipe, we need the height of the upper_pipe:
      this.y      = heightUpper + this.space;
      this.height = height - this.y;
      this.height = this.height > 0 ? this.height : 0;
    }

  }

  // ===========================================================================
};
