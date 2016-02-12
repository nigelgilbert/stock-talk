"use strict";

var koa = require("koa");
var serve = require("koa-static");
var io = require("socket.io");
var http = require("http");

///////////////////////////////////////////////////////////////////////////////
// yahoo-finance demo
///////////////////////////////////////////////////////////////////////////////

var yf = require("./yahoo-finance");
yf.stream("SPY,GOOG,AAPL,BAC,FCX,TVIX,GE,QQQ,XIV", "l90", (stream) => {
  stream.on("data", (data) => { console.log(Object.keys(data)[0]); });
  stream.on("error", () =>    { console.log("Error."); });
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
var twitterStreamController = require("./controllers/twitterStream");

var twit = new twitter(config.twitter);

twit.stream("statuses/filter", config.tracking, (stream) => {
  let output = twitterStreamController.handle(stream);
  output.subscribe(() => { console.log(Math.floor(Date.now() / 1000)); });
});

// fire up the server.
server.listen(8080, () => {
  console.log("Server listening on port 8080.");
});

///////////////////////////////////////////////////////////////////////////////
// database demo
///////////////////////////////////////////////////////////////////////////////
var database = require("./database");

// naive test
/*
database.history.insert({ "symbol": "AAPL"});
let test = database.history.findOne({ "symbol": "AAPL" });
console.log(test);
test.symbol = "QQQ";
database.history.update(test);
let updated = database.history.findOne({ "symbol": "QQQ" });
console.log(updated);
*/