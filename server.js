'use strict';

var express = require('express');
var path = require('path');
var http = require('http');
var socket = require('./socket');
var db = require('./database/db');

db.init();

var app = express();
var server = http.createServer(app);
var sock = socket.createSocket(server);

var static_path = path.join(__dirname, "dist");
app.use(express.static(static_path));

server.listen(8080, () => { 
  console.log('Server listening on port 8080.');
});

///////////////////////////////////////////////////////////////////////////////
// yahoo-finance demo
///////////////////////////////////////////////////////////////////////////////

// var yf = require('./yahoo-finance');
// yf.stream('SPY,GOOG,AAPL,BAC,FCX,TVIX,GE,QQQ,XIV', 'l90', (stream) => {
//   stream.on('data',   (data) => { console.log(data); });
//   stream.on('error',  () =>     { console.log('Error.'); });
// });

///////////////////////////////////////////////////////////////////////////////
// twitter stream demo
///////////////////////////////////////////////////////////////////////////////

// var twitter = require('twitter');
// var config = require('./config');
// var twitterStreamController = require('./controllers/twitterStream');

// var twit = new twitter(config.twitter);

// twit.stream('statuses/filter', { track: 'justin' }, (stream) => {
//   let output = twitterStreamController.handle(stream);
//   output.subscribe(() => console.log(':)'));
// });