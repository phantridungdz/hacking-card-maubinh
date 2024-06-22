import { ipcMain, session } from 'electron';
import { getTargetUrl } from './supabase';

function capitalizeHeaderKeys(
  headers: Record<string, string[]>
): Record<string, string[]> {
  const capitalizedHeaders: Record<string, string[]> = {};
  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      const capitalizedKey = key.replace(/(^|\s)\S/g, (letter) =>
        letter.toUpperCase()
      );
      capitalizedHeaders[capitalizedKey] = headers[key];
    }
  }
  return capitalizedHeaders;
}

function capitalizeRequestHeaderKeys(
  headers: Record<string, string>
): Record<string, string> {
  const capitalizedHeaders: Record<string, string> = {};
  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      const capitalizedKey = key.replace(/(^|\s)\S/g, (letter) =>
        letter.toUpperCase()
      );
      capitalizedHeaders[capitalizedKey] = headers[key];
    }
  }
  return capitalizedHeaders;
}

let targetSites: any;
const setupLink = async () => {
  let targetUrls = await getTargetUrl();

  if (Array.isArray(targetUrls) && targetUrls.length > 0) {
    targetSites = targetUrls.reduce((acc, current) => {
      acc[current.target_name] = current;
      return acc;
    }, {});
  } else {
    targetSites = {
      DEBET: {
        id: 5,
        created_at: '2024-06-22T01:20:37.851803+00:00',
        target_name: 'DEBET',
        url: 'https://debet.bet/',
        login_url: 'https://debet.bet/api/v1/login',
        domain: 'debet.bet',
      },
      LUCKY88: {
        id: 4,
        created_at: '2024-06-22T01:04:56.209924+00:00',
        target_name: 'LUCKY88',
        url: 'https://lucky88.in/',
        login_url: 'https://lucky88.in/api/v1/login',
        domain: 'lucky88.in',
      },
      MAY88: {
        id: 6,
        created_at: '2024-06-22T01:21:14.842692+00:00',
        target_name: 'MAY88',
        url: 'https://may88.com/',
        login_url: 'https://may88.com/api/v1/login',
        domain: 'may88.com',
      },
      XO88: {
        id: 7,
        created_at: '2024-06-22T01:21:55.185438+00:00',
        target_name: 'XO88',
        url: 'https://xo88.com/',
        login_url: 'https://xo88.com/api/v1/login',
        domain: 'xo88.com',
      },
      SV88: {
        id: 8,
        created_at: '2024-06-22T01:25:22.726263+00:00',
        target_name: 'SV88',
        url: 'https://sv88.top/',
        login_url: 'https://sv88.top/api/v1/login',
        domain: 'sv88.top',
      },
      FIVE88: {
        id: 9,
        created_at: '2024-06-22T01:27:44.928003+00:00',
        target_name: 'FIVE88',
        url: 'https://five88.vin/',
        login_url: 'https://five88.vin/login.aspx',
        domain: 'five88.vin',
      },
      TA88: {
        id: 11,
        created_at: '2024-06-22T01:28:47.88524+00:00',
        target_name: 'TA88',
        url: 'https://ta88.me/',
        login_url: 'https://ta88.me/api/v1/login',
        domain: 'ta88.me',
      },
      ONE88: {
        id: 12,
        created_at: '2024-06-22T01:30:42.342125+00:00',
        target_name: 'ONE88',
        url: 'https://one88.in/',
        login_url: 'https://one88.in/api/v1/login',
        domain: 'one88.in',
      },
      M11BET: {
        id: 13,
        created_at: '2024-06-22T01:33:44.453495+00:00',
        target_name: 'M11BET',
        url: 'https://11bet.gg/',
        login_url: 'https://11bet.gg/api/v1/login',
        domain: '11bet.gg',
      },
      MU99: {
        id: 14,
        created_at: '2024-06-22T01:34:29.356604+00:00',
        target_name: 'MU99',
        url: 'https://mu9.vin/',
        login_url: 'https://api.mu9.vin/users/login',
        domain: 'mu9.vin',
      },
      OXBET: {
        id: 15,
        created_at: '2024-06-22T01:37:26.527581+00:00',
        target_name: 'OXBET',
        url: 'https://oxbet.in/',
        login_url: 'https://oxbet.in/api/v1/login',
        domain: 'oxbet.in',
      },
      SKY88: {
        id: 16,
        created_at: '2024-06-22T01:41:26.966405+00:00',
        target_name: 'SKY88',
        url: 'https://sky88.com/',
        login_url: 'https://api.sky88.com/users/login',
        domain: 'sky88.com',
      },
      LODE88: {
        id: 17,
        created_at: '2024-06-22T01:42:16.234114+00:00',
        target_name: 'LODE88',
        url: 'https://lode88.ai/',
        login_url: 'https://lode88.ai/api/v1/login',
        domain: 'lode88.ai',
      },
      RED88: {
        id: 18,
        created_at: '2024-06-22T01:42:48.699839+00:00',
        target_name: 'RED88',
        url: 'https://red88.com/',
        login_url: 'https://api.red88.com/users/login',
        domain: 'red88.com',
      },
      ZBET: {
        id: 19,
        created_at: '2024-06-22T03:01:20.406424+00:00',
        target_name: 'ZBET',
        url: 'https://zbet.com/',
        login_url: 'https://zbet.tv/api-v1/v1/login',
        domain: 'zbet.com',
      },
      B52: {
        id: 3,
        created_at: '2024-06-22T00:58:27.48554+00:00',
        target_name: 'B52',
        url: 'https://web.b52.vin/',
        login_url: 'https://bfivegwlog.gwtenkges.com/user/login.aspx',
        domain: 'web.b52.vin',
      },
      HIT: {
        id: 2,
        created_at: '2024-05-30T17:39:02.788806+00:00',
        target_name: 'HIT',
        url: 'https://web.hitclub.win/',
        login_url: 'https://bodergatez.dsrcgoms.net/user/login.aspx',
        domain: 'web.hitclub.win',
      },
      RIK: {
        id: 1,
        created_at: '2024-05-30T17:27:18.109633+00:00',
        target_name: 'RIK',
        url: 'https://play.rikvip.win',
        login_url: 'https://bordergw.api-inovated.com/user/login.aspx',
        domain: 'play.rikvip.win',
      },
      UK88: {
        id: 10,
        created_at: '2024-06-22T01:28:17.799331+00:00',
        target_name: 'UK88',
        url: 'https://uk88.club/',
        login_url: 'https://uk88.club/api/v1/login',
        domain: 'uk88.club',
      },
    };
  }
};

setupLink();
const setHeaderForRik = async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.RIK.domain}`;
    newHeaders['Origin'] = `https://${targetSites.RIK.domain}`;
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForB52 = async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.B52.domain}`;
    newHeaders['Origin'] = `https://${targetSites.B52.domain}`;
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForIwin = async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.IWIN.domain}`;
    newHeaders['Origin'] = `https://${targetSites.IWIN.domain}`;
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForSunWin = async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://web.sunwin.uk/';
    newHeaders['Origin'] = 'https://web.sunwin.uk/';
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForIWin = async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://play.iwin.net/';
    newHeaders['Origin'] = 'https://play.iwin.net/';
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForHit = async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.HIT.domain}`;
    newHeaders['Origin'] = `https://${targetSites.HIT.domain}`;
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForDebet = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.DEBET.domain}`;
    newHeaders['Origin'] = `https://${targetSites.DEBET.domain}`;
    newHeaders['Accept'] = 'application/json, text/plain, */*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `_gid=GA1.2.704473547.1716609101; strongPassword=1; _pk_id.4.d164=a9d05cad470f262c.1716609101.; domain=https%3A%2F%2F${targetSites.DEBET.domain}; host=${targetSites.DEBET.domain}; device=desktop; _gcl_au=1.1.1510002727.1716609102; luckyNumber=54; showPopupDomain=true; whitelist=true; _pk_ses.4.d164=1; _clck=1l21aao%7C2%7Cfm2%7C0%7C1606; vgmnid=13838.84719695447221716609103001; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; _ga=GA1.1.512047530.1716312616; _ga_YB99BJW0HQ=GS1.1.1716608406.3.1.1716609185.59.0.0; _clsk=rr7nm6%7C1716609424069%7C3%7C1%7Cx.clarity.ms%2Fcollect; _ga_WX6RHFP3H4=GS1.1.1716607825.3.1.1716609451.0.0.0`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForFive88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['accept'] = 'application/json, text/javascript, */*; q=0.01';
    newHeaders['accept-language'] = 'en-US,en;q=0.9';
    newHeaders['content-type'] =
      'application/x-www-form-urlencoded; charset=UTF-8';
    newHeaders['cookie'] =
      '_gcl_au=1.1.543274646.1718973713; _gid=GA1.2.357644726.1718973713; PHPSESSID=1d52c1a616b4274f34f3ce0094b79449; io=qYUzxdMHo7CVTC-rAFI5; _stoken=1f1d9ec3f7ca4f86bbdcff3bff31b375; _gat_UA-238184817-1=1; _gat_UA-156072496-1=1; _ga_V2TKQNQHHX=GS1.1.1718983166.2.0.1718983166.60.0.0; _ga=GA1.2.1480773597.1718973713; __utma=63665976.1480773597.1718973713.1718983167.1718983167.1; __utmc=63665976; __utmz=63665976.1718983167.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _ga_D2M74VZWV7=GS1.1.1718983166.2.0.1718983170.0.0.0; __utmb=63665976.10.7.1718983187919; _ga_5QSLVWX8N6=GS1.2.1718983166.2.1.1718983187.0.0.0';
    newHeaders['origin'] = targetSites.FIVE88.url;
    newHeaders['priority'] = 'u=1, i';
    newHeaders['referer'] = targetSites.FIVE88.url;
    newHeaders['sec-ch-ua'] =
      '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"';
    newHeaders['sec-ch-ua-mobile'] = '?0';
    newHeaders['sec-ch-ua-platform'] = '"Windows"';
    newHeaders['sec-fetch-dest'] = 'empty';
    newHeaders['sec-fetch-mode'] = 'cors';
    newHeaders['sec-fetch-site'] = 'same-origin';
    newHeaders['user-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
    newHeaders['x-requested-with'] = 'XMLHttpRequest';
    callback({ requestHeaders: newHeaders });
  });
};

const setHeaderForMay88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.MAY88.domain}`;
    newHeaders['Origin'] = `https://${targetSites.MAY88.domain}`;
    newHeaders['Accept'] = 'application/json, text/plain, */*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; _gcl_au=1.1.732562051.1716726234; _ga_171YF2R0MV=GS1.1.1716726234.1.0.1716726234.0.0.0; _ga=GA1.2.314653449.1716726234; _gid=GA1.2.245976383.1716726234; _gat_UA-185855122-1=1; _ga_LNECPR22W8=GS1.2.1716726234.1.0.1716726234.60.0.0';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForXo88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = targetSites.XO88.url + 'game-bai';
    newHeaders['Origin'] = `https://${targetSites.XO88.domain}`;
    newHeaders['Accept'] = 'application/json, text/plain, */*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; domain=https%3A%2F%2F${targetSites.XO88.domain}; host=${targetSites.XO88.domain}; showed=Wed%20May%2029%202024%2023%3A14%3A33%20GMT+0700%20%28Indochina%20Time%29`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForSv88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.SV88.domain}/game-bai`;
    newHeaders['Origin'] = `https://${targetSites.SV88.domain}`;
    newHeaders['Accept'] = 'application/json, text/plain, */*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; domain=https%3A%2F%2F${targetSites.SV88.domain}; host=${targetSites.SV88.domain}; showed=Wed%20May%2029%202024%2023%3A14%3A33%20GMT+0700%20%28Indochina%20Time%29`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForM11BET = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.M11BET.domain}`;
    newHeaders['Origin'] = `https://${targetSites.M11BET.domain}`;
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; os=desktop; source=${targetSites.M11BET.domain}; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null; mien-bac=1717067700000; mien-trung=1717064100000; mien-nam=1717060500000; whitelist=true; hideTooltipScheduleHome=true`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForOne88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.ONE88.domain}`;
    newHeaders['Origin'] = `https://${targetSites.ONE88.domain}`;
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; os=desktop; source=${targetSites.M11BET.domain}; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForUk88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.UK88.domain}`;
    newHeaders['Origin'] = `https://${targetSites.UK88.domain}`;
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; os=desktop; source=${targetSites.M11BET.domain}; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForMu99 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.MU99.domain}`;
    newHeaders['Origin'] = `https://${targetSites.MU99.domain}`;
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; os=desktop; source=${targetSites.MU99.domain}; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForTa88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.TA88.domain}`;
    newHeaders['Origin'] = `https://${targetSites.TA88.domain}`;
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; os=desktop; source=${targetSites.MU99.domain}; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForZbet = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.ZBET.domain}`;
    newHeaders['Origin'] = `https://${targetSites.ZBET.domain}`;
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `device=desktop; os=desktop; source=${targetSites.ZBET.domain}; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null`;
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForLucky88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.LUCKY88.domain}`;
    newHeaders['Origin'] = `https://${targetSites.LUCKY88.domain}`;
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    (newHeaders[
      'Cookie'
    ] = `device=desktop; source=${targetSites.LUCKY88.domain}; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null; notify_2517=true; _gid=GA1.2.482221069.1718447108; _gat_UA-111397367-1=1; whitelist=true; _ga=GA1.1.1780038016.1718447108; _hjSessionUser_2509823=eyJpZCI6IjM2YTk4OGE5LTNiZWYtNTNkNi1hNGQ3LTBjYzAzM2RiOGFhMSIsImNyZWF0ZWQiOjE3MTg0NDcxMDg0OTYsImV4aXN0aW5nIjpmYWxzZX0=; _hjSession_2509823=eyJpZCI6IjQ3ZTMxOWJiLTBkY2ItNGUzYS1hY2U2LWVlNmUxMTQzNGExYSIsImMiOjE3MTg0NDcxMDg0OTcsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; _ga_P59W5KG65E=GS1.2.1718447108.1.0.1718447108.0.0.0; _ga_46CET3FGH7=GS1.1.1718447108.1.0.1718447120.0.0.0`),
      (newHeaders['Priority'] = 'u=1, i');
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForRed88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['accept'] = 'application/json, text/plain, */*';
    newHeaders['accept-language'] = 'en-US,en;q=0.9';
    newHeaders['browser'] = 'Edge';
    newHeaders['content-type'] = 'application/json';
    newHeaders['device'] = 'pc';
    newHeaders['origin'] = `https://${targetSites.RED88.domain}`;
    newHeaders['os'] = 'Windows 10';
    newHeaders['priority'] = 'u=1, i';
    newHeaders['referer'] = `https://${targetSites.RED88.domain}`;
    newHeaders['sec-ch-ua'] =
      '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"';
    newHeaders['sec-ch-ua-mobile'] = '?0';
    newHeaders['sec-ch-ua-platform'] = '"Windows"';
    newHeaders['sec-fetch-dest'] = 'empty';
    newHeaders['sec-fetch-mode'] = 'cors';
    newHeaders['sec-fetch-site'] = 'same-site';
    newHeaders['user-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderLode88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.LODE88.domain}`;
    newHeaders['Origin'] = `https://${targetSites.LODE88.domain}`;
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    (newHeaders[
      'Cookie'
    ] = `_gid=GA1.2.962535063.1718893045; device=desktop; domain=https%3A%2F%2Fl${targetSites.LUCKY88.domain}; host=${targetSites.LUCKY88.domain}; vgmnid=13145.92260958204761718970712433; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; notificationTime=%222024-06-22T11%3A52%3A23.084Z%22; reloadCount=0; _gat_UA-177224808-1=1; _ga=GA1.2.451142714.1718893045; _ga_GLGHQW1XYP=GS1.1.1718969217.2.1.1718970765.0.0.0; _ga_BDKVWDCWMC=GS1.2.1718969217.2.1.1718970768.0.0.0`),
      (newHeaders['Priority'] = 'u=1, i');
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForOxbet = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = `https://${targetSites.OXBET.domain}`;
    newHeaders['Origin'] = `https://${targetSites.OXBET.domain}`;
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    (newHeaders[
      'Cookie'
    ] = `_gid=GA1.2.962535063.1718893045; device=desktop; domain=https%3A%2F%2F${targetSites.LUCKY88.domain}; host=${targetSites.LUCKY88.domain}; vgmnid=13145.92260958204761718970712433; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; notificationTime=%222024-06-22T11%3A52%3A23.084Z%22; reloadCount=0; _gat_UA-177224808-1=1; _ga=GA1.2.451142714.1718893045; _ga_GLGHQW1XYP=GS1.1.1718969217.2.1.1718970765.0.0.0; _ga_BDKVWDCWMC=GS1.2.1718969217.2.1.1718970768.0.0.0`),
      (newHeaders['Priority'] = 'u=1, i');
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForSky88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['accept'] = 'application/json, text/plain, */*';
    newHeaders['accept-language'] = 'en-US,en;q=0.9';
    newHeaders['browser'] = 'Edge';
    newHeaders['content-type'] = 'application/json';
    newHeaders['device'] = 'pc';
    newHeaders['origin'] = `https://${targetSites.SKY88.domain}`;
    newHeaders['os'] = 'Windows 10';
    newHeaders['priority'] = 'u=1, i';
    newHeaders['referer'] = `https://${targetSites.SKY88.domain}`;
    newHeaders['sec-ch-ua'] =
      '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"';
    newHeaders['sec-ch-ua-mobile'] = '?0';
    newHeaders['sec-ch-ua-platform'] = '"Windows"';
    newHeaders['sec-fetch-dest'] = 'empty';
    newHeaders['sec-fetch-mode'] = 'cors';
    newHeaders['sec-fetch-site'] = 'same-site';
    newHeaders['user-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
    callback({ requestHeaders: newHeaders });
  });
};

const setContentTypeJson = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Content-Type'] = 'application/json';
    callback({ requestHeaders: newHeaders });
  });
};
const setContentTypeTextPlain = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
    callback({ requestHeaders: newHeaders });
  });
};

let currentHeader: string;

export const setupHeaderHandlers = () => {
  const changeHeader = (target: string) => {
    if (currentHeader === target) {
      return;
    }
    currentHeader = target;
    switch (target) {
      case 'RIK':
        setHeaderForRik();
        break;
      case 'HIT':
        setHeaderForHit();
        break;
      case 'B52':
        setHeaderForB52();
        break;
      case 'IWIN':
        setHeaderForIwin();
        break;
      case 'SUNWIN':
        setHeaderForSunWin();
        break;
      case 'IWIN':
        setHeaderForIWin();
        break;
      case 'LUCKY88':
        setHeaderForLucky88();
        break;
      case 'DEBET':
        setHeaderForDebet();
        break;
      case 'MAY88':
        setHeaderForMay88();
        break;
      case 'SV88':
        setHeaderForSv88();
        break;
      case 'XO88':
        setHeaderForXo88();
        break;
      case 'FIVE88':
        setHeaderForFive88();
        break;
      case 'UK88':
        setHeaderForUk88();
        break;
      case 'TA88':
        setHeaderForTa88();
        break;
      case 'MU99':
        setHeaderForMu99();
        break;
      case 'ONE88':
        setHeaderForOne88();
        break;
      case 'ZBET':
        setHeaderForZbet();
        break;
      case 'M11BET':
        setHeaderForM11BET();
        break;
      case 'OXBET':
        setHeaderForOxbet();
        break;
      case 'SKY88':
        setHeaderForSky88();
        break;
      case 'LODE88':
        setHeaderLode88();
        break;
      case 'RED88':
        setHeaderForRed88();
        break;
      case 'JSON':
        setContentTypeJson();
        break;
      case 'TEXTPLAINT':
        setContentTypeTextPlain();
        break;
      default:
        throw new Error(`Unsupported target site: ${target}`);
    }
  };

  ipcMain.on('update-header', (event, targetSites) => {
    changeHeader(targetSites);
  });
};
