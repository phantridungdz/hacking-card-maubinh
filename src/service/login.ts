import axios from 'axios';
import { now } from 'lodash';
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
      __require('GamePlayManager').default.prototype.onLogOutKickUser()
      var result = {fg: fg, time: y, sign:  sign}
      result
    `
    );
  });
};
const loginHitBrowser = (botInfo: any) => {
  return new Promise((resolve) => {
    const handleGetFG = (data: any) => {
      resolve(data);
    };
    window.backend.on('login-hit', handleGetFG);

    window.backend.sendMessage('login-hit', botInfo);
  });
};
const loginRik = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
    app_id: 'rik.vip',
    os: getRandomOS(),
    device: botInfo.device,
    browser: botInfo.browser,
    aff_id: botInfo.aff_id,
    fg: generateRandomHex(16),
    time: now(),
    sign: generateRandomHex(16),
    r_token: '',
  };
  try {
    const response = await axios.post(loginUrl, JSON.stringify(credentials));

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

    return response.data;
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};
const loginHit = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  let fgAndTime = (await getFg(botInfo)) as any;
  if (fgAndTime) {
    const credentials = {
      username: botInfo.username,
      password: botInfo.password,
      app_id: 'bc114103',
      os: getRandomOS(),
      device: botInfo.device,
      browser: botInfo.browser,
      aff_id: botInfo.aff_id,
      csrf: '',
      fg: fgAndTime?.data ? fgAndTime.data.fg : generateRandomHex(16),
      time: fgAndTime?.data ? fgAndTime.data.time : now(),
      sign: fgAndTime?.data ? fgAndTime.data.sign : generateRandomHex(16),
      r_token: fgAndTime?.data ? fgAndTime.data.body : null,
    };

    try {
      const response = await axios.post(loginUrl, JSON.stringify(credentials));

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

      return response.data;
    } catch (error) {
      console.error(
        'Login failed:',
        axios.isAxiosError(error) ? error.response?.data : error
      );
      return null;
    }
  }
};
const loginLucky88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };

  try {
    const response = await axios.post(loginUrl, credentials);
    if (response.data.code === 200) {
      const data = response.data.data[0];
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.message,
        token: data.tp_token,
        fullname: data.fullname,
      });
    } else {
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.message,
      });
    }

    return response.data;
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};
const loginDebet = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };

  try {
    const response = await axios.post(loginUrl, credentials);
    if (response.data.code === 200) {
      const data = response.data.data[0];
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.message,
        token: data.tp_token,
        fullname: data.fullname,
      });
    } else {
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.message,
      });
    }

    return response.data;
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};
const fetchToken = async (botInfo: any) => {
  const url = 'https://api.wsmt8g.cc/v2/auth/token/login';

  const token = botInfo.token;
  const device = {
    os: botInfo.os,
    osVersion: '',
    platform: 101,
    browser: 'chrome',
    browserVersion: '91.0.4472.124',
    language: 'en',
    ssid: botInfo.session_id,
  };

  const body = `token=${encodeURIComponent(token)}&device=${encodeURIComponent(
    JSON.stringify(device)
  )}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: body,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.data && data?.data) {
      return data;
    } else {
      return false;
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

const login = async (bot: any, accountType: string, updateAccount: any) => {
  window.backend.sendMessage('update-header', bot.fromSite);
  switch (bot.fromSite) {
    case 'RIK':
      return await loginRik(
        bot,
        accountType,
        updateAccount,
        'https://bordergw.api-inovated.com/user/login.aspx'
      );
    case 'HIT':
      return await loginHit(
        bot,
        accountType,
        updateAccount,
        'https://bodergatez.dsrcgoms.net/user/login.aspx'
      );
    case 'LUCKY88':
      return await loginLucky88(
        bot,
        accountType,
        updateAccount,
        'https://lucky88.vip/api/v1/login'
      );
    case 'DEBET':
      return await loginDebet(
        bot,
        accountType,
        updateAccount,
        'https://debet.net/api/v1/login'
      );
    default:
      throw new Error(`Unsupported target site: ${bot.targetSite}`);
  }
};

export { fetchToken, login };
