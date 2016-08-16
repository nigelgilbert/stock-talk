'use strict';

var http = require('http');
var StreamParser = require('./parser');
var querydict = require('./querydict');

function makePath(symbol, querycode) {
  if (!(querycode in querydict)) {
    throw new Error('Invalid querycode "' + querycode + '"');
  }

  const streamURL = '/streamer/1.0?s=' + symbol + '&k=' + querycode +
                    '&callback=parent.yfs_u1f&mktmcb=parent.yfs_mktmcb' +
                    '&gencallback=parent.yfs_gencb';

  return streamURL;
}

function makeFinanceStream(symbol, querycode) {
  let parser = new StreamParser();
  const path = makePath(symbol, querycode);
  const options = {
    path: path,
    Connection: 'keep-alive',
    hostname: 'streamerapi.finance.yahoo.com',
    'Access-Control-Allow-Origin': 'http://finance.yahoo.com'
  };

  http.get(options, (res) => {
    res.on('data', (chunk) => {
      parser.recieve(chunk);
    });
    res.on('error', (err) => {
      parser.emit('error');
    });
    res.on('end', () => {
      parser.emit('end');
    });
  });

  return parser;
}

module.exports.stream = function(symbol, querycode, callback) {
  let stream = makeFinanceStream(symbol, querycode);
  callback(stream);
};