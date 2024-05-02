import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
const os = require('os');

export const setupFileHandlers = () => {
  ipcMain.on('read-file', (event, filePath, accountType) => {
    const usernamePc = os.userInfo().username;
    let userProfilePath;
    if (process.env.NODE_ENV != 'development') {
      if (os.platform() === 'win32') {
        userProfilePath = path.join(
          'C:/Users',
          usernamePc,
          'Programs/electron-react-boilerplate/resources',
          filePath[0]
        );
      } else if (os.platform() === 'darwin') {
        userProfilePath = path.join(
          '/Users',
          usernamePc,
          'Programs/electron-react-boilerplate/resources',
          filePath[0]
        );
      } else {
        userProfilePath = path.join(
          '/home',
          usernamePc,
          'Programs/electron-react-boilerplate/resources',
          filePath[0]
        );
      }
    } else {
      userProfilePath = filePath[0];
    }
    fs.readFile(userProfilePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.log('Error reading file:', err);
        event.reply('file-read-error', err.message);
        return;
      }
      event.reply('read-file', data, accountType);
      console.log('Readed File:', data);
    });
  });

  ipcMain.on('update-file', (event, data, filePath, accountType) => {
    if (filePath && typeof filePath[0] === 'string') {
      fs.writeFile(filePath[0], data, (err) => {
        if (err) {
          console.log('Error writing file:', err);
          event.reply('file-write-error', err.message);
          return;
        }
        event.reply('file-updated', data, accountType);
      });
    }
  });
};
