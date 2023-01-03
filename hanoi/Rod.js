class Rod{
  constructor(x,y,h, id){
    this.id    = id;
    this.w     = 30;
    this.h     = h;
    this.body  = Bodies.rectangle(x,y, this.w, this.h, {isStatic: true} );
    this.color = [117, 70, 23];

    this.disks = [];
  }

  show(){
    // Rod:
    push();
    fill( this.color );
    rect(this.body.position.x, this.body.position.y, this.w, this.h, 8);
    pop();

    // Disks:
    for(let disk of this.disks){ disk.show(); }

    // Clickable area:
    push();
    noStroke();
    fill(0,255,0, 15);
    rect(this.body.position.x, this.body.position.y, width*0.24, this.h); // width*0.24 --> Rod.addDisk() value
    pop();
  }

  addDisk(){
    let diskH = 30;
    let diskW = width*0.24 - ( width*0.02 * this.disks.length );

    let disk = new Disk(
      this.body.position.x,
      (ground.position.y) - (groundHeight/2) - (diskH/2) - ( diskH*this.disks.length ),
      diskW,
      diskH
    );
    this.disks.push(disk);
  }

  levitateDisk(){
    if(this.disks.length > 0){
      let lastDisk = this.disks.pop();
      lastDisk.levitate();
      return lastDisk;
    }
  }

  diskIn(disk){
    if(this.disks.length > 0){
      let lastDisk = this.disks[this.disks.length - 1];
      if (lastDisk.w < disk.w){
        return false;
      }
    }

    disk.body.position.x = this.body.position.x;
    disk.body.position.y = (ground.position.y) - (groundHeight/2) - (disk.h/2) - ( disk.h*this.disks.length );
    disk.fall();
    this.disks.push(disk);

    return true;
  }


}
