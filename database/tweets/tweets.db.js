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
    retweet : updateRetweetCount,
    find: {
      bySymbol: findTweetsBySymbol,
      byBody: findTweetsByBody
    },
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

function insertTweet(params, callback) {
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
  return db.run(query, callback);
}

function findTweetsBySymbol(symbol_name, callback) {
  const query = `
    SELECT *
    FROM Tweets
    WHERE symbol_id IN(
      SELECT id
      FROM Symbols
      WHERE symbol='${symbol_name}'
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

function deleteTweetsOlderThan(date, callback) {
  let timestamp = utils.timestamp(date);
  const query = `
    DELETE FROM Tweets
    WHERE last_accessed < ${timestamp}
  `;
  return db.run(query, callback);
}

function updateRetweetCount(body, callback) {
  var query = `
    UPDATE Tweets
    SET retweet_count = retweet_count + 1
    WHERE body = '${body}'
  `;
  return db.run(query, callback);
}