'use strict';

var chai = require('chai');
var expect = chai.expect;
var sqlite3 = require('sqlite3');
var async = require('async');

var db = new sqlite3.Database(':memory:');
var Tweets = require('./tweets.db.js');
var Symbols = require('../symbols/symbols.db.js');

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

  function seed(callback) {
    db.Symbols.insert({
      symbol: TEST_SYMBOL
    }, callback);
  }

  function insert(callback) {
    db.Tweets.insert({
      symbol: TEST_SYMBOL,
      body: TEST_BODY
    }, callback);
  }

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
      function assert() {
        db.get(query, (err, row) => {
          expect(row.body).to.equal(TEST_BODY);
          done();
        });
      }
      async.series([seed, insert, assert]);
    });
  });

  describe('Tweets.find.bySymbol()', function() {
    it('returns Tweets associated with a Symbol', function(done) {
      function assert() {
        db.Tweets.find.bySymbol(TEST_SYMBOL, (err, rows) => {
          expect(rows[0].body).to.equal(TEST_BODY);
          done();
        });
      }
      async.series([seed, insert, assert]);
    });
  });

  describe('Tweets.find.byBody()', function() {
    it('returns the tweet with that body', function(done) {
      function assert() {
        db.Tweets.find.byBody(TEST_BODY, (err, rows) => {
          expect(rows[0].body).to.equal(TEST_BODY);
          done();
        });
      }
      async.series([seed, insert, assert]);
    });
  });

  describe('Tweets.cull()', function() {
    it('should delete tweets older than the given date', function(done) {
      function cull(callback) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        db.Tweets.cull(tomorrow, callback);
      }
      function assert() {
        db.Tweets.find.bySymbol(TEST_SYMBOL, (err, rows) => {
          expect(rows.length).to.equal(0);
          done();
        });
      }
      async.series([seed, insert, cull, assert]);
    });
  });

  describe('Tweets.retweet', function() {
    it('should increment a tweets retweet count', function(done) {
      const RT_BODY = "RT: " + TEST_BODY;
      function insert(callback) {
        db.Tweets.insert({
          symbol: TEST_SYMBOL,
          body: RT_BODY
        }, callback);
      }
      function retweet(callback) {
        db.Tweets.retweet(RT_BODY, callback);
      }
      function assert() {
        db.Tweets.find.byBody(RT_BODY, function(err, row) {
          expect(row[0].retweet_count).to.equal(1);
          done();
        });
      }
      async.series([seed, insert, retweet, assert]);
    });
  });
});