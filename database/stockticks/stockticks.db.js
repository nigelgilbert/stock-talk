'use strict';

const utils = require('../utils');
var db = null;

module.exports.extends = function(database) {
  db = database;
  db = createStockTickTable(db);
  db.StockTicks = {
    insert: insertStockTick,
    cull: deleteStockTicksOlderThan,
    find: {
      bySymbol: findStockTicksBySymbol
    }
  };
  return db;
};

function createStockTickTable(db) {
  return db.run(`
    CREATE TABLE IF NOT EXISTS StockTicks (
          symbol_id INTEGER,
              value REAL,
      creation_time INTEGER
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
    INSERT INTO StockTicks (value, creation_time, symbol_id)
    VALUES (
      ${value},
      ${now},
      (SELECT id
         FROM Symbols
        WHERE symbol = '${symbol_name}')
    );
  `;
  return db.run(query, callback);
}

function deleteStockTicksOlderThan(date, callback) {
  const timestamp = utils.timestamp(date);
  const query = `
    DELETE FROM StockTicks
          WHERE creation_time < ${timestamp}
  `;
  return db.run(query, callback);
}