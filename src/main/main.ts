import { BrowserWindow, app, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { loadExtensions } from './extension/installer';
import { setupAccountHandlers } from './handler/accountsHandlers';
import { setupFileHandlers } from './handler/fileHandlers';
import { setupHeaderHandlers } from './handler/headerHandlers';
import { setupProxyHandler } from './handler/proxyHandler';
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
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'false';

if (isDebug) {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 1280,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      contextIsolation: true,
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
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

  // mainWindow.webContents.on('devtools-closed', () => {
  //   console.log('DevTools closed');
  // });

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
  // setupArrangeCardHandlers();
  setupProxyWebsocketHandler();
  setupHeaderHandlers();
  setupProxyHandler();

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
    app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');
    app.commandLine.appendSwitch('renderer-process-limit', '100');
    app.commandLine.appendSwitch('ignore-connections-limit', 'true');
    app.commandLine.appendSwitch('disable-http2');

    await loadExtensions(extensions);
    await createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
