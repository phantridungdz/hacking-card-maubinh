const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

export const setupProxyWebsocketHandler = () => {
  app.use(express.static(path.join(__dirname, 'public')));

  const { HttpsProxyAgent } = require('https-proxy-agent');

  io.on('connection', (socket: any) => {
    console.log('New client connected');

    socket.on('proxyInfo', (data: any) => {
      const { proxyUrl } = data;
      console.log('Proxy URL:', proxyUrl);
      const agent = new HttpsProxyAgent(proxyUrl);

      const targetUrl = 'wss://cardskgw.ryksockesg.net/websocket';
      const ws = new WebSocket(targetUrl, { agent });

      ws.on('open', (message) => {
        console.log('Connected to target server through proxy');
        socket.emit('proxyConnected', message);
      });

      ws.on('message', (message) => {
        let messageData;
        if (Buffer.isBuffer(message)) {
          messageData = message.toString('utf-8');
        }
        console.log('Message from target server:', messageData);
        socket.emit('proxyMessage', messageData);
      });

      ws.on('lastMessage', (message) => {
        console.log('Last Message from target server:', message);
        socket.emit('proxyLastMessage', message);
      });

      ws.on('close', () => {
        console.log('Disconnected from target server');
        socket.emit('proxyDisconnected');
      });

      ws.on('error', (error) => {
        console.error('Error connecting to target server:', error);
        socket.emit('proxyError', error);
      });

      socket.on('clientMessage', (message) => {
        if (ws.readyState === WebSocket.OPEN) {
          //check the ip address of the ws connection
          console.log(ws._socket);
          console.log(message);
          // console.log("Message from client:", message);
          ws.send('message', message);
          ws.send(message);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    });
  });

  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};
