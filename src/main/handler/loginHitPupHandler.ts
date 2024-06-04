const { ipcMain } = require('electron');
const puppeteer = require('puppeteer');
export const setupLoginHitHandlers = () => {
  let puppeteerInstances: any[] = [];

  async function startLoginHit(account: {
    username: string;
    password: string;
    proxy: string;
    port: string;
    userProxy: string;
    passProxy: string;
    targetSite: string;
  }) {
    try {
      const browser = await puppeteer.launch({
        // headless: false,
        defaultViewport: null,
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

      const targetSite = 'https://web.hitclub.win/';
      await page.goto(targetSite, {
        waitUntil: 'networkidle2',
      });

      let result = await page.evaluate(`
      grecaptcha.enterprise.execute('6LcRfskaAAAAAPLbAdyH3WCygmXJ4KWietpBc_UA', { action: 'g8login' })
      function convertUTCDateToLocalDate(t) {
        var e = new Date(t.getTime() + 6e4 * t.getTimezoneOffset()),
          i = e.getHours();
        return e.setHours(i - -7), e;
      }

      var y = Math.floor(convertUTCDateToLocalDate(new Date()).getTime() / 1e3);
      var sign = __require('PopupDangNhap').default.prototype.checkSign(y, '${account.username}')
      var fg = __require('GamePlayManager').default.getInstance().fingerprint
      var result = {fg: fg, time: y, sign:  sign}
      result`);

      page.on('response', async (response: any) => {
        const requestUrl = response.url();
        if (
          requestUrl.includes(
            'reload?k=6LcRfskaAAAAAPLbAdyH3WCygmXJ4KWietpBc_UA'
          )
        ) {
          // Replace 'specific-endpoint' with your condition
          const responseBody = await response.text();
          const parsedBody = JSON.parse(responseBody.replace(`)]}'`, ''));
          result.body = parsedBody[1];
          // await page.close();
        }
      });
      return result;
    } catch (error) {
      return false;
    }
  }

  ipcMain.on('login-hit', async (event, account) => {
    const res = await startLoginHit(account);
    console.log('res', res);
    const instance = puppeteerInstances.find(
      (instance) => instance.username === account.username
    );

    if (instance) {
      const { page } = instance;
      try {
        let result = await instance.page.evaluate(`
        grecaptcha.enterprise.execute('6LcRfskaAAAAAPLbAdyH3WCygmXJ4KWietpBc_UA', { action: 'g8login' })
        function convertUTCDateToLocalDate(t) {
          var e = new Date(t.getTime() + 6e4 * t.getTimezoneOffset()),
            i = e.getHours();
          return e.setHours(i - -7), e;
        }

        var y = Math.floor(convertUTCDateToLocalDate(new Date()).getTime() / 1e3);
        var sign = __require('PopupDangNhap').default.prototype.checkSign(y, '${account.username}')
        var fg = __require('GamePlayManager').default.getInstance().fingerprint
        var result = {fg: fg, time: y, sign:  sign}
        result`);
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
            event.reply('login-hit', {
              data: result,
            });
            page.close();
          }
        });
      } catch (error) {
        event.reply('generateFgReply', `Failed to execute script.`);
      }
    } else {
      event.reply('generateFgReply', `Not found instance.`);
    }
  });
};
