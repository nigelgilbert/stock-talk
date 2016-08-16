'use strict';

var db = null;

module.exports.extends = function(database) {
  db = database;
  db = addStockTickTable(db);
  db.StockTicks = {
    // find: {
    //   bySymbol: findStockTicksBySymbol
    // }
  };
  return db;
};

function addStockTickTable(db) {
  return db.run(`
    CREATE TABLE IF NOT EXISTS StockTicks (
      symbol_id Integer,
      value REAL
    );
  `);
}

function insertStockTick(symbol_name, value) {
  var query = `
    INSERT INTO Stock_Ticks (symbol_id, value)
    VALUES ((SELECT symbol_id FROM Symbols WHERE symbol = ?), ?)
  `;
  db.run(query, symbol_name, value);
}

function deleteStockTicksOlderThan(timestamp) {
  var query = `
    DELETE FROM Stock_Ticks
    WHERE last_accessed > ?
  `;
  db.run(query, timestamp);
}