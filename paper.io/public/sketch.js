// =========================================================
let cellSize = 40; // Size's each square
let limit    = 20; // World Size = (2*limit*2*limit) = 4*(limit^2) --> | 16 = 1024 | 20 = 1.600 | 30 = 3600 | 40 = 6400 |

var socket;
let players;

let player;
var cnt = 0;
let bg;

let imgs = [
  "imgs/alien.png",
  "imgs/cat.png",
  "imgs/dino.png",
  "imgs/dog.png",
  "imgs/elephant.png",
  "imgs/elk.png",
  "imgs/ghost.png",
  "imgs/goat.png",
  "imgs/hamburger.png",
  "imgs/heart.png",
  "imgs/hippo.png",
  "imgs/monkey.png",
  "imgs/owl.png",
  "imgs/panda.png",
  "imgs/rhino.png",
  "imgs/zebra.png",
];

// =========================================================
function preload() {
  bg = loadImage("imgs/background_s.jpg");
}

function setup() {
  frameRate(20); // Limited to 20 frames per second

  // Visible area:
  createCanvas(
    windowWidth - (windowWidth % cellSize) - cellSize,
    windowHeight - (windowHeight % cellSize) - cellSize - 10);

  // Connection to the server:
  socket = io.connect("http://192.168.15.3:3000");

  // Current player:
  player = new Player(int(random(-limit, limit)), int(random(-limit, limit)));
  broadcast("start"); // Sending our intel to server
  socket.on("getId",
    function(data) {
      print("Our ID is", data);
      player.id = data;
    }
  ); // Server answer with our ID
  socket.emit("conquered", Array.from(player.island.values())); // I was born, so I conquered my little square!

  // List of all players:
  players = new Map(); // | Key: player.id | Value: player object |

  // Server sending others players intel:
  socket.on("heartbeat",
    function(data) {
      for (var map of data) {
        // New player:
        if (!players.has(map.id)) {
          var island = new MyMap();
          island.fromArray(map.island);
          var tail = new MyMap();
          tail.fromArray(tail.island);

          let p = new Player(map.row, map.col, map.id, map.color, map.imgIndex, island, tail);
          players.set(p.id, p);
        }

        // Old player:
        else {
          var p = players.get(map.id);

          var island = new MyMap();
          island.fromArray(map.island); // TODO: This is too expensive to do all the time...
          var tail = new MyMap();
          tail.fromArray(map.tail); // TODO: This is too expensive to do all the time...

          p.row = map.row;
          p.col = map.col;
          p.island = island;
          p.tail = tail;

          if (player != null && player.id != p.id) {
            // If someone killed me:
            var pos = [p.col, p.row]
            if (player.tail.has(pos.toString())) {
              player.die();
            }
          }

        } // old player
      } // for(data)

    }
  );

  // Server told us to delete someone:
  socket.on("delete", function(id) {
    players.delete(id);
  });

  // Server told us that someone conquered a new area:
  socket.on("conquered",
    function(data) {
      // {id: socket.id, newArea: array}
      if (data.id != player.id) { // We don't wanna delete our own conquered areas.
        for (var value of data.newArea) {
          if (player.island.has(value.toString())) {
            player.island.delete(value.toString());
          }
        }

        if (player.island.size <= 1) player.die();
      }
    }
  );

}

function draw() {
  // Background:
  background(bg);

  // Always in the center:
  translate(width / 2 - player.col * cellSize, height / 2 - player.row * cellSize);

  // Playable Area:
  rect((-limit) * cellSize, (-limit) * cellSize, (2 * limit) * cellSize, (2 * limit) * cellSize);

  // Players island and tail:
  player.show();
  for (var [key, p] of players) {
    if (key != player.id) { // We are not other players (it's gonna have a delay if we do so)
      p.show();
    }
  }

  // Players positions:
  player.showPlayer();
  for (var [key, p] of players) {
    if (key != player.id) { // We are not other players (it's gonna have a delay if we do so)
      p.showPlayer();
    }
  }


  // Player:
  player.update();

  // Players Speed:
  cnt = (cnt + 1) % 2; // Frame yes, frame no, frame yes, frame no

  // Player Died:
  if (player.dead) {
    var score = float(100 * (player.island.size / (4 * limit * limit))).toFixed(5);

    push();
    fill(255, 50, 255);
    textSize(80);
    textAlign(CENTER, CENTER);
    text(
      "YOUR\nSCORE\n" + score + "\%",
      player.col * cellSize,
      player.row * cellSize, 0);
    pop();

    noLoop();
  }

  // Player Won:
  if (player.island.size >= 4 * limit * limit) {
    player.die(); // Disconnect from the server

    push();
    fill(50, 255, 50);
    textSize(80);
    textAlign(CENTER, CENTER);
    text(
      "YOUR\nWON\n",
      player.col * cellSize,
      player.row * cellSize, 0);
    pop();

    noLoop();
  }

  // Send this player intel to others players:
  broadcast("update");
}

function keyPressed() {
  player.move(keyCode);
}

function broadcast(msg) {
  var island = Array.from(player.island.values()); // Cannot be MyMap or it will become empty
  var tail = Array.from(player.tail.values()); // Cannot be MyMap or it will become empty

  socket.emit(msg, {
    row: player.row,
    col: player.col,
    id: player.id,
    color: player.color,
    imgIndex: player.imgIndex,
    island: island,
    tail: tail
  });
}

// =========================================================
