'use strict';

var chai = require('chai');
var expect = chai.expect;
var sqlite3 = require('sqlite3');
var async = require('async');
const utils = require('../utils');

var StockTicks = require('./stockticks.db.js');
const Symbols = require('../symbols/symbols.db.js');
var db = null;

const TEST_SYMBOL = 'AAPL';
const TEST_BODY = 'I love Steve Jobs!';
const TEST_FLOAT = 99.99;

describe('StockTicks', function() {

  before(() => {
    db = new sqlite3.Database(':memory:');
    db = StockTicks.extends(db);
    db = Symbols.extends(db);
  });

  after(() => {
    db.close();
  });

  describe('StockTicks.extend()', function() {
    it('should make a StockTick table in the db', function(done) {
      const table_name = 'StockTicks';
      const query = `
        SELECT name
          FROM sqlite_master
         WHERE type='table'
           AND name='${table_name}'
      `;
      db.get(query, (err, row) => {
        expect(row.name).to.equal(table_name);
        done();
      });
    });
  });

  describe('StockTicks.insert()', function() {
    it('should insert a row into the StockTick table', function(done) {
      const query = `
        SELECT *
          FROM StockTicks
         WHERE symbol_id IN (
          SELECT id
            FROM Symbols
           WHERE symbol='${TEST_SYMBOL}'
        );
      `;

        function seed(callback) {
          db.Symbols.insert({ symbol: TEST_SYMBOL }, callback);
        }

        function insert(callback) {
          db.StockTicks.insert({
            symbol: TEST_SYMBOL,
            value: TEST_FLOAT
          }, callback);
        }

        function assert(callback) {
          db.get(query, (err, row) => {
            expect(row.value).to.equal(TEST_FLOAT);
            done();
          });
        }

        async.series([seed, insert, assert]);
    });
  });

  describe('StockTicks.find.bySymbol()', function() {
    it('returns the StockTicks with the symbol paramater', function(done) {
      db.Symbols.insert({
        'symbol': TEST_SYMBOL
      });

      db.StockTicks.insert({
        symbol: TEST_SYMBOL,
        value: TEST_FLOAT
      }, function() {
        db.StockTicks.find.bySymbol(TEST_SYMBOL, (err, rows) => {
          if (err) throw err;
          expect(rows[0].value).to.equal(TEST_FLOAT);
          done();
        });
      });

    });
  });

  describe('StockTicks.cull()', function() {
    it('should delete StockTicks older than the given date', function(done) {
      db.Symbols.insert({
        'symbol': TEST_SYMBOL
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const cullAndAssertEmptyResults = function() {
        db.StockTicks.cull(tomorrow, () => {
          db.StockTicks.find.bySymbol(TEST_SYMBOL, (err, rows) => {
            expect(rows.length).to.equal(0);
            done();
          });
        });
      };

      db.StockTicks.insert({
        symbol: TEST_SYMBOL,
        value: TEST_FLOAT
      }, cullAndAssertEmptyResults);
    });
  });
});