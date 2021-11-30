const TweetStream = require('./lib/twitter');
const WS = require('./lib/ws');

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
  auth: process.env['TWEETPOLITE_AUTH'] || require('./twitterauth.json'),
  ontweet: onTweet
});
