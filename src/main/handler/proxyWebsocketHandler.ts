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

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (data) => {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.error('Invalid JSON:', e);
        return;
      }

      if (parsedData.type === 'proxyInfo') {
        const { proxyUrl } = parsedData;
        console.log('Proxy URL:', proxyUrl);

        // Create an HTTPS proxy agent
        const agent = new HttpsProxyAgent(proxyUrl);

        // Target WebSocket server URL
        const targetUrl = wsTargetUrl;
        const targetWs = new WebSocket(targetUrl, { agent });

        targetWs.on('open', () => {
          console.log('Connected to target server through proxy');
          ws.send(JSON.stringify({ type: 'proxyConnected' }));
        });

        targetWs.on('message', (message) => {
          let messageData = Buffer.isBuffer(message)
            ? message.toString('utf-8')
            : message;
          // console.log('Message from target server:', messageData);
          ws.send(messageData);
        });

        targetWs.on('close', () => {
          console.log('Disconnected from target server');
          ws.send(JSON.stringify({ type: 'proxyDisconnected' }));
        });

        targetWs.on('error', (error) => {
          console.error('Error connecting to target server:', error);
          ws.send(JSON.stringify({ type: 'proxyError', error: error.message }));
        });

        ws.on('message', (message) => {
          let clientMessage;
          try {
            clientMessage = JSON.parse(message);
          } catch (e) {
            console.error('Invalid JSON:', e);
            return;
          }

          if (!clientMessage.type && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify(clientMessage));
            // targetWs.send(
            //   `[1,'Simms','','',{agentId: '1',accessToken: '29-beeb0453abc94ee522a6607416e4dd27',reconnect: false}]`
            // );
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
    console.log('Server is running on port 4500');
  });
};
