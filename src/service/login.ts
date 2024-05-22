import axios from 'axios';
import { now } from 'lodash';
import { toast } from '../components/toast/use-toast';
import { generateRandomHex, getRandomOS } from '../lib/utils';

const getFg = (botInfo: any) => {
  return new Promise((resolve) => {
    const handleGetFG = (data: any) => {
      resolve(data);
    };
    window.backend.on('generateFgReply', handleGetFG);

    window.backend.sendMessage(
      'generateFg',
      `
      grecaptcha.enterprise.execute('6LcRfskaAAAAAPLbAdyH3WCygmXJ4KWietpBc_UA', { action: 'g8login' })
      function convertUTCDateToLocalDate(t) {
        var e = new Date(t.getTime() + 6e4 * t.getTimezoneOffset()),
          i = e.getHours();
        return e.setHours(i - -7), e;
      }

      var y = Math.floor(convertUTCDateToLocalDate(new Date()).getTime() / 1e3);
      var sign = __require('PopupDangNhap').default.prototype.checkSign(y, '${botInfo.username}')
      var fg = __require('GamePlayManager').default.getInstance().fingerprint
      var result = {fg: fg, time: y, sign:  sign}
      result
    `
    );
  });
};

const loginHit = (botInfo: any) => {
  return new Promise((resolve) => {
    const handleGetFG = (data: any) => {
      resolve(data);
    };
    window.backend.on('login-hit', handleGetFG);

    window.backend.sendMessage('login-hit', botInfo);
  });
};

const login = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string,
  trackingIPUrl: string
) => {
  let fgAndTime;
  if (botInfo.targetSite === 'HIT') {
    fgAndTime = (await loginHit(botInfo)) as any;
    if (!fgAndTime.data) {
      fgAndTime = null;
      toast({ title: 'Error', description: 'Vui lòng bật HIT lên.' });
    }
  }

  const credentials =
    botInfo.targetSite === 'HIT'
      ? {
          username: botInfo.username,
          password: botInfo.password,
          app_id: 'bc114103',
          os: getRandomOS(),
          device: botInfo.device,
          browser: botInfo.browser,
          aff_id: botInfo.aff_id,
          csrf: botInfo.targetSite === 'RIK' ? null : '',
          fg: fgAndTime?.data ? fgAndTime.data.fg : generateRandomHex(16),
          time: fgAndTime?.data ? fgAndTime.data.time : now(),
          sign: fgAndTime?.data ? fgAndTime.data.sign : generateRandomHex(16),
          r_token: fgAndTime?.data ? fgAndTime.data.body : null,
        }
      : {
          username: botInfo.username,
          password: botInfo.password,
          app_id: 'rik.vip',
          os: getRandomOS(),
          device: botInfo.device,
          browser: botInfo.browser,
          aff_id: botInfo.aff_id,
          fg: fgAndTime?.data ? fgAndTime.data.fg : generateRandomHex(16),
          time: fgAndTime?.data ? fgAndTime.data.time : now(),
          sign: fgAndTime?.data ? fgAndTime.data.sign : generateRandomHex(16),
          r_token: '',
        };

  try {
    let proxyConfig = {};
    if (
      botInfo.proxy &&
      botInfo.passProxy &&
      botInfo.userProxy &&
      botInfo.passProxy
    ) {
      proxyConfig = {
        proxy: {
          host: botInfo.proxy,
          port: Number(botInfo.port),
          auth: {
            username: botInfo.userProxy,
            password: botInfo.passProxy,
          },
        },
      };
    }

    const response = await axios.post(loginUrl, JSON.stringify(credentials), {
      headers: {
        'Content-Type': 'application/json',
      },
      ...proxyConfig,
    });

    if (response.data.code === 200) {
      const data = response.data.data[0];
      updateAccount(accountType, botInfo.username, {
        session_id: data.session_id,
        main_balance: data.main_balance || 0,
        token: data.token,
        fullname: data.fullname,
      });
    } else {
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.message,
      });
    }
    await axios.get(trackingIPUrl, proxyConfig);

    return response.data;
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};

interface ConnectTokenResponse {
  connectionToken: string;
}

export { login };
