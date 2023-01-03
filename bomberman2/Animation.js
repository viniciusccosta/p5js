class Animation{
  constructor(arrayImgs, rate){
    this.imgs    = arrayImgs; // Copy ?
    this.rate    = rate;

    this.curIndx = 0;
    this.cnt     = 0;

    this.paused  = false;
  }
  update(){
    if(!this.paused){
      this.cnt = (this.cnt + 1) % this.rate;
      if(this.cnt == 0){
        this.curIndx = (this.curIndx + 1) % this.imgs.length;
      }
    }
  }

  pause(){
    this.paused = true;
  }
  play(){
    this.paused = false;
  }

  getImg(){
    return this.imgs[this.curIndx];
  }
}
