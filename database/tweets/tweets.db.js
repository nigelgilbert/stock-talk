'use strict';

var utils = require('../utils.js');
var db = null;

module.exports.extends = function(database) {
  db = database;
  db = addTweetsTable(db);

  db.Tweets = {
    insert: insertTweet
  };

  return db;
};

function addTweetsTable(db) {
  db.run(`
      CREATE TABLE IF NOT EXISTS Tweets (
      symbol INTEGER,
      body TEXT,
      last_accessed INTEGER,
      retweet_count INTEGER DEFAULT 0
    );
  `);
  return db;
}

function insertTweet(params) {
  const symbol = params.symbol;
  const body = params.body;
  const now = utils.timestamp();
  const query = `
    INSERT INTO Tweets (symbol, body, last_accessed)
    VALUES (
      (SELECT symbol FROM Symbols WHERE symbol='${symbol}'),
      '${body}',
      ${now}
    );
  `;
  return db.run(query);
}