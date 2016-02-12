"use strict";

var loki = require("lokijs");
var db = new loki("loki.json");

module.exports.history = require("./collections/history.js")(db);
module.exports.keywords = require("./collections/keywords.js")(db);
module.exports.ticks = require("./collections/ticks.js")(db);
module.exports.tweets = require("./collections/tweets.js")(db);
module.exports.companies = require("./collections/companies.js")(db);