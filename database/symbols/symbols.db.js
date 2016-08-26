'use strict';

var utils = require('../utils.js');
var db = null;

/**
 * Creates a Symbol table in the sqlite db, extends it with ORM methods.
 * @param {object} database - a node-sqlite3 database
 * @returns {object} the modified node-sqlite3 database
 */
module.exports.extends = function(database) {
  db = database;
  db = createSymbolsTable(db);
  db.Symbols = {
    insert: insertSymbol
  };
  return db;
}

function createSymbolsTable(db) {
  return db.run(`
    CREATE TABLE IF NOT EXISTS Symbols (
          id INTEGER PRIMARY KEY,
      symbol TEXT
    );
  `);
}

/**
 * Inserts a Symbol row into the database.
 * @param {object} params - a Tweet entry specc
 * @param {string} params.symbol - a stock symbol
 * @param {callback} callback - called after db write, handles errors
 * @returns {object} a node-sqlite database for method chaining
 */
function insertSymbol(params) {
  const symbol = params.symbol;
  const query = `
    INSERT INTO Symbols (symbol)
    VALUES ('${symbol}')
  `;
  return db.run(query);
}