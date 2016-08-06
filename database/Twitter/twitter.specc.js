var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var twitter = require('/db.js');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(':memory:');
var twitterdb = require('./twitter.db.js');

describe('Twitter sqlite wrapper', function() {
  it('should make a Twitter table', function() {
    db = twitterdb.extends(db);

    // query to test if the table is created
    db.run(`
      SELECT Twitters
      FROM sqlite_master 
      WHERE type='table' 
      AND name='table_name'
    `);
  });
});