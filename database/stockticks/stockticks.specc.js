'use strict';

var chai = require('chai');
var expect = chai.expect;
var sqlite3 = require('sqlite3');

var StockTicks = require('./stockticks.db.js');
var db = null;

describe('StockTicks', function() {

  before(() => {
    db = new sqlite3.Database(':memory:');
    db = StockTicks.extends(db);
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

  after(() => {
    db.close();
  });
});