var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8080');

ws.on('message', function(data) {
  console.log(data);
});