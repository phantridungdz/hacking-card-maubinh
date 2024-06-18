import AdmZip from 'adm-zip';
import { app, dialog, ipcMain } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';

export const setupFileHandlers = () => {
  ipcMain.on('read-file', (event, filePath, accountType) => {
    const usernamePc = os.userInfo().username;
    let userProfilePath;
    if (process.env.NODE_ENV != 'development') {
      if (os.platform() === 'win32') {
        userProfilePath = path.join(
          'C:/Users',
          usernamePc,
          'AppData/Local/Programs/matisse/resources',
          filePath[0]
        );
      } else if (os.platform() === 'darwin') {
        userProfilePath = path.join(
          '/Users',
          usernamePc,
          'AppData/Local/Programs/matisse/resources',
          filePath[0]
        );
      } else {
        userProfilePath = path.join(
          '/home',
          usernamePc,
          'AppData/Local/Programs/matisse/resources',
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
    });
  });

  ipcMain.on('update-file', (event, data, filePath, accountType) => {
    const usernamePc = os.userInfo().username;
    let userProfilePath;
    if (process.env.NODE_ENV != 'development') {
      if (os.platform() === 'win32') {
        userProfilePath = path.join(
          'C:/Users',
          usernamePc,
          'AppData/Local/Programs/matisse/resources',
          filePath[0]
        );
      } else if (os.platform() === 'darwin') {
        userProfilePath = path.join(
          '/Users',
          usernamePc,
          'AppData/Local/Programs/matisse/resources',
          filePath[0]
        );
      } else {
        userProfilePath = path.join(
          '/home',
          usernamePc,
          'AppData/Local/Programs/matisse/resources',
          filePath[0]
        );
      }
    } else {
      userProfilePath = filePath[0];
    }
    if (filePath && userProfilePath) {
      fs.writeFile(userProfilePath, data, (err) => {
        if (err) {
          console.log('Error writing file:', err);
          event.reply('file-write-error', err.message);
          return;
        }
        event.reply('file-updated', data, accountType);
      });
    }
  });

  // Handle backup
  ipcMain.on('backup-data', async (event) => {
    const result = await dialog.showSaveDialog({
      title: 'Select the File Path to save',
      buttonLabel: 'Save',
      defaultPath: path.join(app.getPath('desktop'), 'accounts_backup.zip'),
      filters: [
        {
          name: 'Zip Files',
          extensions: ['zip'],
        },
      ],
    });
    const usernamePc = os.userInfo().username;
    let userProfilePath;
    if (process.env.NODE_ENV != 'development') {
      if (os.platform() === 'win32') {
        userProfilePath = path.join(
          'C:/Users',
          usernamePc,
          'AppData/Local/Programs/matisse/resources/account'
        );
      } else if (os.platform() === 'darwin') {
        userProfilePath = path.join(
          '/Users',
          usernamePc,
          'AppData/Local/Programs/matisse/resources/account'
        );
      } else {
        userProfilePath = path.join(
          '/home',
          usernamePc,
          'AppData/Local/Programs/matisse/resources/account'
        );
      }
    } else {
      userProfilePath = 'account';
    }

    if (!result.canceled && result.filePath) {
      const zip = new AdmZip();
      zip.addLocalFolder(userProfilePath);
      zip.writeZip(result.filePath, (err: any) => {
        if (err) {
          console.log('Error creating zip:', err);
          event.reply('backup-error', err.message);
        } else {
          event.reply('backup-success', result.filePath);
        }
      });
    }
  });

  // Handle restore
  ipcMain.on('restore-data', async (event) => {
    const result = await dialog.showOpenDialog({
      title: 'Select the File to restore',
      buttonLabel: 'Open',
      defaultPath: app.getPath('desktop'),
      filters: [
        {
          name: 'Zip Files',
          extensions: ['zip'],
        },
      ],
      properties: ['openFile'],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const zip = new AdmZip(filePath);
      const usernamePc = os.userInfo().username;
      let userProfilePath;
      if (process.env.NODE_ENV != 'development') {
        if (os.platform() === 'win32') {
          userProfilePath = path.join(
            'C:/Users',
            usernamePc,
            'AppData/Local/Programs/matisse/resources/account'
          );
        } else if (os.platform() === 'darwin') {
          userProfilePath = path.join(
            '/Users',
            usernamePc,
            'AppData/Local/Programs/matisse/resources/account'
          );
        } else {
          userProfilePath = path.join(
            '/home',
            usernamePc,
            'AppData/Local/Programs/matisse/resources/account'
          );
        }
      } else {
        userProfilePath = 'account';
      }
      zip.extractAllTo(userProfilePath, true);
      app.relaunch();
      app.exit(0);
    }
  });
};
