import express from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

const app = express();
const port = 3500;

export const setupProxyHandler = () => {
  app.use(express.json());

  app.post('/fetchWithProxy', async (req, res) => {
    const { url, proxyHost, proxyPort, proxyUsername, proxyPassword } =
      req.body;
    const proxyAgent2 = new HttpsProxyAgent({
      host: proxyHost,
      port: parseInt(proxyPort),
      auth: `${proxyUsername}:${proxyPassword}`,
    });

    try {
      const response = await fetch(url, { agent: proxyAgent2 });

      const data = await response.json();
      res.send(data);
    } catch (error) {
      console.error('Error with proxy request', error);
      res.status(500).send('Error fetching data with proxy');
    }
  });

  app.post('/sendPostViaProxy', async (req, res) => {
    const {
      url,
      proxyHost,
      proxyPort,
      proxyUsername,
      proxyPassword,
      headers,
      data,
    } = req.body;
    const proxyAgent = new HttpsProxyAgent({
      host: proxyHost,
      port: proxyPort,
      auth: `${proxyUsername}:${proxyPassword}`,
    });
    const fetchOptions = {
      method: 'POST',
      agent: proxyAgent,
      headers: headers,
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, fetchOptions);
      const responseData = await response.json();
      res.send(responseData);
    } catch (error) {
      console.error('Error with proxy POST request', error);
      res.status(500).send('Error sending POST request via proxy');
    }
  });

  app.listen(port, () => {
    console.log(`Server proxy running on port: ${port}`);
  });
};
