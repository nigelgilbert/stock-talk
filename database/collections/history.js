"use strict";

var utils = require("../utils");

module.exports = function constructor(database) {
  let history = database.addCollection("history");
  history.create = create;
  history.sync = syncWithYahooFinance;
  // testCreateSync(history, "GOOG");
  return history;
}

function create(symbol, times, closes) {
  this.insert({
    "symbol" : symbol,
    "timestamps" : times,
    "closes" : closes
  });
}

function syncWithYahooFinance(symbol, callback) {
  let previous = this.findOne({ "symbol" : symbol });
  queryFinanceAPI(symbol, (timestamps, closes) => {
    if (previous === "undefined") {
      this.create(symbol, timestamps, closes);
    } else {
      previous.timestamps.push(...diff(timestamps, previous.timestamps));
      previous.closes.push(...diff(closes, previous.closes));
      this.update(previous);
      callback();
    }
  });
}

function diff(latest, previous) {
  return latest.filter(x =>  previous.indexOf(x) < 0);
}

function queryFinanceAPI(symbol, callback) {
  let url = getFinanceQueryURL(symbol);
  utils.request(url, response => {
    let data = JSON.parse(response);
    let timestamps = data.chart.result[0].timestamp;
    let closes = data.chart.result[0].indicators.quote[0].close;
    callback(timestamps, closes);
  });
}

function getFinanceQueryURL(symbol) {
  let { open, close } = getMarketOpenCloseTimes();
  let base = "https://finance-yql.media.yahoo.com/v7/finance/chart/";
  let type = "indicators=close";
  return base + symbol + "?" + "period2" + close + "period1" + open + "&" + type;
}

function getMarketOpenCloseTimes() {
  let today = new Date();
  if (today.getHours() > 5)
    today.setDate(today.getDate() - 1);

  let open = today.setHours(9,0,0,0);
  let close = today.setHours(5,0,0,0);
  return {
    "open": Math.floor(open / 1000),
    "close": Math.floor(close / 1000)
  };
}

function testCreateSync(collection, symbol) {
  let timestamps = [1455201000,1455201060,1455201120];
  let closes = [674.5499877929688,677.2659912109375,676.6099853515625];

  collection.create(symbol, timestamps, closes);
  console.log("CREATED:", collection.findOne({ "symbol" : symbol }));

  collection.sync("GOOG", () => {
    console.log("SUCCESS:", collection.findOne({ "symbol" : "GOOG" }));
  });
}