'use strict';

var Rx = require('rxjs/Rx');
let log$ = new Rx.Subject; 

module.exports.log = function(params) {
  const defaults = {
    symbol: null,
    table: null,
    query: null
  };
  const entry = Object.assign({}, defaults, params);
  log$.onNext(entry);
};

module.exports.observe = function(symbols) {
  return log$
    .filter(entry => symbols.includes(entry.symbol))
    .asObservable();
};

// Creates a timestamp with time t, or now if t is undefined.
// Timestamps in seconds.
module.exports.timestamp = function (t) {
  var date;
  if (typeof t === 'undefined') {
    date = new Date();
  } else {
    date = new Date(t);
  }
  return date.getTime(date) / 1000;
};