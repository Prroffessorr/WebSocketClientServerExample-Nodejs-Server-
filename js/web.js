const fs = require('fs');
const http = require('http');
const Websocket = require('websocket').server;

const index = fs.readFileSync('./Index.html', 'utf8');


const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(index);
});

server.listen(8080, () => {
  console.log('Listen port 8080');
});

const ws = new Websocket({
  httpServer: server,
  autoAcceptConnections: false
});

const clients = [];

ws.on('request', req => {
  const connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  connection.on('message', onWsMessage);

  function onWsMessage(message) {
    const dataName = message.type + 'Data';
    const data = message[dataName];
    clients.forEach(client => {
      if (connection !== client) {
        client.send(data);        
      }     
    });
  }
});
