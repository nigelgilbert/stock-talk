"use strict";

var db = require("./database");
var yf = require("./yahoo-finance");
var express = require("express");
var path = require("path");

var app = express();
app.use(express.static("dist/"));

// Main execution thread.
setInterval(function main() {
  const symbols = getMostRelevantSymbols(10);
  updateHistoryCollection(symbols);
  updateFinanceTracking(symbols);
}, 20 * 1000);

// Express route. Serve static content.
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, "dist/")
  });
});

// Express route. Returns a list of initial symbols.
app.get("/api/top", (req, res) => {
  let top = history.chain().sort(byRecordLastUpdate).limit(10);
  res.json({ symbols: JSON.stringify(top) });
});

function updateFinanceTracking(symbols) {
  let query = getTwitterTrackingString(symbols);
  return yf.stream(query, (stream) => {
    stream.on("data", (data) => { console.log(Object.keys(data)[0]); });
    stream.on("error", () =>    { console.log("Error."); });
  });
}

function getTwitterTrackingString(symbols) {
  let query = symbols.reduce(symbol => {
    return String(symbol) + ",";
  });
  return query.slice(0,-1);
}

function updateHistoryCollection(symbols) {
  symbols.forEach(symbol => {
    db.history.sync(symbol, () => clearTicks(symbol));
  });
}

function getMostRelevantSymbols(count) {
  const relevant = db.tweets.byFrequency.applyWhere(tweet => {
    return tweet.symbol != null;
  });
  const results = relevant.limit(count).data();
  return results.map(tweet => tweet.symbol);
}

function clearTicks(symbol) {
  db.ticks.removeWhere(tick => tick.symbol === symbol);
}

function byRecordLastUpdate(left, right) {
  let leftTimestamp = db.utils.getLastTimeModifed(left);
  let secondTimestamp = db.utils.getLastTimeModifed(right);
  if (leftTimestamp === secondTimestamp) return 0;
  if (leftTimestamp > secondTimestamp) return 1;
  if (leftTimestamp < secondTimestamp) return -1;
}