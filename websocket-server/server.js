// WebSocket 서버 설정 예제
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // 클라이언트에 메시지 에코
    ws.send(`Echo: ${message}`);
  });

  ws.send('Welcome to the WebSocket server!');
});
