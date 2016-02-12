"use strict";

let jsonKeywords = require("../data/keywords.json").keywords;

module.exports = function initialize(database) {
  let keywords = database.addCollection("keywords");
  for (let keyword of jsonKeywords) {
    keywords.insert({ "keyword" : keyword.toLowerCase() });
  }
  return keywords;
}