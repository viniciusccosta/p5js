// Visual:
let cellSize    = 60;
let qtdCols     = 13; 				// ALWAYS ODD!
let qtdRows     = 11; 				// ALWAYS ODD!
var playersImgs = [];
var pupImgs 	  = new Map();

// Main:
let player; 									// Map(  "id": object)
let bombs    = new Map();			// Map( "pos": object)
let stones   = new Map();			// Map( "pos": object)
let crates   = new Map();			// Map( "pos": object)
let powerups = new Map();			// Map( "pos": object) // TODO: Gerar powerups fixos no setup ?

let noCratesCells; // Set("pos")
let qtdCrates;	   // How many crates each round

// Multiplayer:
let socket;
let players  	 = new Map();
var worldReady = false;
var now 			 = new Date().getTime();

// Movement:
var startHeld = 0;
var keyheld   = false;

function preload(){
	// http://clipart-library.com/clipart/360842.htm

	explImg 	= loadImage("images/explosion1.png");
	bombImg 	= loadImage("images/bomb3.png");
	crateImg 	= loadImage("images/crate1.png");
	stoneImg  = loadImage("images/wall1.png");
	bgImg 		= loadImage("images/bg.png");

	// Players:
	for(i = 0; i < 4; i++){
		playersImgs.push(new Map());
		playersImgs[i].set("UP", 	  loadImage("images/players/player" + i + "_up.png")); // https://remos.itch.io/mini-crusader
		playersImgs[i].set("DOWN", 	loadImage("images/players/player" + i + "_down.png"));
		playersImgs[i].set("RIGHT", loadImage("images/players/player" + i + "_right.png"));
		playersImgs[i].set("LEFT",  loadImage("images/players/player" + i + "_left.png"));
		playersImgs[i].set("DEAD",  loadImage("images/players/player" + i + "_dead.png"));
	}


	//pupImgs.push( "SPEED", loadImage("images/fire.png") ); // TODO: Add speed image
	pupImgs.set( "FIRE", loadImage("images/fire.png") );
	pupImgs.set( "BOMB", loadImage("images/pup_bomb.png") );

	soundFormats('mp3', 'ogg');
  bgSong   = loadSound('sounds/06-battle-theme-super-bomberman-4-ost-snes.mp3');
	expSound = loadSound('sounds/explosion2.mp3');
}
function setup() {
	// Canvas:
	frameRate(25);
  var cnv = createCanvas(qtdCols*cellSize + 1, qtdRows*cellSize + 1);
	cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

	// Server:
	let initialPos = [ [0,0], [0,qtdRows-1], [qtdCols-1,0] ,[qtdCols - 1, qtdRows - 1] ];
	socket = io.connect("http://localhost:3000");
	socket.emit("start", null);

	socket.on("accepted",
		function(data){
			player = new Player(
				initialPos[data.index][0],
				initialPos[data.index][1],
				data.id,
				data.index
			);

			if(crates.size > 0) worldReady = true;
		}
	);
	socket.on("fullRoom",
		function(data){
			print("SALA CHEIA");
			socket.disconnect();
		}
	);
	socket.on("heartbeat",
		function(data){
			now = data.now;

			for(var map of data.players){
				// New Player:
				if(!players.has(map.id)){
					p = new Player( map.center_x, map.center_y, map.id, map.index );
					players.set(p.id, p);
				}
				// Old Player:
				else{
					p = players.get(map.id);
					if(player != null && p.id != player.id){ // We don't wanna update ourselves
						p.center_x  = map.center_x;
						p.center_y  = map.center_y;
						p.curImgKey = map.curImgKey;
					}
				}
			}
		}
	);
	socket.on("delete",
		function(id){
			if(players.has(id)) players.delete(id);
		}
	);
	socket.on("crates",
		function(data){
			// ----------------------------------------------------
			// This user is the first one and is resposible to generate all crates:
			if(data.create){
				// Crates:
				setNoCratesCells();
				qtdCrates = int( (qtdCols * qtdRows) / 2 );
				var data = {crates: [], pups: []};

				while(crates.size < qtdCrates){
					var rndPos = [int(random(0,qtdCols)), int(random(0,qtdRows))];

					// We can't have crates:
					if( stones.has(rndPos.toString()) 			// above stones
					||  noCratesCells.has(rndPos.toString()) // nor where players begin,
					||  crates.has(rndPos.toString()) ){ 		// nor where there's already a crate
						continue;
					}

					crates.set( rndPos.toString(), new Crate(rndPos[0], rndPos[1]) );
					data.crates.push( [rndPos[0], rndPos[1]] );
					if(random(0,1) <= 0.40){ 														// x% probability
						var rndPower = random([1,2]); // TODO: random[0,1,2]
						powerups.set( rndPos.toString(), new PowerUp( rndPos[0], rndPos[1], rndPower) );
						data.pups.push( [rndPos[0], rndPos[1], rndPower] );
					}
				}

				socket.emit("cratesCreated", data);
			}
			// ----------------------------------------------------
			// Receiving crates/powerups positions:
			else{
				for(var crate of data.crates){
					crates.set(crate.toString(), new Crate(crate[0], crate[1]));
				}
				for(var pup of data.pups){
					powerups.set([pup[0],pup[1]].toString(), new PowerUp(pup[0], pup[1], pup[2]));
				}
			}

			// ----------------------------------------------------
			if(player != null) worldReady = true;

			// ----------------------------------------------------
		}
	);
	socket.on("bombPlanted",
		function(data){
			if(data != null){
				var bomb = new Bomb(data.col, data.row, data.range, data.endMillis);
				bombs.set( [bomb.col, bomb.row].toString(), bomb);
			}
		}
	);
	socket.on("pupPicked",
		function(data){
			var pos = [data.col, data.row];
			if(data!=null && powerups.has(pos.toString())){
				powerups.get(pos.toString()).destroy();
			}
		}
	);

	// Stones:
	for(col = 0; col < int(qtdCols/2); col++){
		for(row = 0; row < int(qtdRows/2); row++){
			var pos = [2*col + 1, 2*row + 1];
			stones.set( pos.toString(), new Stone(pos[0], pos[1]) );
		}
	}

	// Sounds:
	bgSong.setVolume(0.25);
	expSound.setVolume(0.3);
}
function draw() {
	if(worldReady){
		// ------------------------------------------------
		// User has to hold at least x milliseconds:
		if(player != null && keyheld && (millis() - startHeld) > 250) {
				//player.move(keyCode, false);
		}

		// ------------------------------------------------
		// Background:
		background(240);
		for(var col = 0; col <= qtdCols; col++) line(col*cellSize, 0, col*cellSize, height);
		for(var row = 0; row <= qtdRows; row++) line(0, row*cellSize, width, row*cellSize);
		//pop();

		// ------------------------------------------------
		// Multiplayer
		for(var [k,p] of players){
			if(p.id != player.id) p.show(); // We don't wanna draw ourselves now
		}

		// ------------------------------------------------
		// Draw Player:
		if(player != null) player.show();

		// Draw Stones:
		for(var [k,stone] of stones){ stone.show(); }

		// Update and Draw Bombs:
	  for(var [kBomb,bomb] of bombs){
			bomb.update();

			if(bomb.exploded){
				if(!bomb.explosionStarted){
					if(player != null) player.bombExploded( bomb.hittenCells );
					for(var [kCrate,crate] of crates) 	crate.bombExploded(bomb.hittenCells);
					for(var [kPup,pup] of powerups) 		pup.bombExploded(bomb.hittenCells);
					bomb.startExplosion();
				}else if(bomb.explosionFinished){
					bombs.delete(kBomb);
				}
			}

			bomb.show();
	  }

		// ------------------------------------------------
		// Destroy or Draw PowerUps:
		for(var [k,pup] of powerups){
			if(pup.destroyed){
				powerups.delete(k);
			}
			pup.show();
		}

		// Destroy or Draw Crates:
		for(var [k,crate] of crates){
			if(crate.destroyed){
				crates.delete(k);
			}
			else crate.show();
		}

		// ------------------------------------------------
		// Player Died:
		if(player != null && player.dead){
			push();
			imageMode(CENTER);
			image(
				explImg,
				width/2,
				height/2,
				( (width/2)  / explImg.width)  * explImg.width,
				( (height/2) / explImg.height) * explImg.height
			);

			textSize(200);
			textAlign(CENTER, CENTER);
			fill(255,0,255);
			text("YOU\nLOSE", width/2, height/2);
			pop();

			player.show();
			noLoop();
		}

		// ------------------------------------------------
		// Multiplayer:
		broadcast("update");

		// ------------------------------------------------
	}
}

function keyPressed(){
	if(player != null) player.move(keyCode, true);

	keyheld = true;
	if(keyCode == UP_ARROW || keyCode == LEFT_ARROW || keyCode == DOWN_ARROW || keyCode == RIGHT_ARROW){
		startHeld = millis();
	}

	if(!bgSong.isLooping()){
		bgSong.loop();
	}
}
function keyReleased(){
	keyheld = false;
}
function mousePressed(){
	if(!bgSong.isLooping()){
		bgSong.loop();
	}
}

function setNoCratesCells(){
	// YES, I HARDCODED AND I'M FINE WITH IT HAHA! :p
	noCratesCells = new Set();

	noCratesCells.add( [0,0].toString() );
	noCratesCells.add( [0,1].toString() );
	noCratesCells.add( [1,0].toString() );

	noCratesCells.add( [0,qtdRows-1].toString() );
	noCratesCells.add( [0,qtdRows-2].toString() );
	noCratesCells.add( [1,qtdRows-1].toString() );

	noCratesCells.add( [qtdCols - 1,0].toString() );
	noCratesCells.add( [qtdCols - 2,0].toString() );
	noCratesCells.add( [qtdCols - 1,1].toString() );

	noCratesCells.add( [qtdCols - 1, qtdRows - 1].toString() );
	noCratesCells.add( [qtdCols - 2, qtdRows - 1].toString() );
	noCratesCells.add( [qtdCols - 1, qtdRows - 2].toString() );
}
function broadcast(msg, dataAux){
	var data;
	if(player != null){
		switch (msg){
			case "update":
				data = {
					dead: 		 player.dead,
					center_x:  player.center_x,
					center_y:  player.center_y,
					curImgKey: player.curImgKey
				}
				break;
			case "bombPlanted":
				data = {
					pId:   player.id,
					col:   dataAux.col,
					row:   dataAux.row,
					endMillis: dataAux.endMillis,
					range: dataAux.range
				}
				break;
			case "pupPicked":
				data = {
					pId: player.id,
					col: dataAux.col,
					row: dataAux.row
				}
				break;
		}
	}

	socket.emit(msg, data);
}
