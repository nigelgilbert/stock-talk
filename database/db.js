'use strict';

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(':memory:');

function createTables() {
  db.serialize(function() {
    db.run(`
        CREATE TABLE IF NOT EXISTS Tweets (
        symbol_id INTEGER,
        last_accessed INTEGER,
        body TEXT,
        retweet_count INTEGER DEFAULT 0
      );
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS Symbols (
        symbol_id INTEGER PRIMARY KEY,
        symbol TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Stock_Ticks (
        symbol_id INTEGER,
        value REAL
      );
    `);
  });
}

// Creates a timestamp with time t, or now if t is undefined.
function timestamp(t) {
  var date;
  if (typeof t !== "undefined") {
    date = new Date(t);
  } else {
    date = new Date();
  }
  return date.getTime(date); 
}

// Wraps a node-sqlite "get" query in a promise.
function promisifySqliteGet(query, params) {
  params = params || {};
  return new Promise((resolve, reject) => {
    db.get(query.run(params), (err, row) => {
      if (err) throw err;
      resolve(row);
    });
  });
}

// Wraps a node-sqlite "all" query in a promise.
function promisifySqliteAll(query, params) {
  params = params || {};
  return new Promise((resolve, reject) => {
    db.all(query.run(params), (err, row) => {
      if (err) throw err;
      resolve(row);
    });
  });
}

function insertTweet(symbol_name, body) {
  var query = `
    INSERT INTO Tweets (symbol_id, body, last_accessed)
    VALUES ((SELECT symbol_id FROM Symbols WHERE symbol = ?), ?, ?)
  `;
  db.run(query, symbol_name, body, timestamp());
}

function deleteTweetsOlderThan(timestamp) {
  var query = `
    DELETE FROM Tweets
    WHERE last_accessed > ?
  `;
  db.run(query, timestamp);
}

function findTweetByBody(body) {
  var query = `
    SELECT *
    FROM tweets
    WHERE body = ?
  `;
  return promisifySqliteGet(query, body);
}

function findTweetBySymbol(symbol) {
  var query = `
    SELECT *
    FROM Tweets
    WHERE symbol_id IN(
      SELECT symbol_id
      FROM Symbols
      WHERE symbol = ?
  `;
  return promisifySqliteGet(query, symbol);
}

function updateRetweetCount(body) {
  var query = `
    UPDATE Tweets
    SET retweet_count = retweet_count + 1
    WHERE body = ?
  `;
  db.run(query, body);
}

function insertStockTick(symbol_name, value) {
  var query = `
    INSERT INTO Stock_Ticks (symbol_id, value)
    VALUES ((SELECT symbol_id FROM Symbols WHERE symbol = ?), ?)
  `;
  db.run(query, symbol_name, value);
}

function deleteStockTicksOlderThan(timestamp) {
  var query = `
    DELETE FROM Stock_Ticks
    WHERE last_accessed > ?
  `;
  db.run(query, timestamp);
}

// Scratch function.
// TODO: Remove
function debug() {
  db.serialize(function() {
    var query = `
      INSERT INTO Symbols (symbol_id, symbol)
      VALUES (1, ?)
    `;

    db.run(query, "test");

    db.get(`
      SELECT symbol_id, symbol FROM Symbols
      WHERE symbol_id=1
    `, function(err, row) {
      if (err) console.log(err);
      if (typeof row !== 'undefined') {
        console.log(row.symbol_id);
      }
    });
  });
}

// TODO: initialize the Symbols using a config file.
exports.init = function(config) {
  createTables();
  debug();
};

exports.Tweets = {};
exports.StockTicks = {};
exports.Symbols = {};

exports.Tweets.insert = insertTweet;
exports.Tweets.cull = deleteTweetsOlderThan;
exports.Tweets.byBody = findTweetByBody;
exports.Tweets.bySymbol = findTweetBySymbol;
exports.Tweets.updateRt = updateRetweetCount;

exports.StockTicks.insert = insertStockTick;
exports.cull = deleteStockTicksOlderThan;