// ------------------------------------------------------------------------------------
let clients = new Map();

// ------------------------------------------------------------------------------------
var express = require('express'); // Using express: http://expressjs.com/
var app = express(); // Create the app

// Set up the server
var server = app.listen(process.env.PORT || 3000, listen); // process.env.PORT is related to deploying on heroku

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Animals.io app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// ------------------------------------------------------------------------------------
// WebSocket Portion
var io = require('socket.io')(server); // WebSockets work with the HTTP server

// ------------------------------------------------------------------------------------
// Update frequency:
setInterval(heartbeat, 50); // ( 1000 / (20 frames/s) )
function heartbeat() {
  io.sockets.emit('heartbeat', Array.from(clients.values()));
}

// ------------------------------------------------------------------------------------
/* Register a callback function to run when we have an individual connection
  This is run for each individual user that connects */
io.sockets.on('connection',
  function(socket) {
    console.log("We have a new client: " + socket.id);

    // Client sent: "START":
    socket.on('start',
      function(data) {

        // Unfortunally I wasn't able to user my "Player" class...
        clients.set(socket.id, {
            row: data.row,
            col: data.col,
            id: socket.id,
            color: data.color,
            imgIndex: data.imgIndex,
            island: data.island, // Here, it's just an array instead of MyMap object
            tail: data.tail
          } // Here, it's just an array instead of MyMap object
        );
        console.log("Client", socket.id, "started");
        console.log("Now we have", clients.size, "clients");

        io.to(socket.id).emit('getId', socket.id); // Sending the ID only for that person
      }
    );

    // Client sent: "UPDATE":
    socket.on('update',
      function(data) {
        var player = clients.get(socket.id);
        if (player != null) {
          player.row = data.row;
          player.col = data.col;
          player.island = data.island;
          player.tail = data.tail;
        } else {
          console.log("!!! client", socket.id, "not found !!!");
        }
      }
    );

    // Client sent: "CONQUERED":
    socket.on('conquered',
      function(data) {
        var player = clients.get(socket.id);

        if (player != null) {
          io.sockets.emit('conquered', {
            id: socket.id,
            newArea: data
          });
        } else {
          console.log("!!! client", socket.id, "not found !!!");
        }
      }
    );

    // Client sent: "DISCONNECT":
    socket.on('disconnect', function() {
      clients.delete(socket.id); // Something it's not right, it's deleting other user, I don't know...
      io.sockets.emit('delete', socket.id);
      console.log("Client", socket.id, "disconnected");
    });

  }
);
