'use strict';

var fs = require('fs');
var path = require('path');
var Rx = require('rxjs/Rx');
var cache = require('memory-cache');
var keywords = makeKeywordMap(require('./keywords.json').keywords);

// Processes a Node Stream of tweets. Returns an Observable.
exports.handle = function(stream, callback) {
  return makeStreamObservable(stream)
    .filter(isParsable)
    .groupBy(isCached)
    .flatMap(cached => {
      if cached return handleCachedTweets(group);
      else return handleTweets(group);
    });
};

// Returns an object that is used as a keyword map.
function makeKeywordMap(keywords) {
  let map = {};
  for (let keyword of keywords) {
    keyword = keyword.toLowerCase();
    map[keyword] = true;
  }
  return map;
}

// Returns an Observable from a node stream.
function makeStreamObservable(stream) {
  return Rx.Observable.fromEventPattern(
    function add(handler) {
      stream.addListener('data', handler);
    },
    function remove(handler) {
      stream.removeListener('data', handler);
    }
  );
}

// Processes tweets.  Returns an Observable of uncached tweets.
function handleTweets(observable) {
  let tweets = observable.filter(isRelevant);
  tweets.subscribe(cacheTweet);
  tweets.subscribe(tweet => console.log('RELEVANT: ', tweet.text));
  return tweets;
}

// Processes cached tweets. Returns an Observable of cached tweets.
function handleCachedTweets(observable) {
  let cached = observable;
  cached.subscribe(tweet => console.log('CACHED: ', tweet.text));
  return cached;
}

// Boolean. Determines if the tweet contains relevant keywords.
function isRelevant(tweet) {
  let words = tweet.text.toLowerCase().split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i] in keywords)
      return true;
  }
  return false;
}

// Boolean. Determines if the tweet has been processed already.
function isCached(tweet) {
  let cached = cache.get(tweet.text);
  return cached ? true : false;
}

// Boolean.  Determines if there is parsable text in the tweet.
function isParsable(tweet) {
  return (typeof tweet.text !== 'undefined') ? true : false;
}

// Caches the tweet.
function cacheTweet(tweet) {
  cache.put(tweet.text,1, 10000);
}

function updateDatabaseSymbol(cached) {}
function mapToDatabaseSymbol(tweet)   {}