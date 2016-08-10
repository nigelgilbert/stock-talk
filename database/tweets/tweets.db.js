'use strict';

var utils = require('../utils.js');
var db = null;

module.exports.extends = function(database) {
  db = database;
  db = addTweetsTable(db);

  // Append Tweets api to db we're extending.
  db.Tweets = {
    insert: insertTweet,
    cull: deleteTweetsOlderThan,
    find: {
      byBody: findTweetsBySymbol,
      bySymbol: findTweetsByBody
    }
  };

  return db;
};

function addTweetsTable(db) {
  db.run(`
      CREATE TABLE IF NOT EXISTS Tweets (
      symbol_id INTEGER,
      body TEXT,
      last_accessed INTEGER,
      retweet_count INTEGER DEFAULT 0
    );
  `);
  return db;
}

function insertTweet(params) {
  const symbol_name = params.symbol;
  const body = params.body;
  const now = utils.timestamp();
  const query = `
    INSERT INTO Tweets (symbol_id, body, last_accessed)
    VALUES (
      (SELECT id FROM Symbols WHERE symbol='${symbol_name}'),
      '${body}',
      ${now}
    );
  `;
  return db.run(query);
}

function findTweetsBySymbol(symbol, callback) {
  const query = `
    SELECT *
    FROM Tweets
    WHERE symbol_id IN(
      SELECT id
      FROM Symbols
      WHERE symbol='${symbol}'
    );
  `;
  return db.all(query, callback);
}

function findTweetsByBody(body, callback) {
   const query = `
    SELECT *
    FROM tweets
    WHERE body = '${body}'
  `;
  return db.all(query, callback);
}

function deleteTweetsOlderThan(timestamp) {
  db.run(`
    DELETE FROM Tweets
    WHERE last_accessed > ${timestamp}
  `);
  return db;
}
