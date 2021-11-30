var TwitterStreamChannels = require('twitter-stream-channels');
// twitter-stream-channels is useful because it lets us categorize keywords into channels (see the definition of self.channels below)

var TweetStream = function(options) {
  var self = this;

  self.channels = options.channels || {
    'please': ['please'],
    'thanks': ['thanks', 'thank you'],
    'welcome': ['you\'re welcome', 'youre welcome', 'you are welcome', 'you welcome']
  };

  self.cb = options.ontweet || function() {};

  self.twitter = new TwitterStreamChannels(options.auth);
  self.stream = self.twitter.streamChannels({
    track: self.channels
  });

  self.stream.on('channels', function(tweet) {
    self.cb({
      channels: tweet.$channels,
      content: {
        name: tweet.user.name,
        handle: tweet.user.screen_name,
        text: tweet.text
      }
    })
  });
};

module.exports = TweetStream;
