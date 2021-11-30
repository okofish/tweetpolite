/* initialize foundation */
$(document).foundation();

$(document).ready(function() {
  var modes = ((new URL(document.location)).searchParams.get('mode') || '').split(',');
  if (TPOptions.showAboutBox == false || modes.indexOf('silent') > -1) {
    startWS();
  } else {
    var box = $('#aboutBox');
    var reveal = new Foundation.Reveal(box);
  
    box.on('closed.zf.reveal', function() {
      startWS();
    })
  
    reveal.open();
  }
  
  /* scheduled refresh */

  if (typeof TPOptions.refreshInterval !== 'undefined') {
    window.setTimeout(function() {
      location.reload();
    }, TPOptions.refreshInterval * 1000);
  }
});

/* websocket */

function startWS() {
  var WS = new WebSocket(TPOptions.wsURL || 'ws://localhost:8080');

  WS.onmessage = function(event) {
    var data = JSON.parse(event.data);
    addTweet(data.channel, data.keywords, data.content.name, '@' + data.content.handle, data.content.text)
  };

  WS.onerror = function(event) {
    openErrorBox('Looks like we weren\'t able to connect to the WebSocket server. Try reloading this page.\n\nIf this error reoccurs, it might be a problem with the server itself. If so, we\'ll get our top <a href="https://tools.ietf.org/html/rfc2795">coder monkeys</a> on it ASAP!');
  }
}

/* tweet adding */

// TODO: convert all of this to native JS

// this should be high enough to fully cover the viewport vertically, but as low as possible to keep memory usage down and avoid polluting the DOM
// TODO: make this dynamic based on viewport height
var maxVisibleTweets = TPOptions.maxVisibleTweets || 10;

// this is just to prevent the tweet div IDs from getting super long
// it clears the tweet container div after the IDs reach this value
// higher values provide a more seamless viewing experience
var maxTweetID = TPOptions.maxTweetID || 1000;

function addTweet(channel, keywords, name, handle, text) {
  var tweet = $('<div class="tweet"><h5 class="namebox"><span class="name"></span> <small class="handle"></small></h5><span class="text"></span></div>');
  var tweetContainer = $('#' + channel + '-tweets');
  var channelTweetCount = tweetContainer.children().length;
  var currentTweetID = channelTweetCount > 0 ? parseInt(tweetContainer.children().first().attr('id').split('-')[2]) : 1;

  if (currentTweetID >= maxTweetID) {
    // keeping the IDs from getting super high
    tweetContainer.children().remove();
    channelTweetCount = 0;
    currentTweetID = 0;
  }

  if (channelTweetCount >= maxVisibleTweets) {
    tweetContainer.children().last().remove();
    channelTweetCount = tweetContainer.children().length;
  }

  tweet.attr('id', channel + '-tweet-' + (currentTweetID + 1));
  tweet.addClass(channel);
  $('.name', tweet).text(name);
  $('.handle', tweet).text(handle);
  
  
  $('.text', tweet).text(text);
  var highlightRegex = new RegExp(keywords.join('|'),'gi');
  $('.text', tweet).html($('.text', tweet).html().replace(highlightRegex, '<b>$&</b>'));

  tweetContainer.prepend(tweet);
}

/* error box */

function openErrorBox(error) {
  var box = new Foundation.Reveal($('#errorBox'));
  $('#error').html(error);
  box.open();
}