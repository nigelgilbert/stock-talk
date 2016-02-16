"use strict";

let jsonKeywords = require("../data/keywords.json").keywords;

module.exports = function constructor(database) {
  let keywords = database.addCollection("keywords");
  populateFromJSON(keywords);
  return keywords;
}

function populateFromJSON(collection) {
  for (let keyword of jsonKeywords) {
   collection.insert({ "keyword" : keyword.toLowerCase() });
  }
}