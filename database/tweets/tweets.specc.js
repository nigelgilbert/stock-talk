'use strict';

var chai = require('chai');
var expect = chai.expect;
var sqlite3 = require('sqlite3');
var async = require('async');

var db = new sqlite3.Database(':memory:');
const Tweets = require('./tweets.db.js');
const Symbols = require('../symbols/symbols.db.js');

const TEST_SYMBOL = 'AAPL';
const TEST_BODY = 'I love Steve Jobs!';

describe('Tweets', function() {

  before(() => {
    db = Tweets.extends(db);
    db = Symbols.extends(db);
  });

  after(() => {
    db.close();
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
      const query = `
        SELECT *
          FROM Tweets
         WHERE symbol_id IN (
          SELECT id
            FROM Symbols
           WHERE symbol='${TEST_SYMBOL}'
        );
      `;

      db.Symbols.insert({
        symbol: TEST_SYMBOL
      });

      db.Tweets.insert({
          symbol: TEST_SYMBOL,
          body: TEST_BODY
        }, function() {
            db.get(query, (err, row) => {
              expect(row.body).to.equal(TEST_BODY);
              done();
            });
        });
    });
  });

  describe('Tweets.find.bySymbol()', function() {
    it('returns Tweets associated with a Symbol', function(done) {
      db.Symbols.insert({
        'symbol': TEST_SYMBOL
      });

      db.Tweets.insert({
        symbol: TEST_SYMBOL,
        body: TEST_BODY
      }, function() {
        db.Tweets.find.bySymbol(TEST_SYMBOL, (err, rows) => {
          expect(rows[0].body).to.equal(TEST_BODY);
          done();
        });
      });
    });
  });

  describe('Tweets.find.byBody()', function() {
    it('returns the tweet with that body', function(done) {
      db.Symbols.insert({
        'symbol': TEST_SYMBOL
      });

      db.Tweets.insert({
        symbol: TEST_SYMBOL,
        body: TEST_BODY
      }, function() {
        db.Tweets.find.byBody(TEST_BODY, (err, rows) => {
          expect(rows[0].body).to.equal(TEST_BODY);
          done();
        });
      });
    });
  });

  describe('Tweets.cull()', function() {
    it('should delete tweets older than the given date', function(done) {
      db.Symbols.insert({
        'symbol': TEST_SYMBOL
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const cullAndAssertEmptyResults = function() {
        db.Tweets.cull(tomorrow, () => {
          db.Tweets.find.bySymbol(TEST_SYMBOL, (err, rows) => {
            expect(rows.length).to.equal(0);
            done();
          });
        });
      };

      db.Tweets.insert({
        symbol: TEST_SYMBOL,
        body: TEST_BODY
      }, cullAndAssertEmptyResults);
    });
  });

  describe('Tweets.retweet', function() {
    it('should increment a tweets retweet count', function(done) {
      db.Symbols.insert({
        'symbol': TEST_SYMBOL
      });

      const RT_BODY = "RT: " + TEST_BODY;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const RetweetAndAssertIncremented = function() {
        db.Tweets.retweet(RT_BODY, function() {
          db.Tweets.find.byBody(RT_BODY, function(err, row) {
            expect(row[0].retweet_count).to.equal(1);
            done();
          });
        });
      };

      db.Tweets.insert({
        symbol: TEST_SYMBOL,
        body: RT_BODY
      }, RetweetAndAssertIncremented);
    });
  });
});