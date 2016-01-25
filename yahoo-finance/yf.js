"use strict";

var http = require("http");
var StreamParser = require("./parser");
var querydict = require("./querydict");

function makePath(symbol, querycode) {
  if (!(querycode in querydict))
    throw new Error("Invalid querycode '" + querycode + "'");

  let streamURL = "/streamer/1.0?s=" + symbol +
                  "&k=" + querycode +
                  "&callback=parent.yfs_u1f" + 
                  "&mktmcb=parent.yfs_mktmcb" +
                  "&gencallback=parent.yfs_gencb";

  return streamURL;
};

function makeFinanceStream(symbol, querycode) {
  let stream = new StreamParser();
  let path = makePath(symbol, querycode);
  let options = {
    hostname: "streamerapi.finance.yahoo.com",
    path: path,
    "Access-Control-Allow-Origin": "http://finance.yahoo.com",
    "Connection": "keep-alive"
  };

  http.get(options, (res) => {
      res.on("data",  (chunk) =>  { stream.recieve(chunk) });
      res.on("error", (err) =>    { stream.emit("error") });  
      res.on("end",   () =>       { stream.emit("end") });
    });

  return stream;
};

module.exports.stream = function(symbol, querycode, callback) {
  let stream = makeFinanceStream(symbol, querycode);
  callback(stream);
};