'use strict';

var utils = require('../utils.js');
var db = null;

module.exports.extends = function(database) {
  db = database;
  db = createSymbolsTable(db);
  db.Symbols = {
    insert: insertSymbol
  };
  return db;
};

function createSymbolsTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS Symbols (
      id INTEGER PRIMARY KEY,
      symbol TEXT
    );
  `);
  return db;
};


function insertSymbol(params) {
  const symbol = params.symbol;
  const query = `
    INSERT INTO Symbols (symbol)
    VALUES ('${symbol}')
  `;
  db.run(query);
};