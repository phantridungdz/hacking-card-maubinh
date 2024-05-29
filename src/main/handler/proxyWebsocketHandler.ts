const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');

export const setupProxyWebsocketHandler = () => {
  const app = express();
  const server = http.createServer(app);

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Create a WebSocket server
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: any) => {
    console.log('New client connected');

    ws.on('message', (data: any) => {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.error('Invalid JSON:', e);
        return;
      }

      if (parsedData.type === 'proxyInfo') {
        const { proxyUrl, wsTargetUrl } = parsedData;
        console.log('Proxy URL:', proxyUrl);
        console.log('Proxy wsTargetUrl:', wsTargetUrl);

        if (!proxyUrl || !wsTargetUrl) {
          console.error('proxyUrl or wsTargetUrl is missing');
          ws.send(
            JSON.stringify({
              type: 'proxyError',
              error: 'Missing proxyUrl or wsTargetUrl',
            })
          );
          return;
        }
        const agent = new HttpsProxyAgent(proxyUrl);
        const targetUrl = wsTargetUrl;
        const targetWs = new WebSocket(targetUrl, { agent });

        targetWs.on('open', () => {
          console.log('Connected to target server through proxy');
          ws.send(JSON.stringify({ type: 'proxyConnected' }));
        });

        targetWs.on('message', (message: any) => {
          let messageData = Buffer.isBuffer(message)
            ? message.toString('utf-8')
            : message;
          ws.send(messageData);
        });
        targetWs.on('close', () => {
          console.log('Disconnected from target server');
          ws.send(JSON.stringify({ type: 'proxyDisconnected' }));
        });

        targetWs.on('error', (error: any) => {
          console.error('Error connecting to target server:', error);
          ws.send(JSON.stringify({ type: 'proxyError', error: error.message }));
        });

        ws.on('message', (message: any) => {
          let clientMessage;
          try {
            clientMessage = JSON.parse(message);
          } catch (e) {
            console.error('Invalid JSON:', e);
            return;
          }

          if (!clientMessage.type && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify(clientMessage));
          }
        });

        ws.on('close', () => {
          console.log('Client disconnected');
          if (targetWs.readyState === WebSocket.OPEN) {
            targetWs.close();
          }
        });
      }
    });
  });

  server.listen(4500, () => {
    console.log('Server proxy socket running on port: 4500');
  });
};
