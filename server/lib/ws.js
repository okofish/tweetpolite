var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;

var WS = function(options) {
  var self = this;
  self.port = options.port || 8080;
  self.server = new WebSocketServer({
    port: self.port
  });
  self.logConnections = options.logConnections || false;
  console.log('WebSocket server opened on port ' + self.port);
  
  self.server.on('connection', function(connection) {
    if (self.logConnections) {
      console.log(`WebSocket client at ${connection._socket.remoteAddress} connected`);
      connection.on('close', function() {
        console.log(`WebSocket client at ${connection._socket.remoteAddress} disconnected`);
      });
    }
  })
  
  self.server.on('error', function(err) {
    console.error('WebSocket server error: ' + err);
  })
};

WS.prototype.broadcast = function(data) {
  var self = this;
  self.server.clients.forEach(function(client) {
    
    // this is an extra layer of protection in case the connection is closed between the initialization of the forEach and the evaluation of this section
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = WS;