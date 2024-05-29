const { ipcMain } = require('electron');
const os = require('os');
const puppeteer = require('puppeteer');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());
import path from 'path';
import { loginHitCommand, loginRikCommand } from '../command/command';

interface WebSocketCreatedData {
  requestId: string;
  url: string;
}

interface WebSocketFrameReceivedData {
  requestId: string;
  response: {
    payloadData: string;
  };
}
export const setupAccountHandlers = (
  mainWindow: Electron.CrossProcessExports.BrowserWindow
) => {
  let puppeteerInstances: any[] = [];

  async function startPuppeteerForAccount(account: any) {
    const existingInstance = puppeteerInstances.find(
      (inst) => inst.username === account.username
    );

    if (existingInstance) {
      return;
    }
    try {
      let userProfilePath;
      const usernamePc = os.userInfo().username;
      if (os.platform() === 'win32') {
        userProfilePath = path.join(
          'C:/Users',
          usernamePc,
          'puppeteerProfile',
          account.username
        );
      } else if (os.platform() === 'darwin') {
        userProfilePath = path.join(
          '/Users',
          usernamePc,
          'puppeteerProfile',
          account.username
        );
      } else {
        userProfilePath = path.join(
          '/home',
          usernamePc,
          'puppeteerProfile',
          account.username
        );
      }
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: userProfilePath,
        ignoreHTTPSErrors: true,
        acceptInsecureCerts: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--ignore-certifcate-errors-spki-list',
          // '--proxy-server=socks5://hndc35.proxyno1.com:42796',
          `${
            account.proxy &&
            account.proxy.trim().toLowerCase() != 'undefined' &&
            `--proxy-server=${account.proxy.trim()}:${account.port.trim()}`
          }`,
          // `--host-resolver-rules=${hostResolverRules}`,
        ],
      });
      const pages = await browser.pages();

      const page = pages[0];
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );
      if (
        account.userProxy &&
        account.userProxy.trim().toLowerCase() !== 'undefined'
      ) {
        await page.authenticate({
          username: account.userProxy.trim(),
          password: account.passProxy.trim(),
        });
      }

      const client = await page.target().createCDPSession();
      await client.send('Network.enable');
      await client.send('Page.enable');
      await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 0 });

      puppeteerInstances.push({
        username: account.username,
        browser: browser,
        page: page,
        client: client,
      });

      browser.on('disconnected', () => {
        puppeteerInstances = puppeteerInstances.filter(
          (instance) => instance.browser !== browser
        );
        console.log(
          `Browser for account ${account.username} has been disconnected and removed from the list.`
        );
      });

      let specificWebSocketRequestId: any = null;

      client.on(
        'Network.webSocketCreated',
        ({ requestId, url }: WebSocketCreatedData) => {
          if (
            url.includes(
              account.targetSite === 'RIK'
                ? 'wss://cardskgw.ryksockesg.net/websocket'
                : 'wss://carkgwaiz.hytsocesk.com/websocket'
            )
          ) {
            specificWebSocketRequestId = requestId;
          }
        }
      );

      client.on(
        'Network.webSocketFrameReceived',
        async ({ requestId, response }: WebSocketFrameReceivedData) => {
          if (requestId === specificWebSocketRequestId) {
            const displayName = await page.evaluate(
              `__require('GamePlayManager').default.Instance.displayName`
            );
            mainWindow.webContents.send('websocket-data', {
              data: response.payloadData,
              username: account.username,
              displayName: displayName,
            });
          }
        }
      );

      client.on(
        'Network.webSocketFrameSent',
        ({ requestId, response }: WebSocketFrameReceivedData) => {
          if (requestId === specificWebSocketRequestId) {
            mainWindow.webContents.send('websocket-data-sent', {
              data: response.payloadData,
              username: account.username,
            });
          }
        }
      );
      let targetSite;
      switch (account.fromSite) {
        case 'RIK':
          targetSite = 'https://v.rik.vip/';
          break;
        case 'HIT':
          targetSite = 'https://web.hitclub.win/';
          break;
        case 'LUCKY88':
          if (account.targetSite === 'HIT') {
            targetSite =
              'https://games.gnightfast.net/?brand=lucky&token=' +
              account.token +
              '&gameid=vgcg_4&ru=';
          } else {
            targetSite =
              'https://games.prorichvip.com/?brand=lucky&token=' +
              account.token +
              '&gameid=vgcg_4&ru=https%3A%2F%2Flucky88.vip';
          }
          break;
        case 'DEBET':
          if (account.targetSite === 'HIT') {
            targetSite =
              'https://games.gnightfast.net/?brand=debet&token=' +
              account.token +
              '&gameid=vgcg_4&ru=https%3A%2F%2Fdebet.net';
          } else {
            targetSite =
              'https://games.prorichvip.com/?brand=debet&token=' +
              account.token +
              '&gameid=vgcg_4&ru=https%3A%2F%2Fdebet.net';
          }
          break;
        case 'MAY88':
          if (account.targetSite === 'HIT') {
            targetSite =
              'https://games.gnightfast.net/?token=' +
              account.token +
              '&gameid=vgcg_4&brand=may88&ru=https://may88.game/games';
          } else {
            targetSite =
              'https://games.prorichvip.com/?brand=may88&ru=https%3A%2F%2Fmay88.game%2Fgames%23card&token' +
              account.token +
              '&gameid=vgcg_4';
          }
          break;
        default:
          throw new Error(`Unsupported target site: ${account.fromSite}`);
      }
      await page.goto(targetSite, {
        waitUntil: 'networkidle2',
      });

      await page.evaluate(
        account.targetSite === 'RIK'
          ? loginRikCommand(account)
          : loginHitCommand(account)
      );

      return { browser, page };
    } catch (error) {
    } finally {
      return true;
    }
  }

  ipcMain.on('open-accounts', async (event, account) => {
    await startPuppeteerForAccount(account);
    event.reply('open-accounts-reply', 'All accounts have been opened.');
  });
  ipcMain.on('close-account', async (event, username) => {
    const index = puppeteerInstances.findIndex(
      (instance) => instance.username === username
    );
    if (index !== -1) {
      const { browser } = puppeteerInstances[index];
      await browser.close();
      puppeteerInstances.splice(index, 1);
      event.reply(
        'close-account-reply',
        `Account ${username} has been closed.`
      );
    } else {
      event.reply('close-account-reply', `Account ${username} not found.`);
    }
  });
  ipcMain.on('execute-script', async (event, { username }, script) => {
    const instance = puppeteerInstances.find(
      (instance) => instance.username === username
    );
    if (instance) {
      const { page } = instance;
      try {
        await page.evaluate(script);
        event.reply(
          'execute-script-reply',
          `Script executed for account ${username}.`
        );
      } catch (error) {
        event.reply(
          'execute-script-reply',
          `Failed to execute script for account ${username}.`
        );
      }
    } else {
      event.reply('execute-script-reply', `Account ${username} not found.`);
    }
  });
  ipcMain.on('generateFg', async (event, script) => {
    // const instance = puppeteerInstances.find(
    //   (instance) => instance.username === 'hit'
    // );
    const instance = puppeteerInstances[0];
    if (instance) {
      const { page } = instance;
      try {
        let result = await instance.page.evaluate(script);
        page.on('response', async (response: any) => {
          const requestUrl = response.url();

          if (
            requestUrl.includes(
              'https://www.google.com/recaptcha/enterprise/reload?k=6LcRfskaAAAAAPLbAdyH3WCygmXJ4KWietpBc_UA'
            )
          ) {
            // Replace 'specific-endpoint' with your condition
            const responseBody = await response.text();
            const parsedBody = JSON.parse(responseBody.replace(`)]}'`, ''));
            result.body = parsedBody[1];
            event.reply('generateFgReply', {
              data: result,
            });
          }
        });
      } catch (error) {
        event.reply('generateFgReply', `Failed to execute script.`);
      }
    } else {
      event.reply('generateFgReply', `Not found instance.`);
    }
  });
  ipcMain.on('check-room', async (event, { username }, script) => {
    const instance = puppeteerInstances.find(
      (instance) => instance.username === username
    );
    if (instance) {
      const { page } = instance;
      try {
        await page.evaluate(script);
        const result = await instance.page.evaluate(script);
        event.reply('check-room', {
          data: result,
          username: username,
        });
      } catch (error) {
        console.error(`Error executing script for account ${username}:`, error);
        event.reply(
          'execute-script-reply',
          `Failed to execute script for account ${username}.`
        );
      }
    } else {
      event.reply('execute-script-reply', `Account ${username} not found.`);
    }
  });
  ipcMain.on('check-position', async (event, { username }, script) => {
    const instance = puppeteerInstances.find(
      (instance) => instance.username === username
    );
    if (instance) {
      const { page } = instance;
      try {
        await page.evaluate(script);
        const result = await instance.page.evaluate(script);
        event.reply('check-position', {
          data: result,
          username: username,
        });
      } catch (error) {
        console.error(`Error executing script for account ${username}:`, error);
        event.reply(
          'execute-script-reply',
          `Failed to execute script for account ${username}.`
        );
      }
    } else {
      event.reply('execute-script-reply', `Account ${username} not found.`);
    }
  });
  ipcMain.on('check-display-name', async (event, { username }, script) => {
    const instance = puppeteerInstances.find(
      (instance) => instance.username === username
    );
    if (instance) {
      const { page } = instance;
      try {
        await page.evaluate(script);
        const result = await instance.page.evaluate(script);
        event.reply('check-display-name', {
          data: result,
          username: username,
        });
      } catch (error) {
        console.error(`Error executing script for account ${username}:`, error);
        event.reply(
          'execute-script-reply',
          `Failed to execute script for account ${username}.`
        );
      }
    } else {
      event.reply('execute-script-reply', `Account ${username} not found.`);
    }
  });
};
