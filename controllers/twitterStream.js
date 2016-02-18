"use strict";

var cache = require("memory-cache");
var db = require("../database");
var Rx = require("rxjs/Rx");

// Returns an Observable from a node stream.
function makeStreamObservable(stream) {
  return Rx.Observable.fromEventPattern(
    function add(handler) {
      stream.addListener("data", handler);
    },
    function remove(handler) {
      stream.removeListener("data", handler);
    }
  );
}

function isRelevant(tweet) {
  let words = tweet.text.toLowerCase().split(" ");
  for (let i = 0; i < words.length; i++) {
    let result =  ({ "keyword" : words[i] });
    if (result !== null) return true;
  }
  return false;
}

function clean(text) {
  let tags = /[$@]\w+:*/g;
  let urls = /https?[a-zA-Z:/.]*/g;
  let multispaces = /\s\s+/g;
  let hashes = /[0-9]\w+/g;
  return text
    .replace(tags, "")
    .replace(urls, "")
    .replace(hashes, "")
    .replace(multispaces, " ");
}

// Boolean. Determines if the tweet has been processed already.
function isCached(tweet) {
  let cached = cache.get(clean(tweet.text));
  return (cached !== null) ? true : false;
}

// Caches the tweet.
function cacheTweet(tweet) {
  return cache.put(clean(tweet.text), true, 10000);
}

// Boolean.  Determines if there is parsable text in the tweet.
function isParsable(tweet) {
  return (typeof tweet.text !== "undefined") ? true : false;
}

// Process tweets.  Returns an Observable of uncached tweets.
function handleNewTweets(tweets) {
  let relevant = tweets.filter(isRelevant);
  relevant.subscribe(cacheTweet);
  relevant.subscribe(tweet => console.log("R:", clean(tweet.text)));
  return relevant;
}

// Process cached tweets. Returns an Observable of cached tweets.
function handleCachedTweets(tweets) {
  tweets.subscribe(tweet => console.log("C:", clean(tweet.text)));
  return tweets;
}

// Processes a Node Stream of tweets. Returns an Observable.
module.exports.handle = function(stream) {
  return makeStreamObservable(stream)
    .filter(isParsable)
    .groupBy(isCached)
    .flatMap(group => {
      if (group.key === true) return handleCachedTweets(group);
      else if (group.key === false) return handleNewTweets(group);
    });
}