'use strict';

var io = require('socket.io');
var socket = null;

function handleClientConnection(client) {
  console.log('User connected.');

  client.on('message', (msg) => {
    socket.emit('broadcast', msg);
  });

  client.on('disconnect', () => {
    console.log('User disconnected.');
  });
}

exports.createSocket = function(server) {
  var socket = io.listen(server);
  socket.on('connection', handleClientConnection);
  return socket;
};
