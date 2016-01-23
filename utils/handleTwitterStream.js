"use strict"

var fs = require("fs");
var path = require("path");
var rx = require("rxjs/Rx");
var cache = require("memory-cache");
var keywords = makeKeywordMap(require("./keywords.json").keywords);

// Returns a keyword object javascript map.
function makeKeywordMap(keywords) {
  let map = {};
  for (let keyword of keywords) {
    keyword = keyword.toLowerCase();
    map[keyword] = null;
  }
  return map;  
};

// Returns an observable of a node stream of tweet objects.
function makeStreamObservable(stream) {
  return rx.Observable.fromEventPattern(
    function add(handler) {
      stream.addListener("data", handler)
    },
    function remove(handler) {
      stream.removeListener("data", handler)
    } 
  );
};

// Returns an observable of uncached tweets.
function makeUncachedObservable(observable) {
  let uncached = observable
    .filter(isRelevant);

  uncached.subscribe(cacheTweet);
  uncached.subscribe(tweet => console.log("RELEVANT: ", tweet.text));
  return uncached;
};

// Returns an observable of tweets.
function makeCachedObservable(observable) {
  let cached = observable;
  cached.subscribe(tweet => console.log("CACHED: ", tweet.text));
  return cached;
};

// Filter operator by relevancy.
function isRelevant(tweet) {
  let words = tweet.text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (words[i].toLowerCase() in keywords)
      return true;
  }
  return false;
};

// Filter operator by if cached or not.
function isCached(tweet) {
  let cached = cache.get(tweet.text);
  return (cached === null) ? false : true;
};

function cacheTweet(tweet) {
  cache.put(tweet.text, tweet.text, 10000);
};

function updateDatabaseSymbol(cached) { };

function mapToDatabaseSymbol(tweet)   { };

// Process the tweet stream.
module.exports = function handleTwitterStream(stream) {
  let tweets = makeStreamObservable(stream)
    .groupBy(isCached);

  tweets.subscribe(observable => {
    if (observable.key === true)
      makeCachedObservable(observable);
    else if (observable.key === false)
      makeUncachedObservable(observable);
  });
};