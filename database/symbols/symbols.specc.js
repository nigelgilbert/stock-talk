'use strict';

var chai = require('chai');
var expect = chai.expect;
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(':memory:');
var Symbols = require('./symbols.db.js');

describe('Symbols', function() {

  before(() => {
    db = Symbols.extends(db);
  });

  describe('Symbols.extends()', function() {
    it('should make a Symbols table in the db', function(done) {
      const table_name = 'Symbols';
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

  describe('Symbols.insert()', function() {
    it('Should insert a row into the Symbols table', function(done) {
      const test_symbol = 'AAPL';
      db.Symbols.insert({ symbol: test_symbol });
      const query = `
        SELECT *
          FROM Symbols
         WHERE symbol='${test_symbol}'
      `;
      db.get(query, (err, row) => {
        expect(row.symbol).to.equal(test_symbol);
        done();
      });
    });
  });
});