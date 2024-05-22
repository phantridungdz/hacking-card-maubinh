import { ipcMain, session } from 'electron';
const randomUseragent = require('random-useragent');

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

const setHeaderForRik = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-Control-Allow-Origin'] = ['https://web.hitclub.win'];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://play.rikvip.win';
    newHeaders['Origin'] = 'https://play.rikvip.win';
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
const setHeaderForHit = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = capitalizeHeaderKeys(
      details.responseHeaders as Record<string, string[]>
    );
    newHeaders['Access-Control-Allow-Origin'] = ['https://web.hitclub.win'];
    newHeaders['Cf-cache-status'] = ['DYNAMIC'];
    callback({ responseHeaders: newHeaders });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const newHeaders = capitalizeRequestHeaderKeys(
      details.requestHeaders as Record<string, string>
    );
    newHeaders['Referer'] = 'https://web.hitclub.win';
    newHeaders['Origin'] = 'https://web.hitclub.win';
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

export const setupHeaderHandlers = () => {
  setHeaderForRik();
  const changeHeader = (target: string) => {
    if (target === 'HIT') {
      console.log('Change header for HIT');
      setHeaderForHit();
    } else {
      console.log('Change header for RIK');
      setHeaderForRik();
    }
  };

  ipcMain.on('update-header', (event, targetSites) => {
    changeHeader(targetSites);
  });
};
