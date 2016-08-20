'use strict';

var utils = require('../utils.js');
var db = null;

module.exports.extends = function(database, callback) {
  db = database;
  db = addSymbolsTable(db);
  db.Symbols = {
    insert: insertSymbol
  };
  if (callback) callback(null, db);
  return db;
};

function addSymbolsTable(db) {
  return db.run(`
    CREATE TABLE IF NOT EXISTS Symbols (
      id INTEGER PRIMARY KEY,
      symbol TEXT
    );
  `);
};

function insertSymbol(params) {
  const symbol = params.symbol;
  const query = `
    INSERT INTO Symbols (symbol)
    VALUES ('${symbol}')
  `;
  db.run(query);
};