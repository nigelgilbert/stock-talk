'use strict';

// Creates a timestamp with time t, or now if t is undefined.
module.exports.timestamp = function (t) {
  var date;
  if (typeof t === 'undefined') {
    date = new Date();
  } else {
    date = new Date(t);
  }
  return date.getTime(date);
}
