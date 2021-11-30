const TweetStream = require('./lib/twitter');
const WS = require('./lib/ws');

const AUTH_DATA = process.env['TWEETPOLITE_AUTH'] ? JSON.parse(process.env['TWEETPOLITE_AUTH']) : require('./twitterauth.json');

var ws = new WS({
  port: process.env.PORT || 80,
  logConnections: true
});

var onTweet = function(tweet) {
  for (var channel in tweet.channels) {
    ws.broadcast({
      channel: channel,
      keywords: tweet.channels[channel],
      content: tweet.content
    });
  }
}

var stream = new TweetStream({
  auth: AUTH_DATA,
  ontweet: onTweet
});
