"use strict";

module.exports = function constructor(database) {
  let tweets = database.addCollection("tweets");
  let frequencyView = tweets.addDynamicView("freqView", true);
  tweets.byFrequency = frequencyView.applySort(compareTweetsByFreq).
  return tweets;
}

function compareTweetsByFreq(first, second) {
  if (first.frequency === second.frequency) return 0;
  if (first.frequency > second.frequency) return 1;
  if (first.frequency < second.frequency) return -1;
}