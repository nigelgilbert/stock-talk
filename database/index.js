var StockTicks = require('./stockticks/stockticks.db.js');
var Tweets = require('./tweets/tweets.db.js');
var Symbols = require('./symbols/symbols.db.js');
var sqlite3 = require('sqlite3');
var utils = require('./utils');

const db = new sqlite3.Database('database/stocktalk.db');
db = StockTicks.extends(db);
db = Symbols.extends(db);
db = Tweets.extends(db);

module.exports = db;