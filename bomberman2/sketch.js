// Module aliases
var Engine = Matter.Engine;
var World  = Matter.World;
var Bodies = Matter.Bodies;

let cellSize          =  55;  // Suggestion: 60
const cols            =  11;  // ALWAYS AN ODD NUMBER
const rows            =   9;  // ALWAYS AN ODD NUMBER
const pupChances      = 0.2;  // PowerUp creation chances

let engine;
let players;
let stones;
let borders;
let crates;
let bombs     = new Map();
let powerups  = new Map();

let stoneImg;
let borderImg;
let bombImg;
let crateImg   = [];
let playerImgs = [];
let pupImgs    = [];
let ghostImgs  = [];
let stages     = ["YARD", "HALLOWEEN", "GOLDENMINE"];
let stage;
let bgColor    = [0, 183, 18];
let facesImgs  = []

let mainCanvas;
let sideCanvas;

let bgSong;
let expSound;

let w;
let h;

function preload() {
  // STAGE IMGS:
  stage = random(stages);

  switch (stage) {
    case "YARD":
      crateImg = [
        loadImage("images/yard/stone2.png"),
        loadImage("images/yard/flower2.png"),
        loadImage("images/yard/puddle2.png"),
        loadImage("images/yard/bee.png")
      ];
      stoneImg  = loadImage("images/yard/mushroom2.png");
      borderImg = loadImage("images/yard/mushroom2.png");
      bgColor   = [0, 183, 18];
      break;

    case "HALLOWEEN":
      crateImg = [
        loadImage("images/halloween/mummy.png"),
        loadImage("images/halloween/gravestone.png"),
        loadImage("images/halloween/bats.png")
      ];
      stoneImg = loadImage("images/halloween/pumpkin.png");
      borderImg = loadImage("images/halloween/pumpkin.png");
      break

    case "GOLDENMINE":
      crateImg = [
        loadImage("images/goldenmine/car2.png"),
        loadImage("images/goldenmine/money2.png"),
        loadImage("images/goldenmine/treasure_chest.png"),
        loadImage("images/goldenmine/golden_bar.png"),
        loadImage("images/goldenmine/tnt2.png"),
        loadImage("images/goldenmine/bananas2.png"),
        loadImage("images/goldenmine/sign.png")
      ];
      stoneImg  = loadImage("images/goldenmine/rail.png");
      borderImg = loadImage("images/goldenmine/rail.png");
      bgColor   = [252, 194, 136];
      break
  }

  // BOMB AND POWERUPS IMGS:
  bombImg = loadImage("images/bomb2.png");
  pupImgs = [
    loadImage("images/powerups/bombs.png"),
    loadImage("images/powerups/fire3.png")
  ];

  // PLAYERS IMGS:
  //ghostImgs.push( loadImage("images/players/ghost2_1.png") );
  ghostImgs.push( loadImage("images/players/ghost2_2.png") );
  ghostImgs.push( loadImage("images/players/ghost2_3.png") );
  ghostImgs.push( loadImage("images/players/ghost2_4.png") );
  ghostImgs.push( loadImage("images/players/ghost2_5.png") );

  let index = 0;
  // Pig:
  playerImgs[index] = new Map();
  playerImgs[index].set("UP", []);
  playerImgs[index].get("UP").push(loadImage("images/players/pig_up_1.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/pig_up_2.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/pig_up_3.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/pig_up_4.png"));

  playerImgs[index].set("LEFT", []);
  playerImgs[index].get("LEFT").push(loadImage("images/players/pig_left_1.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/pig_left_2.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/pig_left_3.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/pig_left_4.png"));

  playerImgs[index].set("DOWN", []);
  playerImgs[index].get("DOWN").push(loadImage("images/players/pig_down_1.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/pig_down_2.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/pig_down_3.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/pig_down_4.png"));

  playerImgs[index].set("RIGHT", []);
  playerImgs[index].get("RIGHT").push(loadImage("images/players/pig_right_1.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/pig_right_2.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/pig_right_3.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/pig_right_4.png"));

  // Chicken:
  index = 1;
  playerImgs[index] = new Map();
  playerImgs[index].set("UP", []);
  playerImgs[index].get("UP").push(loadImage("images/players/chicken_up_1v2.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/chicken_up_2.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/chicken_up_3.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/chicken_up_4.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/chicken_up_5.png"));

  playerImgs[index].set("LEFT", []);
  playerImgs[index].get("LEFT").push(loadImage("images/players/chicken_left_1v2.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/chicken_left_2v2.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/chicken_left_3v2.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/chicken_left_4v2.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/chicken_left_5v2.png"));

  playerImgs[index].set("DOWN", []);
  playerImgs[index].get("DOWN").push(loadImage("images/players/chicken_down_1v2.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/chicken_down_2.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/chicken_down_3.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/chicken_down_4.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/chicken_down_5.png"));

  playerImgs[index].set("RIGHT", []);
  playerImgs[index].get("RIGHT").push(loadImage("images/players/chicken_right_1v2.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/chicken_right_2v2.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/chicken_right_3v2.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/chicken_right_4v2.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/chicken_right_5v2.png"));

  // White:
  index = 2;
  playerImgs[index] = new Map();
  playerImgs[index].set("UP", []);
  playerImgs[index].get("UP").push(loadImage("images/players/white_up_1.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/white_up_2.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/white_up_3.png"));

  playerImgs[index].set("LEFT", []);
  playerImgs[index].get("LEFT").push(loadImage("images/players/white_left_1.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/white_left_2.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/white_left_3.png"));

  playerImgs[index].set("DOWN", []);
  playerImgs[index].get("DOWN").push(loadImage("images/players/white_down_1.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/white_down_2.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/white_down_3.png"));

  playerImgs[index].set("RIGHT", []);
  playerImgs[index].get("RIGHT").push(loadImage("images/players/white_right_1.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/white_right_2.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/white_right_3.png"));

  // Black:
  index = 3;
  playerImgs[index] = new Map();
  playerImgs[index].set("UP", []);
  playerImgs[index].get("UP").push(loadImage("images/players/black_up_1.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/black_up_2.png"));
  playerImgs[index].get("UP").push(loadImage("images/players/black_up_3.png"));

  playerImgs[index].set("LEFT", []);
  playerImgs[index].get("LEFT").push(loadImage("images/players/black_left_1.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/black_left_2.png"));
  playerImgs[index].get("LEFT").push(loadImage("images/players/black_left_3.png"));

  playerImgs[index].set("DOWN", []);
  playerImgs[index].get("DOWN").push(loadImage("images/players/black_down_1.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/black_down_2.png"));
  playerImgs[index].get("DOWN").push(loadImage("images/players/black_down_3.png"));

  playerImgs[index].set("RIGHT", []);
  playerImgs[index].get("RIGHT").push(loadImage("images/players/black_right_1.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/black_right_2.png"));
  playerImgs[index].get("RIGHT").push(loadImage("images/players/black_right_3.png"));

  // FACES:
  facesImgs.push( loadImage("images/players/pig_face.png") )
  facesImgs.push( loadImage("images/players/chicken_face.png") )

  // SOUNDS:
  soundFormats('mp3', 'ogg');
  bgSong   = loadSound('sounds/06-battle-theme-super-bomberman-4-ost-snes.mp3');
  expSound = loadSound('sounds/explosion2.mp3');
}
function setup() {
  // Global Settings:
  rectMode(CENTER);
  imageMode(CENTER);

  // Canvas:
  cellSize = (windowWidth*0.5) / (cols);

  w = cols * cellSize + 5 * cellSize;
  h = rows * cellSize + 2 * cellSize;
  mainCanvas = createCanvas(w + 1, h + 1);
  mainCanvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  // Engine:
  engine = Engine.create();
  engine.world.gravity.scale = 0;

  // Player
  players = [];   // Player's ID must be their indexes in the array!
  players.push(new Player(0, (       5) * cellSize + cellSize / 2,    1 * cellSize + cellSize / 2, new Controler(65, 87, 68, 83, 32))); // WASD   + spacebar
  players.push(new Player(1, (cols + 3) * cellSize + cellSize / 2, rows * cellSize + cellSize / 2, new Controler(37, 38, 39, 40, 13))); // arrows + enter

  // Stones:
  stones = new Map();
  for (col = 1+3; col < cols + 3; col++) {
    for (row = 1; row < rows; row++) {
      if (row % 2 == 0 && col % 2 != 0) {
        let x = col * cellSize + cellSize / 2;
        let y = row * cellSize + cellSize / 2;
        stones.set([col, row].toString(), new Stone(x, y));
      }
    }
  }

  // Crates:
  let initialPos = getinitialPos();
  let nCrates    = int(cols * rows * 0.5); // Be careful or infinity loop!
  crates         = new Map();

  while (crates.size < nCrates) {
    let rndPos = [int(random(1 + 3, cols + 1 + 3)), int(random(1, rows + 1))];

    if (!crates.has(rndPos.toString()) && !initialPos.has(rndPos.toString()) && !stones.has(rndPos.toString())) {
      let x = (rndPos[0] * cellSize) + cellSize / 2;
      let y = (rndPos[1] * cellSize) + cellSize / 2;
      crates.set(rndPos.toString(), new Crate(x, y, round(random(0, crateImg.length - 1))));

      if(random(0,1) <= pupChances){
        powerups.set(
          rndPos.toString(),
          new PowerUp(x, y, round(random(0, pupImgs.length - 1)))
        );
      }

    }
  }

  // Borders:
  borders = [];
  for (let col = 1+3; col <= cols+3; col++) {
    borders.push(new Border(col * cellSize + cellSize / 2, 0 + cellSize / 2)); // TOP    WALL
    borders.push(new Border(col * cellSize + cellSize / 2, h - cellSize / 2)); // BOTTOM WALL
  }
  for (let row = 0; row <= rows + 1; row++) {
    borders.push(new Border(3*cellSize + cellSize / 2, row * cellSize + cellSize / 2)); // LEFT  WALL
    borders.push(new Border(         w - cellSize / 2, row * cellSize + cellSize / 2)); // RIGHT WALL
  }

  // Add all of the bodies to the world:
  for (let player of players)    World.add(engine.world, player.body);
  for (let border of borders)    World.add(engine.world, border.body);
  for (let [k, stone] of stones) World.add(engine.world,  stone.body);
  for (let [k, crate] of crates) World.add(engine.world,  crate.body);

  // Sounds:
  bgSong.setVolume(0.25);
  expSound.setVolume(0.3);

}
function draw() {
  // ----------------------------------------
  // DRAW:
  mainCanvas.background(bgColor);
  for (let border     of borders)   border.show();
  for (let [k, stone] of stones)    stone.show();
  for (let [k, crate] of crates)    crate.show();
  for (let [k,   pup] of powerups)  pup.show();
  for (let [k,  bomb] of bombs)     bomb.show();

  //showDivisions();
  showPlayersInfos();

  for (let player of players) player.show();

  // ----------------------------------------
  // UPDATE:
  Engine.update(engine);

  // players:
  for (let player of players){
    player.update();

    if(!player.dead) {
      for(let [k,pup] of powerups){
        if(!pup.hidden){
          let dist = sqrt(pow(player.body.position.x - pup.body.position.x, 2) + pow(player.body.position.y - pup.body.position.y, 2));
          if(dist < cellSize/3 /*player.body.circleRadius + pup.body.circleRadius*/){
            player.upgradePower(pup);
            powerups.delete(k);
          }
        }
      }
    }

  }

  // bombs:
  for (let [k, bomb] of bombs) {
    bomb.update();
    if(bomb.explosionStarted){
      if(bomb.explosionEnded){
        World.remove(engine.world, bomb.body);  // Remove from the world
        bombs.delete(k);                        // Remove from our own list
      }
    }
    else{
      if (bomb.exploded) {
        bombExploded(bomb.affectedCells);       // Check what the bomb affected
        players[bomb.playerID].bombExploded();  // Tell the user that he can plant another bomb
        bomb.startExplosion();
        expSound.play();
      } else {
        let curPlayer = players[bomb.playerID];
        let dist = sqrt(pow(curPlayer.body.position.x - bomb.body.position.x, 2) + pow(curPlayer.body.position.y - bomb.body.position.y, 2));

        // if the user it's not where the bomb has been planted and if the bomb it's not in the world yet:
        if (!bomb.inWorld && dist > curPlayer.body.circleRadius + bomb.body.circleRadius) {
          World.add(engine.world, bomb.body);
          bomb.inWorld = true;
        }
      }
    }

  }

  // ----------------------------------------
}

function bombExploded(affectedCells){
  // BOMBS:
  for (let [k, bomb] of bombs) {
    let col = int(bomb.body.position.x / cellSize);
    let row = int(bomb.body.position.y / cellSize);
    let pos = [col,row];

    if(!bomb.exploded && affectedCells.has(pos.toString())){
      bomb.explode();
    }

  }

  // Power Ups (ALWAYS BEFORE CRATES):
  for(let [k,pup] of powerups){
    let col = int(pup.body.position.x / cellSize);
    let row = int(pup.body.position.y / cellSize);
    let pos = [col,row];

    if(affectedCells.has(pos.toString()) && !pup.hidden){
      powerups.delete(k);
    }
  }

  // CRATES:
  for (let [k, crate] of crates){
    let col = int(crate.body.position.x / cellSize);
    let row = int(crate.body.position.y / cellSize);
    let pos = [col,row];

    if(affectedCells.has(pos.toString())){
      World.remove(engine.world, crate.body);
      crates.delete(k);

      if (powerups.has(pos.toString())){
        let pup = powerups.get(k);
        if(pup.hidden){
          pup.hidden = false;
        }
      }
    }

  }

  // PLAYERS:
  for (let player of players) {
    let col = int(player.body.position.x / cellSize);
    let row = int(player.body.position.y / cellSize);
    let pos = [col,row];

    if(affectedCells.has(pos.toString())){
      player.die();
    }
  }

}
function getinitialPos() {
  let initialPos = new Set();

  // TOP LEFT:
  initialPos.add([1+3, 1].toString());
  initialPos.add([1+3, 2].toString());
  initialPos.add([2+3, 1].toString());

  // BOTTOM LEFT:
  initialPos.add([1+3, rows - 0].toString());
  initialPos.add([1+3, rows - 1].toString());
  initialPos.add([2+3, rows - 0].toString());

  // TOP RIGHT:
  initialPos.add([cols - 0 + 3, 1].toString());
  initialPos.add([cols - 1 + 3, 1].toString());
  initialPos.add([cols - 0 + 3, 2].toString());

  // BOTTOM RIGHT:
  initialPos.add([cols - 0 + 3, rows - 0].toString());
  initialPos.add([cols - 1 + 3, rows - 0].toString());
  initialPos.add([cols - 0 + 3, rows - 1].toString());

  return initialPos;
}

function showDivisions(){
  push();
  for (row = 0; row <= rows + 1; row++) line(0, row*cellSize, width, row*cellSize);
  for (col = 0; col <= cols + 1 + 3; col++) line(col*cellSize, 0, col*cellSize, height);

  // getinitialPos:
  fill(255,127,0);
  // TOP LEFT:
  rect((1+3)*cellSize + cellSize/2, 1*cellSize + cellSize/2, cellSize, cellSize);
  rect((1+3)*cellSize + cellSize/2, 2*cellSize + cellSize/2, cellSize, cellSize);
  rect((2+3)*cellSize + cellSize/2, 1*cellSize + cellSize/2, cellSize, cellSize);

  // BOTTOM LEFT:
  rect((1+3)*cellSize + cellSize/2, (rows - 0)*cellSize + cellSize/2, cellSize, cellSize);
  rect((1+3)*cellSize + cellSize/2, (rows - 1)*cellSize + cellSize/2, cellSize, cellSize);
  rect((2+3)*cellSize + cellSize/2, (rows - 0)*cellSize + cellSize/2, cellSize, cellSize);

  // TOP RIGHT:
  rect((cols - 0 + 3)*cellSize + cellSize/2, 1*cellSize + cellSize/2, cellSize, cellSize);
  rect((cols - 1 + 3)*cellSize + cellSize/2, 1*cellSize + cellSize/2, cellSize, cellSize);
  rect((cols - 0 + 3)*cellSize + cellSize/2, 2*cellSize + cellSize/2, cellSize, cellSize);

  // BOTTOM RIGHT:
  rect((cols - 0 + 3)*cellSize + cellSize/2, (rows - 0)*cellSize + cellSize/2, cellSize, cellSize);
  rect((cols - 1 + 3)*cellSize + cellSize/2, (rows - 0)*cellSize + cellSize/2, cellSize, cellSize);
  rect((cols - 0 + 3)*cellSize + cellSize/2, (rows - 1)*cellSize + cellSize/2, cellSize, cellSize);
  pop();
}
function showPlayersInfos(){
  push();
  noStroke()
  fill(0);
  rect( 1.0*cellSize + cellSize/2,                     5*cellSize + cellSize/2, cellSize*3.00, cellSize*0.25 );
  rect( 2.4*cellSize + cellSize/2, (int((cols+2)/2) - 1)*cellSize + cellSize/2, cellSize*0.25, cellSize*cols );
  pop();

  let img;
  let row = 0;
  textAlign(CENTER, CENTER);
  textSize(32);

  // -----------------------------------------------------------------
  // Player 1:
  img = facesImgs[0]
  image(
    img,
    1*cellSize + cellSize/2,
    0*cellSize + cellSize/2,
    ((cellSize * 0.75) /  img.width) * img.width,
    ((cellSize * 0.75) / img.height) * img.height
  );

  img = pupImgs[0];
  image(
    img,
    1*cellSize + cellSize/2,
    (row+1)*cellSize + cellSize/2,
    ((cellSize * 0.5) /  img.width) * img.width,
    ((cellSize * 0.5) / img.height) * img.height
  );

  img = pupImgs[1];
  image(
    img,
    1*cellSize + cellSize/2,
    (row+2)*cellSize + cellSize/2,
    ((cellSize * 0.5) /  img.width) * img.width,
    ((cellSize * 0.5) / img.height) * img.height
  );

  text(
    players[0].powers[0],
    0*cellSize + cellSize/2,
    (row + 1)*cellSize + cellSize/2
   );

   text(
     players[0].powers[1],
     0*cellSize + cellSize/2,
     (row + 2)*cellSize + cellSize/2
    );

    // -----------------------------------------------------------------
  // Player 2:
  row = int((cols+2)/2);
  img = facesImgs[1]
  image(
    img,
      1 * cellSize + cellSize/2,
    row * cellSize + cellSize/2,
    ((cellSize * 0.75) /  img.width) * img.width,
    ((cellSize * 0.75) / img.height) * img.height
  );

  img = pupImgs[0];
  image(
    img,
    1*cellSize + cellSize/2,
    (row + 1)*cellSize + cellSize/2,
    ((cellSize * 0.5) /  img.width) * img.width,
    ((cellSize * 0.5) / img.height) * img.height
  );

  img = pupImgs[1];
  image(
    img,
    1*cellSize + cellSize/2,
    (row + 2)*cellSize + cellSize/2,
    ((cellSize * 0.5) /  img.width) * img.width,
    ((cellSize * 0.5) / img.height) * img.height
  );

  text(
    players[1].powers[0],
    0*cellSize + cellSize/2,
    (row + 1)*cellSize + cellSize/2
   );

   text(
     players[1].powers[1],
     0*cellSize + cellSize/2,
     (row + 2)*cellSize + cellSize/2
    );

  // -----------------------------------------------------------------

}

function keyReleased() {
  if (players) {
    for (let player of players) {
      player.controler.mKeyReleased(keyCode);
    }
  }
}
function keyPressed() {
  if (players) {
    for (let player of players) {

      if (keyCode == player.controler.left ||
        keyCode == player.controler.up ||
        keyCode == player.controler.right ||
        keyCode == player.controler.down) {

        player.controler.mKeyPressed(keyCode);
        player.move();
      } else if (keyCode == player.controler.plant) {
        let bomb = player.plantBomb();
        if (bomb) {
          let col = int(bomb.body.position.x / cellSize);
          let row = int(bomb.body.position.y / cellSize);
          bombs.set([col, row].toString(), bomb);
        }
      }

    }
  }

  if(!bgSong.isLooping()){
		bgSong.loop();
	}
}
function mousePressed(){
  if(!bgSong.isLooping()){
		bgSong.loop();
	}
}

// TODO: Menu page (choose stage, how many players, map controllers, e etc)
// TODO: Multiplayer LAN
// TODO: Upgrade player's info, colsOffset ( "+3" hardcoded)
