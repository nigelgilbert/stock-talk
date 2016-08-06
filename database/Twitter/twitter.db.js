'use strict';

module.exports.extends = function(db) {
  createTwitterTable(db);
  return db;
};

function createTwitterTable(db) {
  db.run(`
        CREATE TABLE IF NOT EXISTS Tweets (
        symbol_id INTEGER,
        last_accessed INTEGER,
        body TEXT,
        retweet_count INTEGER DEFAULT 0
      );
  `);
}