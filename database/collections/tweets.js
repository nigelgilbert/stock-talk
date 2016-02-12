"use strict";

module.exports = function initialize(database) {
  return database.addCollection("tweets");
}