'use strict';

var fs = require('fs');
var path = require('path');
var Rx = require('rxjs/Rx');
var cache = require('memory-cache');
var keywords = makeKeywordMap(require('../config.json').keywords);
var db = require('../database');
var async = require('async');

// Processes a Node Stream of tweets. Returns an Observable.
exports.handle = function(stream, callback) {
  return makeStreamObservable(stream)
    .filter(isParsable)
    .filter(isRelevant)
    .map(cleanText)  // possibly change
    .groupBy(isCached)
    .flatMap(group$ => {
      if (group$.key) return handleCachedTweets(group$);
      else return handleNewTweets(group$);
    });
};

// Returns an object that is used as a keyword map.
function makeKeywordMap(keywords) {
  let map = new Map();
  for (let keyword of keywords) {
    keyword = keyword.toLowerCase();
    map.set(keyword, true);
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
function handleNewTweets(tweets) {
  tweets.subscribe(cacheTweet);
  tweets.subscribe(tweet => console.log('RELEVANT: ', JSON.stringify(tweet.text)));
  return tweets;
}

  // 1. check if in db
  // 2. if it is, then call db.Tweets.retweet
  // 3. if not, put it in the db
  // 4. cache tweet
function insertOrRetweet(tweet) {
  const cleaned = cleanText(tweet.text);

  async.waterfall([
    function findIfTweetExists(callback) {
      db.Tweets.find.byBody(cleaned, callback);
    },
    function mutateTweetsTable(err, results, callback) {
      if (results.length > 0) {
        db.Tweets.retweet(cleaned, callback);
      } else {
        const row = {};
        db.Tweets.insert(row, callback);
      }
    }
  ], function(err) {
    // if (err) stream errors outs
  });
}

// Processes cached tweets. Returns an Observable of cached tweets.
function handleCachedTweets(observable) {
  let cached = observable;
  cached.subscribe(tweet => console.log('CACHED: ', tweet.text));
  return cached;
}

// Boolean. Determines if the tweet contains any relevant keywords.
function isRelevant(tweet) {
  const words = tweet.text.toLowerCase().split(' ');
  if (words.length < 5) return false;
  for (let i = 0; i < words.length; i++) {
    let word = trimHashtagsAndPunctuation(words[i]);
    if (keywords.has(word)) {
      console.log(words[i]);
      return true;
    }
  }
  return false;
}

function trimHashtagsAndPunctuation(text) {
  const tagsAndPunctuation = /#|[.!,\d]/g;
  return text.replace(tagsAndPunctuation, "");
}

// Prepare tweet text for display.
function cleanText(tweet) {
  const tags = /[$@]\w+:*/g;
  const urls = /(https?[a-zA-Z:/.]*)|/g;
  const retweets = /RT/ig;
  const multispaces = /\s\s+/g;
  const trailingspaces = /^\s|\s$/g;
  const garbage = /\d\w+/ig;
  const unicode = /[^\\x00-\\x7F]/;

  tweet.text = tweet.text
    .replace(tags, "")
    .replace(retweets, "")
    .replace(urls, "")
    .replace(garbage, "")
    .replace(unicode, "")
    .replace(multispaces, " ")
    .replace(trailingspaces, "");

  return tweet;
}

// Boolean. Determines if the tweet has been processed already.
function isCached(tweet) {
  let cleanedTweet = cleanText(tweet);
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

function isStoredInDb(tweet) {
  db.Tweets.find.byBody(body, callback);
}

function updateDatabaseSymbol(cached) {}
function mapToDatabaseSymbol(tweet)   {}