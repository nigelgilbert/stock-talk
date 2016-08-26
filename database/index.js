var StockTicks = require('./stockticks/stockticks.db.js');
var Tweets = require('./tweets/tweets.db.js');
var Symbols = require('./symbols/symbols.db.js');
var sqlite3 = require('sqlite3');
const utils = require('./utils');

module.export = (function() {
  var db = new sqlite3.Database('database/stocktalk.db');
  db = StockTicks.extends(db);
  db = Symbols.extends(db);
  db = Tweets.extends(db);
  return db;
})();