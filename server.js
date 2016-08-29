'use strict';

var express = require('express');
var path = require('path');
var http = require('http');
var socket = require('./socket');
var db = require('./database');

var app = express();
var server = http.createServer(app);
var sock = socket.createSocket(server);

var static_path = path.join(__dirname, "dist");
app.use(express.static(static_path));

server.listen(8080, () => {
  console.log('Server listening on port 8080.');
});

// yahoo-finance demo
// var yf = require('./yahoo-finance');
// yf.stream('SPY,GOOG,AAPL,BAC,FCX,TVIX,GE,QQQ,XIV', 'l90', (stream) => {
//   stream.on('data',   (data) => { console.log(data); });
//   stream.on('error',  () =>     { console.log('Error.'); });
// });


// twitter stream demo
var twitter = require('twitter');
var config = require('./config');
var twitterStreamHandler = require('./sinks/twitterStreamHandler');

var twit = new twitter(config.twitter);

twit.stream('statuses/filter', { track: config.keywords.toString() }, (stream) => {
  stream.on("error", (err) => {
    console.log(err);
    throw err;
  });
  let output = twitterStreamHandler.handle(stream);
  output.subscribe(() => console.log(':)'));
});