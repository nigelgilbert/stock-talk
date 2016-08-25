'use strict';

var utils = require('../utils.js');
var db = null;

/**
 * Creates a Tweets table in the sqlite db, extends it with ORM methods.
 * @param {object} database - a node-sqlite3 database.
 * @returns {object} db - the modified node-sqlite3 database.
 */
module.exports.extends = function(database) {
  db = database;
  db = createTweetTable(db);

  // Extend Tweets api.
  db.Tweets = {
    insert: insertTweet,
    cull: deleteTweetsOlderThan,
    retweet: updateRetweetCount,
    find: {
      bySymbol: findTweetsBySymbol,
      byBody: findTweetsByBody
    },
  };

  return db;
};

function createTweetTable(db) {
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

/**
 * Inserts a Tweet row into the database.
 * @param {object} params - a Tweet specc.
 * @param {string} params.symbol - a stock symbol.
 * @param {string} params.body - the text content of the Tweet.
 * @param {callback} callback - called after db write, handles errors.
 * @returns {object} db - a node-sqlite database for method chaining.
 */
function insertTweet(params, callback) {
  const symbol_name = params.symbol;
  const body = params.body;
  const now = utils.timestamp();
  const query = `
    INSERT INTO Tweets (body, last_accessed, symbol_id)
    VALUES (
      '${body}',
       ${now},
      (SELECT id
         FROM Symbols
        WHERE symbol='${symbol_name}')
    );
  `;
  return db.run(query, callback);
}

/**
 * Tries to find a row in the Tweets table by its symbol.
 * @param {string} symbol_name - a stock symbol.
 * @param {callback} callback - passed an error and an array of Tweets.
 * @returns {object} db - a node-sqlite database for method chaining.
 */
function findTweetsBySymbol(symbol_name, callback) {
  const query = `
    SELECT *
       FROM Tweets
      WHERE symbol_id IN (
        SELECT id
          FROM Symbols
         WHERE symbol='${symbol_name}'
    );
  `;
  return db.all(query, callback);
}

/**
 * Tries to find a row in the Tweets table by its body.
 * @param {string} body - a Tweet body.
 * @param {callback} callback - passed an error and an array of Tweets.
 * @returns {object} db - a node-sqlite database for method chaining.
 */
function findTweetsByBody(body, callback) {
   const query = `
      SELECT *
        FROM tweets
       WHERE body = '${body}'
  `;
  return db.all(query, callback);
}

/**
 * Increments a Tweets' retweet count.
 * @param {string} body - a Tweet body.
 * @param {callback} callback - called after increment occurs, handles errors.
 * @returns {object} db - a node-sqlite database for method chaining.
 */
function updateRetweetCount(body, callback) {
  const query = `
    UPDATE Tweets
       SET retweet_count = retweet_count + 1
     WHERE body = '${body}'
  `;
  return db.run(query, callback);
}

/**
 * Deletes all Tweets older than the given javascript Date object.
 * @param {Date} date - anything older than this will be deleted.
 * @param {callback} callback - called after deletion, handles errors.
 * @returns {object} db - a node-sqlite database for method chaining.
 */
function deleteTweetsOlderThan(date, callback) {
  const timestamp = utils.timestamp(date);
  const query = `
    DELETE FROM Tweets
     WHERE last_accessed < ${timestamp}
  `;
  return db.run(query, callback);
}