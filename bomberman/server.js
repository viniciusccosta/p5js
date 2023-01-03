// ------------------------------------------------------------------------------------
// NÃO MEXER:
var express = require('express'); // Using express: http://expressjs.com/
var app     = express();          // Create the app

// Set up the server
var server = app.listen(process.env.PORT || 3000, listen); // process.env.PORT is related to deploying on heroku

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Bomberman app listening at http://' + host + ':' + port + "\n");
}

app.use(express.static('public'));

var io = require('socket.io')(server); // WebSockets work with the HTTP server

// ------------------------------------------------------------------------------------
let clients = new Map();
let crates  = [];
let pups    = [];

setInterval(heartbeat, 40); // ( 1000 / (25 frames/s) ) = 40
function heartbeat() {
  io.sockets.emit('heartbeat', {
    now: new Date().getTime(),
    players: Array.from(clients.values())
  });
}

// ------------------------------------------------------------------------------------
/* Register a callback function to run when we have an individual connection
  This is run for each individual user that connects */
io.sockets.on('connection',
  function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('start',
      function(data) {

        // Unfortunally I wasn't able to user my "Player" class...
        if(clients.size < 4){
          console.log(socket.id, "started");
          console.log(clients.size + 1, "client(s)");

          // Add client to our list of clients:
          clients.set(socket.id,{
              id      : socket.id,
              index   : clients.size,   // We haven't added this user to the Map, so, no "-1"
              center_x: -1,
              center_y: -1,
              curImgKey: "DOWN",
              dead: false }
          );

          // ID and Index:
          io.to(socket.id).emit('accepted',{
            id: socket.id,
            index: clients.size - 1}
          );

          // Crates:
          if(clients.size == 1){
            io.to(socket.id).emit('crates',{create: true, crates: null, pups: null});
          }else{
            io.to(socket.id).emit('crates',{create: false, crates: crates, pups: pups});
          }

        }else{
          io.to(socket.id).emit('fullRoom', null);
        }
      }
    );
    socket.on('update',
      function(data) {
        if(data != null){
          var player = clients.get(socket.id);

          if (player != null) {
            player.dead 		 = player.dead;
            player.center_x  = data.center_x;
            player.center_y  = data.center_y;
            player.curImgKey = data.curImgKey;
          } else {
            //console.log("!!! client", socket.id, "not found !!!");
          }
        }
      }
    );
    socket.on("cratesCreated", function(data){
      crates = data.crates;
      pups   = data.pups;
    });
    socket.on("bombPlanted", function(data){
      if(data != null){
        io.sockets.emit("bombPlanted", data);
      }
    });
    socket.on("pupPicked", function(data){
      if(data != null){
        io.sockets.emit("pupPicked", data);
      }
    });

    socket.on('disconnect', function() {
      clients.delete(socket.id);
      io.sockets.emit('delete', socket.id);
      console.log(socket.id, "disconnected");
      console.log(clients.size, "client(s) left");
    });
  }
);
