"use strict";

var koa = require("koa");
var serve = require("koa-static");
var io = require("socket.io");
var http = require("http");
var path = require("path");
var fs = require("fs");

///////////////////////////////////////////////////////////////////////////////
// yahoo-finance demo
///////////////////////////////////////////////////////////////////////////////

var yf = require("./yahoo-finance");
yf.stream("SPY,GOOG,AAPL,BAC,FCX,TVIX,GE,QQQ,XIV", "l90", (stream) => {
  stream.on("data",   (data) => { console.log(data) });
  stream.on("error",  () =>     { console.log("Error.") });
});

// koa app for static files
var app = koa();

app.use(serve("dist/", {
  index: "index.html"
}));

var server = http.createServer(app.callback());

///////////////////////////////////////////////////////////////////////////////
// websocket demo
///////////////////////////////////////////////////////////////////////////////

var socket = io(server);

socket.on("connection", (client) => {

  console.log("User connected.");

  client.on("message", (msg) => {
    socket.emit("broadcast", msg);
    console.log("message: " + msg);
  });

  client.on("disconnect", () => {
    console.log("user disconnected");
  });
});

///////////////////////////////////////////////////////////////////////////////
// twitter stream demo
///////////////////////////////////////////////////////////////////////////////

var twitter = require("twitter");
var config = require("./config");
var twitterStreamController = require("./utils/twitterStreamController");

var twit = new twitter(config.twitter);

twit.stream("statuses/filter", { track: "justin" }, (stream) => {
  let output = twitterStreamController.handle(stream);
  output.subscribe(() => console.log("tweet"));
});


// fire up the server.
server.listen(8080, () => { 
  console.log("Server listening on port 8080.")
});