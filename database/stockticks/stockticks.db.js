'use strict';

const utils = require('../utils');
var db = null;

module.exports.extends = function(database) {
  db = database;
  db = addStockTickTable(db);
  db.StockTicks = {
    insert: insertStockTick,
    cull: deleteStockTicksOlderThan,
    find: {
      bySymbol: findStockTicksBySymbol
    }
  };
  return db;
};

function addStockTickTable(db) {
  return db.run(`
    CREATE TABLE IF NOT EXISTS StockTicks (
      last_accessed INTEGER,
          symbol_id INTEGER,
              value REAL
    );
  `);
}

function findStockTicksBySymbol(symbol_name, callback) {
  const query = `
    SELECT *
    FROM StockTicks
    WHERE symbol_id IN (
      SELECT id
      FROM Symbols
      WHERE symbol='${symbol_name}'
    );
  `;
  return db.all(query, callback);
}

function insertStockTick(params, callback) {
  const symbol_name = params.symbol;
  const value = params.value;
  const now = utils.timestamp();
  const query = `
    INSERT INTO StockTicks (symbol_id, value, last_accessed)
    VALUES ((SELECT id FROM Symbols WHERE symbol = '${symbol_name}'), ${value}, ${now})
  `;
  return db.run(query, callback);
}

function deleteStockTicksOlderThan(date, callback) {
  const timestamp = utils.timestamp(date);
  const query = `
    DELETE FROM StockTicks
    WHERE last_accessed < ${timestamp} 
  `;
  db.run(query, callback);
}