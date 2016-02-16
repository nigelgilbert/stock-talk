"use strict";

var https = require("https");

module.exports.request = function(url, callback) {
  https.get(url, response => {
    let body = "";
    response.on("data", chunk =>  { body += chunk });
    response.on("error", error => { throw error });
    response.on("end", () =>      { callback(body) });
  });
}

module.exports.cull = function(collection, expiration) {
  let now = new Date();
  let modified = 0;
  collection.removeWhere(record => {
    modified = getLastTimeModifed(record);
    return ((now - modified) > (expiration * 60000));
  });
}

module.exports.getLastTimeModifed = function(record) {
  if (record.revision > 0) {
    return record.meta.updated;
  } else {
    return record.meta.created;
  }
}