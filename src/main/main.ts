import { BrowserWindow, app, session, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { loadExtensions } from './extension/installer';
import { setupAccountHandlers } from './handler/accountsHandlers';
import { setupArrangeCardHandlers } from './handler/arrangeCardHandlers';
import { setupFileHandlers } from './handler/fileHandlers';
import { setupLoginHitHandlers } from './handler/loginHitPupHandler';
import { setupProxyWebsocketHandler } from './handler/proxyWebsocketHandler';
import { setupReadHardwareHandlers } from './handler/readHardwareHandler';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

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

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 1280,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

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
    newHeaders['Referer'] = 'https://web.hitclub.win/';
    newHeaders['Origin'] = 'https://web.hitclub.win/';
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

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });
  mainWindow.webContents.on('devtools-opened', () => {
    if (process.env.NODE_ENV !== 'development') {
      console.log('DevTools opened');
      app.quit();
    }
  });

  function detectDebugger() {
    if (mainWindow && mainWindow.webContents.isDevToolsOpened()) {
      if (process.env.NODE_ENV !== 'development') {
        console.log('Debugger detected');
        app.quit();
      }
    }
  }

  setInterval(detectDebugger, 20000);

  // Listen for the 'devtools-closed' event
  mainWindow.webContents.on('devtools-closed', () => {
    console.log('DevTools closed');
    // mainWindow.webContents.send('devtools-status', false);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  setupReadHardwareHandlers();
  setupFileHandlers();
  setupAccountHandlers(mainWindow);
  setupArrangeCardHandlers();
  setupProxyWebsocketHandler();
  setupLoginHitHandlers();

  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const extensions = [
  {
    id: 'lmhkpmbekcpmknklioeibfkpmmfibljd', // React DevTools ID
    version: '3.1.6_0',
  },
  // {
  //   id: 'fmkadmapgofadopljbjfkapdkoienihi',
  //   version: '5.2.0_0',
  // },
];

app
  .whenReady()
  .then(async () => {
    await loadExtensions(extensions);
    await createWindow();

    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
