
const fs = require('fs');
const http = require('http');
const { parse } = require('querystring');
const Websocket = require('websocket').server;

const index = fs.readFileSync('./Index.html', 'utf8');


const server = http.createServer((req, res) => {
  res.writeHead(200);
  //res.end(index);
  
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString();
  });
  req.on('end', () => {
      console.log(body);
       let params = parse(body);
      console.log(params);
      res.end(index);
  });

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
//   connection.on('close', onWsClose );
  connection.on('message', onWsMessage);
//   connection.on('error', onWsError);

//   function onWsError(e) {
//     console.error(e.message);
//   }

  function onWsMessage(message) {
    const dataName = message.type + 'Data';
    const data = message[dataName];
    //console.log('Received: ' + data);
    clients.forEach(client => {
      if (connection !== client) {
        client.send(data);        
      }     
    });
  }
//   function onWsClose(reasonCode, description) {
//     console.log('Disconnected ' + connection.remoteAddress);
//     console.dir({ reasonCode, description });
//  }
});

// const url = require('url');
// const { parse } = require('querystring');

// http.createServer((request, response) => {
//     console.log('server work');
//     if (request.method == 'GET') {
//         // GET -> получить обработать
//         console.log(request.method); // !!!!
//         let urlRequest = url.parse(request.url, true);
//         // console.log(urlRequest);
//         console.log(urlRequest.query.test); // ! GET Params
//         if (urlRequest.query.test % 2 == 0) {
//             response.end('even');
//         }
//         response.end('odd');
//     }
//     else {
//         // POST
//         let body = '';
//         request.on('data', chunk => {
//             body += chunk.toString();
//         });
//         request.on('end', () => {
//             console.log(body);
//             let params = parse(body);
//             console.log(params);
//             console.log(params.hi);
//             response.end('ok');
//         });
//     }

// }).listen(8080);