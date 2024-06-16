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

const setHeaderForRik = async () => {
  let targetUrls = await getTargetUrl();
  const rikTarget = targetUrls
    ? targetUrls.find((target) => target.target_name === 'RIK')
    : '';
  const rikUrl = rikTarget ? rikTarget.url : '';
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-control-allow-origin'] = [rikUrl];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = rikUrl;
    newHeaders['Origin'] = rikUrl;
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
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-control-allow-origin'] = ['https://web.b52.vin'];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://web.b52.vin';
    newHeaders['Origin'] = 'https://web.b52.vin';
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
  let targetUrls = await getTargetUrl();
  const rikUrl = targetUrls ? targetUrls[0].url : '';
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-control-allow-origin'] = [rikUrl];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

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
const setHeaderForHit = async () => {
  let targetUrls = await getTargetUrl();
  const rikUrl = targetUrls ? targetUrls[0].url : '';
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-control-allow-origin'] = [rikUrl];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = rikUrl;
    newHeaders['Origin'] = rikUrl;
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
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-control-allow-origin'] = ['https://debet.net'];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://debet.net';
    newHeaders['Origin'] = 'https://debet.net';
    newHeaders['Accept'] = 'application/json, text/plain, */*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json;charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders[
      'Cookie'
    ] = `_gid=GA1.2.704473547.1716609101; strongPassword=1; _pk_id.4.d164=a9d05cad470f262c.1716609101.; domain=https%3A%2F%2Fdebet.net; host=debet.net; device=desktop; _gcl_au=1.1.1510002727.1716609102; luckyNumber=54; showPopupDomain=true; whitelist=true; _pk_ses.4.d164=1; _clck=1l21aao%7C2%7Cfm2%7C0%7C1606; vgmnid=13838.84719695447221716609103001; mini-opened=%7B%22aviator%22%3A%7B%22left%22%3Anull%2C%22top%22%3A150%7D%2C%22taixiu%22%3A%7B%7D%2C%22hilo%22%3A%7B%7D%2C%22poker%22%3A%7B%7D%7D; _ga=GA1.1.512047530.1716312616; _ga_YB99BJW0HQ=GS1.1.1716608406.3.1.1716609185.59.0.0; _clsk=rr7nm6%7C1716609424069%7C3%7C1%7Cx.clarity.ms%2Fcollect; _ga_WX6RHFP3H4=GS1.1.1716607825.3.1.1716609451.0.0.0`;
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
    newHeaders['Referer'] = 'https://five88.vin';
    newHeaders['Origin'] = 'https://five88.vin';
    newHeaders['Accept'] = 'application/json, text/javascript, */*; q=0.01';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] =
      'application/x-www-form-urlencoded; charset=UTF-8';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'PHPSESSID=5fce472f3e07e13f1673ddb99de973d7; _gcl_au=1.1.631577307.1716999653; _ga_V2TKQNQHHX=GS1.1.1716999652.1.0.1716999652.60.0.0; _gid=GA1.2.1444793540.1716999653; _gat_UA-238184817-1=1; _gat_UA-156072496-1=1; _stoken=f050d05650fd76c373aa9a79f854573c; _ga=GA1.2.802994207.1716999653; __utma=63665976.802994207.1716999653.1716999657.1716999657.1; __utmc=63665976; __utmz=63665976.1716999657.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga_D2M74VZWV7=GS1.1.1716999652.1.0.1716999658.0.0.0; __utmb=63665976.3.9.1716999664228; _ga_5QSLVWX8N6=GS1.2.1716999653.1.1.1716999664.0.0.0';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderForMay88 = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://may88.game';
    newHeaders['Origin'] = 'https://may88.game';
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
    newHeaders['Referer'] = 'https://xo88.us/game-bai';
    newHeaders['Origin'] = 'https://xo88.us';
    newHeaders['Accept'] = 'application/json, text/plain, */*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; domain=https%3A%2F%2Fxo88.us; host=xo88.us; showed=Wed%20May%2029%202024%2023%3A14%3A33%20GMT+0700%20%28Indochina%20Time%29';
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
    newHeaders['Referer'] = 'https://sv88.top/game-bai';
    newHeaders['Origin'] = 'https://sv88.top';
    newHeaders['Accept'] = 'application/json, text/plain, */*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; domain=https%3A%2F%2Fsv88.top; host=sv88.top; showed=Wed%20May%2029%202024%2023%3A14%3A33%20GMT+0700%20%28Indochina%20Time%29';
    newHeaders['Priority'] = 'u=1, i';
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
    callback({ requestHeaders: newHeaders });
  });
};
const setHeaderFor11BET = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://11bet.uk';
    newHeaders['Origin'] = 'https://11bet.uk';
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; os=desktop; source=11bet.uk; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null; mien-bac=1717067700000; mien-trung=1717064100000; mien-nam=1717060500000; whitelist=true; hideTooltipScheduleHome=true';
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
    newHeaders['Referer'] = 'https://one88.com';
    newHeaders['Origin'] = 'https://one88.com';
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; os=desktop; source=one88.com; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null';
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
    newHeaders['Referer'] = 'https://uk88.com';
    newHeaders['Origin'] = 'https://uk88.com';
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; os=desktop; source=uk88.com; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null';
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
    newHeaders['Referer'] = 'https://mu99.vin';
    newHeaders['Origin'] = 'https://mu99.vin';
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; os=desktop; source=mu99.vin; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null';
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
    newHeaders['Referer'] = 'https://ta88.com';
    newHeaders['Origin'] = 'https://ta88.com';
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; os=desktop; source=ta88.com; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null';
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
    newHeaders['Referer'] = 'https://zbet.com';
    newHeaders['Origin'] = 'https://zbet.com';
    newHeaders['Accept'] = 'application/json';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    newHeaders['Cookie'] =
      'device=desktop; os=desktop; source=uk88.com; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null';
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
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-control-allow-origin'] = ['https://lucky88.com'];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://lucky88.com';
    newHeaders['Origin'] = 'https://lucky88.com';
    newHeaders['Accept'] = '*/*';
    newHeaders['Accept-encoding'] = 'gzip, deflate, br, zstd';
    newHeaders['Accept-language'] = 'en-US,en;q=0.9';
    newHeaders['Content-Type'] = 'application/json';
    newHeaders['Dnt'] = '1';
    (newHeaders['Cookie'] =
      'device=desktop; source=lucky88.com; saleAdvised=null; aff_id=null; utm_source=null; utm_medium=null; utm_campaign=null; utm_term=null; utm_content=null; notify_2517=true; _gid=GA1.2.482221069.1718447108; _gat_UA-111397367-1=1; whitelist=true; _ga=GA1.1.1780038016.1718447108; _hjSessionUser_2509823=eyJpZCI6IjM2YTk4OGE5LTNiZWYtNTNkNi1hNGQ3LTBjYzAzM2RiOGFhMSIsImNyZWF0ZWQiOjE3MTg0NDcxMDg0OTYsImV4aXN0aW5nIjpmYWxzZX0=; _hjSession_2509823=eyJpZCI6IjQ3ZTMxOWJiLTBkY2ItNGUzYS1hY2U2LWVlNmUxMTQzNGExYSIsImMiOjE3MTg0NDcxMDg0OTcsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; _ga_P59W5KG65E=GS1.2.1718447108.1.0.1718447108.0.0.0; _ga_46CET3FGH7=GS1.1.1718447108.1.0.1718447120.0.0.0'),
      (newHeaders['Priority'] = 'u=1, i');
    newHeaders['User-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0';
    newHeaders[
      'Sec-ch-ua'
    ] = `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`;
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
      case 'SUNWIN':
        setHeaderForSunWin();
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
      case '11BET':
        setHeaderFor11BET();
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
