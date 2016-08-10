'use strict';

var chai = require('chai');
var expect = chai.expect;
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(':memory:');
var Tweets = require('./tweets.db.js');
var Symbols = require('../symbols/symbols.db.js');

describe('Twitter', function() {

  before(() => {
    db = Tweets.extends(db);
    db = Symbols.extends(db);
  });

  describe('Tweets.extends()', function() {
    it('should make a Twitter table in the db', function(done) {
      const table_name = 'Tweets';
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

  describe('Tweets.insert()', function() {
    it('should insert a row into the Tweets table', function(done) {
      const test_symbol = 'AAPL';
      const test_body = 'I love Steve!';

      db.Symbols.insert({
        symbol: test_symbol
      });

      db.Tweets.insert({
        symbol: test_symbol,
        body: test_body
      });

    const query = `
      SELECT *
      FROM Tweets
      WHERE symbol_id IN(
        SELECT id
        FROM Symbols
        WHERE symbol='${test_symbol}'
      );
    `;

      db.get(query, (err, row) => {
        expect(row.body).to.equal(test_body);
        done();
      });
    });
  });

  describe('Tweets.find.bySymbol()', function() {
    it('returns Tweets associated with a Symbol', function(done) {
      const test_symbol = 'AAPL';
      const test_body = 'I love Steve Jobs!';

      db.Tweets.insert({
        'symbol': test_symbol,
        'body': test_body
      });

      db.Tweets.find.bySymbol(test_symbol, (err, rows) => {
        console.log(rows);
        expect(rows[0].symbol).to.equal(test_symbol);
        done();
      });
    });
  });
});