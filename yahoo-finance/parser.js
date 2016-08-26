'use strict';

/**
 * Yahoo Finance stream parser.  Cleans up the yucky HTML documents that
 * the finance API uses to encode stock data. Emits JSON on data events.
 *
 * Inherits from EventEmitter to implement a stream interface.
 * https://nodejs.org/api/stream.html
 */
var EventEmitter = require('eventemitter3');
var utf8 = require('utf8');
var util = require('util');

module.exports = StreamParser;

function StreamParser() {
  EventEmitter.call(this);
  this.buffer = '';
  return this;
}

util.inherits(StreamParser, EventEmitter);
StreamParser.END = '{}</script>';
StreamParser.ENDLENGTH = 12;

StreamParser.prototype.recieve = function(chunk) {
  this.buffer += chunk.toString('utf8');
  let index = this.buffer.indexOf(StreamParser.END);
  if (index > -1) {
    let json = this._parseHTML(this.buffer.slice(0, index));
    this.buffer = this.buffer.slice(index + StreamParser.ENDLENGTH);
    if (json) {
      this.emit('data', json);
    } else {
      this.emit('error');
    }
  }
};

StreamParser.prototype._parseHTML = function(markup) {
  if (markup.indexOf('yfs_u1f') > -1) {
    // Grab the JSON-like data payload from parenthesis.
    let unformatted = markup.match(/.*?\((.*?)\)/)[1];
    // Wrap quotes around the query symbol to make a parsable JSON string.
    let formatted = unformatted.replace(/(\w\d\d)/, (match) => {
      return '"' + match + '"';
    });
    let json = JSON.parse(formatted);
    return json;
  }
};