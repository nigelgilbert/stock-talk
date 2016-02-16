"use strict";

module.exports = function constructor(database) {
  return database.addCollection("ticks");
}