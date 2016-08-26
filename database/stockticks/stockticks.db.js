'use strict';

const utils = require('../utils');
var db = null;

/**
 * Creates a StockTick table in the sqlite db, extends it with ORM methods.
 * @param {object} database - a node-sqlite3 database
 * @returns {object} the modified node-sqlite3 database
 */
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

/**
 * Inserts a StockTick row into the database for a yahoo finance event.
 * @param {object} params - a StockTick event specc
 * @param {string} params.symbol - a stock symbol
 * @param {string} params.value - the dollar value of the event
 * @param {callback} callback - called after db write, handles errors
 * @returns {object} a node-sqlite database for method chaining
 */
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

/**
 * Tries to find a row in the StockTicks table by its symbol.
 * @param {string} symbol_name - a stock symbol
 * @param {callback} callback - passed an error or an array of Tweets
 * @returns {object} a node-sqlite database for method chaining
 */
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

/**
 * Deletes all StockTicks older than the given javascript Date object.
 * @param {Date} date - anything older than this will be deleted
 * @param {callback} callback - called after deletion, handles errors
 * @returns {object} a node-sqlite database for method chaining
 */
function deleteStockTicksOlderThan(date, callback) {
  const timestamp = utils.timestamp(date);
  const query = `
    DELETE FROM StockTicks
          WHERE creation_time < ${timestamp}
  `;
  return db.run(query, callback);
}