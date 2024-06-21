import axios from 'axios';
import CryptoJS from 'crypto-js';
import { now } from 'lodash';
import { generateRandomHex, getRandomOS } from '../lib/utils';

const getFg = (botInfo: any) => {
  return new Promise((resolve) => {
    const handleGetFG = (data: any) => {
      resolve(data);
    };
    window.backend.on('generateFgReply', handleGetFG);

    console.log('botInfo', botInfo);

    botInfo.formSite === 'HIT'
      ? window.backend.sendMessage(
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
    `,
          botInfo.fromSite
        )
      : window.backend.sendMessage(
          'generateFg',
          `
      grecaptcha.enterprise.execute('6Ld2h7chAAAAADTq4Dwn5_suHawrnqSV1IPjJiix', { action: 'b5login' })
      function convertUTCDateToLocalDate(t) {
        var e = new Date(t.getTime() + 6e4 * t.getTimezoneOffset()),
          i = e.getHours();
        return e.setHours(i - -7), e;
      }

      var y = Math.floor(convertUTCDateToLocalDate(new Date()).getTime() / 1e3);
      var fg = __require('GamePlayManager').default.getInstance().fingerprint
      __require('GamePlayManager').default.prototype.onLogOutKickUser()
      var result = {fg: fg, time: y}
      result
    `,
          botInfo.fromSite
        );
  });
};
const fetchViaProxy = async (
  data: any,
  botInfo: any,
  headers: any,
  loginUrl: string
) => {
  const proxy = {
    url: loginUrl,
    proxyHost: botInfo.proxy,
    proxyPort: botInfo.port,
    proxyUsername: botInfo.userProxy,
    proxyPassword: botInfo.passProxy,
    headers: headers,
    data,
  };

  try {
    return await axios.post('http://localhost:3500/sendPostViaProxy', proxy);
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return { data: { code: 404 } };
  }
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

  const headers = {
    Accept: '*/*',
    'Content-Type': 'text/plain;charset=UTF-8',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://v.rik.vip',
    Referer: 'https://v.rik.vip',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginB52 = async (
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
      app_id: 'b52.club',
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
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'Accept-encoding': 'gzip, deflate, br, zstd',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://lucky88.vip',
    Referer: 'https://lucky88.vip',
    Cookie:
      'source=lucky88.vip; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null; device=desktop; vgmnid=13971.55342598229111716553376008; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; whitelist=true',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }

    if (response.data.code === 200) {
      const data = response.data.data ? response?.data?.data[0] : undefined;
      if (data) {
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
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json, text/plain, */*',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://debet.net',
    Referer: 'https://debet.net',
    Cookie:
      '_gid=GA1.2.704473547.1716609101; strongPassword=1; _pk_id.4.d164=a9d05cad470f262c.1716609101.; domain=https%3A%2F%2Fdebet.net; host=debet.net; device=desktop; _gcl_au=1.1.1510002727.1716609102; luckyNumber=54; showPopupDomain=true; whitelist=true; _pk_ses.4.d164=1; _clck=1l21aao%7C2%7Cfm2%7C0%7C1606; vgmnid=13838.84719695447221716609103001; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; _ga=GA1.1.512047530.1716312616; _ga_YB99BJW0HQ=GS1.1.1716608406.3.1.1716609185.59.0.0; _clsk=rr7nm6%7C1716609424069%7C3%7C1%7Cx.clarity.ms%2Fcollect; _ga_WX6RHFP3H4=GS1.1.1716607825.3.1.1716609451.0.0.0',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginFive88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  // Serialize credentials into a URL-encoded form string
  const credentials = `username=${encodeURIComponent(
    botInfo.username
  )}&password=${encodeURIComponent(botInfo.password)}`;

  const headers = {
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://five88.vin',
    Referer: 'https://five88.vin',
    Cookie:
      'PHPSESSID=5fce472f3e07e13f1673ddb99de973d7; _gcl_au=1.1.631577307.1716999653; _ga_V2TKQNQHHX=GS1.1.1716999652.1.0.1716999652.60.0.0; _gid=GA1.2.1444793540.1716999653; _gat_UA-238184817-1=1; _gat_UA-156072496-1=1; _stoken=f050d05650fd76c373aa9a79f854573c; _ga=GA1.2.802994207.1716999653; __utma=63665976.802994207.1716999653.1716999657.1716999657.1; __utmc=63665976; __utmz=63665976.1716999657.0.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga_D2M74VZWV7=GS1.1.1716999652.1.0.1716999658.0.0.0; __utmb=63665976.3.9.1716999664228; _ga_5QSLVWX8N6=GS1.2.1716999653.1.1.1716999664.0.0.0', // Use actual cookie value
  };

  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials, { headers: headers });
    }
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
const loginMay88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json, text/plain, */*',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://may88.com',
    Referer: 'https://may88.com',
    Cookie:
      'device=desktop; _gcl_au=1.1.732562051.1716726234; _ga_171YF2R0MV=GS1.1.1716726234.1.0.1716726234.0.0.0; _ga=GA1.2.314653449.1716726234; _gid=GA1.2.245976383.1716726234; _gat_UA-185855122-1=1; _ga_LNECPR22W8=GS1.2.1716726234.1.0.1716726234.60.0.0',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
    if (response.data.code === 200) {
      const data = response.data.data[0];

      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.message,
        token: data.token_play,
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
const loginXo88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://xo88.com',
    Referer: 'https://xo88.com',
    Cookie:
      'device=desktop; domain=https%3A%2F%xo88.com; host=xo88.com; showed=Wed%20May%2029%202024%2023%3A14%3A33%20GMT+0700%20%28Indochina%20Time%29',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginSv88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://sv88.top',
    Referer: 'https://sv88.top/game-bai',
    Cookie:
      'device=desktop; domain=https%3A%2F%2Fsv88.top; host=sv88.top; showed=Wed%20May%2029%202024%2023%3A14%3A33%20GMT+0700%20%28Indochina%20Time%29',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginOne88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://one88.in',
    Referer: 'https://one88.in',
    Cookie:
      'device=desktop; os=desktop; source=one88.in; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
export const loginSunWin = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string,
  answer: string,
  sessionId: string
) => {
  var platform = 0x4;
  var finalHash = botInfo.username;
  finalHash += botInfo.password;
  finalHash += '4';
  finalHash += '03BPiRbkirq15NsunGJ0';
  finalHash += 'kUHH2za4EuRjWGPk';

  finalHash = CryptoJS.MD5(finalHash).toString();
  const credentials = {
    advId: '',
    answer: answer,
    brand: 'sun.win',
    command: 'loginWebHash',
    deviceId: '03BPiRbkirq15NsunGJ0',
    hash: finalHash,
    platformId: 4,
    sessionId: sessionId,
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://one88.in',
    Referer: 'https://one88.in',
    Cookie:
      'device=desktop; os=desktop; source=one88.in; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
    if (response.data.data.message === 'Thành công') {
      const data = response.data.data;

      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.data.message,
        token: data.accessToken,
        fullname: data.info.username,
        info: data.info,
        signature: data.signature,
        refreshToken: data.refreshToken,
      });
    } else {
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.data.message,
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
const loginUk88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://uk88.win',
    Referer: 'https://uk88.win',
    Cookie:
      'device=desktop; os=desktop; source=uk88.win; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginTa88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://ta88.me',
    Referer: 'https://ta88.me',
    Cookie:
      'device=desktop; os=desktop; source=ta88.me; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginMu99 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://mu99.vin',
    Referer: 'https://mu99.vin',
    Cookie:
      'device=desktop; os=desktop; source=mu99.vin; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginZbet = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://zbet.bet',
    Referer: 'https://zbet.bet',
    Cookie:
      'device=desktop; os=desktop; source=zbet.bet; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const login11bet = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://11bet.com',
    Referer: 'https://11bet.com',
    Cookie:
      'device=desktop; os=desktop; source=11bet.com; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null; mien-bac=1717067700000; mien-trung=1717064100000; mien-nam=1717060500000; whitelist=true; hideTooltipScheduleHome=true',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginOxbet = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://oxbet.in',
    Referer: 'https://oxbet.in',
    Cookie:
      '_gid=GA1.2.962535063.1718893045; device=desktop; domain=https%3A%2F%2Foxbet.in; host=oxbet.in; vgmnid=13145.92260958204761718970712433; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; notificationTime=%222024-06-22T11%3A52%3A23.084Z%22; reloadCount=0; _gat_UA-177224808-1=1; _ga=GA1.2.451142714.1718893045; _ga_GLGHQW1XYP=GS1.1.1718969217.2.1.1718970765.0.0.0; _ga_BDKVWDCWMC=GS1.2.1718969217.2.1.1718970768.0.0.0',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginSky88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://sky88.com',
    Referer: 'https://sky88.com',
    Cookie:
      '_gid=GA1.2.962535063.1718893045; device=desktop; domain=https%3A%2F%2Fsky88.com; host=sky88.com; vgmnid=13145.92260958204761718970712433; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; notificationTime=%222024-06-22T11%3A52%3A23.084Z%22; reloadCount=0; _gat_UA-177224808-1=1; _ga=GA1.2.451142714.1718893045; _ga_GLGHQW1XYP=GS1.1.1718969217.2.1.1718970765.0.0.0; _ga_BDKVWDCWMC=GS1.2.1718969217.2.1.1718970768.0.0.0',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
    if (response.data.status === 'OK') {
      const data = response.data.data;
      console.log('datasky88', data);

      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.status,
        token: data.gptoken,
        fullname: data.fullname,
      });
    } else {
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.status,
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
const loginLode88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://lode88.ai',
    Referer: 'https://lode88.ai',
    Cookie:
      '_gid=GA1.2.962535063.1718893045; device=desktop; domain=https%3A%2F%2Flode88.ai; host=lode88.ai; vgmnid=13145.92260958204761718970712433; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; notificationTime=%222024-06-22T11%3A52%3A23.084Z%22; reloadCount=0; _gat_UA-177224808-1=1; _ga=GA1.2.451142714.1718893045; _ga_GLGHQW1XYP=GS1.1.1718969217.2.1.1718970765.0.0.0; _ga_BDKVWDCWMC=GS1.2.1718969217.2.1.1718970768.0.0.0',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
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
const loginRed88 = async (
  botInfo: any,
  accountType: string,
  updateAccount: any,
  loginUrl: string
) => {
  const credentials = {
    username: botInfo.username,
    password: botInfo.password,
  };
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    'User-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    Origin: 'https://sky88.com',
    Referer: 'https://sky88.com',
    Cookie:
      '_gid=GA1.2.962535063.1718893045; device=desktop; domain=https%3A%2F%2Fsky88.com; host=sky88.com; vgmnid=13145.92260958204761718970712433; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; notificationTime=%222024-06-22T11%3A52%3A23.084Z%22; reloadCount=0; _gat_UA-177224808-1=1; _ga=GA1.2.451142714.1718893045; _ga_GLGHQW1XYP=GS1.1.1718969217.2.1.1718970765.0.0.0; _ga_BDKVWDCWMC=GS1.2.1718969217.2.1.1718970768.0.0.0',
  };
  try {
    let response;
    if (botInfo.isUseProxy) {
      response = await fetchViaProxy(credentials, botInfo, headers, loginUrl);
    } else {
      response = await axios.post(loginUrl, credentials);
    }
    if (response.data.status === 'OK') {
      const data = response.data.data;
      console.log('datasky88', data);

      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.status,
        token: data.gptoken,
        fullname: data.fullname,
      });
    } else {
      updateAccount(accountType, botInfo.username, {
        main_balance: response.data.status,
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
const getCaptcha = async (sessionId: string, loginUrl: string) => {
  await window.backend.sendMessage('update-header', 'SUNWIN');
  const url = `${loginUrl}?command=getCaptcha&sessionId=${sessionId}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching captcha:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};

const login = async (bot: any, accountType: string, updateAccount: any) => {
  await window.backend.sendMessage('update-header', bot.fromSite);
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
    case 'MAY88':
      return await loginMay88(
        bot,
        accountType,
        updateAccount,
        'https://may88.com/api/v1/login'
      );
    case 'SV88':
      return await loginSv88(
        bot,
        accountType,
        updateAccount,
        'https://sv88.top/api/v1/login'
      );
    case 'XO88':
      return await loginXo88(
        bot,
        accountType,
        updateAccount,
        'https://xo88.com/api/v1/login'
      );
    case 'FIVE88':
      return await loginFive88(
        bot,
        accountType,
        updateAccount,
        'https://five88.vin/login.aspx'
      );
    case 'UK88':
      return await loginUk88(
        bot,
        accountType,
        updateAccount,
        'https://uk88.win/api/v1/login'
      );
    case 'TA88':
      return await loginTa88(
        bot,
        accountType,
        updateAccount,
        'https://ta88.me/api/v1/login'
      );
    case 'ONE88':
      return await loginOne88(
        bot,
        accountType,
        updateAccount,
        'https://one88.in/api/v1/login'
      );
    case 'ZBET':
      return await loginZbet(
        bot,
        accountType,
        updateAccount,
        'https://zbet.bet/api-v1/v1/login'
      );
    case '11BET':
      return await login11bet(
        bot,
        accountType,
        updateAccount,
        'https://11bet.com/api/v1/login'
      );
    case 'MU99':
      return await loginMu99(
        bot,
        accountType,
        updateAccount,
        'https://api.mu9.vin/users/login'
      );
    // case 'SUNWIN':
    //   return await loginSunWin(
    //     bot,
    //     accountType,
    //     updateAccount,
    //     'https://api.mu9.vin/users/login'
    //   );
    case 'B52':
      return await loginB52(
        bot,
        accountType,
        updateAccount,
        'https://bfivegwlog.gwtenkges.com/user/login.aspx'
      );
    case 'OXBET':
      return await loginOxbet(
        bot,
        accountType,
        updateAccount,
        'https://oxbet.in/api/v1/login'
      );
    case 'SKY88':
      return await loginSky88(
        bot,
        accountType,
        updateAccount,
        'https://api.sky88.com/users/login'
      );
    case 'LODE88':
      return await loginLode88(
        bot,
        accountType,
        updateAccount,
        'https://lode88.ai/api/v1/login'
      );
    case 'RED88':
      return await loginRed88(
        bot,
        accountType,
        updateAccount,
        'https://api.red88.com/users/login'
      );

    default:
      throw new Error(`Unsupported target site: ${bot.targetSite}`);
  }
};

export { fetchToken, getCaptcha, login };
