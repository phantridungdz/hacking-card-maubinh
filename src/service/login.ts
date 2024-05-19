import axios from 'axios';
import { now } from 'lodash';
import { ProxyAgent } from 'proxy-agent';
import { toast } from '../components/toast/use-toast';
import { generateRandomHex, getRandomOS } from '../lib/utils';

const getFg = (username: string) => {
  return new Promise((resolve) => {
    const handleGetFG = (data: any) => {
      console.log('event', data);

      resolve(data);
    };
    window.backend.on('generateFgReply', handleGetFG);

    window.backend.sendMessage(
      'generateFg',
      `
      function convertUTCDateToLocalDate(t) {
        var e = new Date(t.getTime() + 6e4 * t.getTimezoneOffset()),
          i = e.getHours();
        return e.setHours(i - -7), e;
      }

      var y = Math.floor(convertUTCDateToLocalDate(new Date()).getTime() / 1e3);
      var sign = __require('PopupDangNhap').default.prototype.checkSign(y, '${username}')
      var fg = __require('GamePlayManager').default.getInstance().fingerprint
      var result = {fg: fg, time: y, sign:  sign}
      result
    `
    );
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
    fgAndTime = (await getFg(botInfo.username)) as any;
    console.log('fgAndTime', fgAndTime);
    if (!fgAndTime.data) {
      fgAndTime = null;
      toast({ title: 'Error', description: 'Vui lòng bật HIT lên.' });
    }
  }

  const credentials = {
    app_id: botInfo.targetSite === 'RIK' ? 'rik.vip' : 'bc114103',
    aff_id: botInfo.aff_id,
    browser: botInfo.browser,
    csrf: botInfo.targetSite === 'RIK' ? null : '',
    device: botInfo.device,
    fg: fgAndTime?.data ? fgAndTime.data.fg : generateRandomHex(16),
    os: getRandomOS(),
    password: botInfo.password,
    sign: fgAndTime?.data ? fgAndTime.data.sign : generateRandomHex(16),
    time: fgAndTime?.data ? fgAndTime.data.time : now(),
    username: botInfo.username,
  };

  try {
    let axiosConfig = {};
    if (
      botInfo.proxy &&
      botInfo.passProxy &&
      botInfo.userProxy &&
      botInfo.passProxy
    ) {
      const proxyUrl = `http://${botInfo.userProxy}:${botInfo.passProxy}@${botInfo.proxy}:${botInfo.port}`;
      const agent = new ProxyAgent(proxyUrl);

      axiosConfig = {
        httpAgent: agent,
        httpsAgent: agent,
      };
    }

    const response = await axios.post(loginUrl, credentials, axiosConfig);

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
    await axios.get(trackingIPUrl, axiosConfig);

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
