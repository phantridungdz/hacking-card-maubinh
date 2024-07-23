/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import path from 'path';
import { URL } from 'url';
import {
  loginB52Command,
  loginHitCommand,
  loginRikCommand,
} from './command/command';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const getLoginCommand = (account: any) => {
  switch (account.targetSite) {
    case 'RIK':
      return loginRikCommand(account);
    case 'B52':
      return loginB52Command(account);
    default:
      return loginHitCommand(account);
  }
};

export const generateUrl = (
  brand: string,
  token: string,
  target: string,
  ru: string
) => {
  let baseUrl;

  switch (target) {
    case 'HIT':
      baseUrl = 'https://games.gnightfast.net/';
      break;
    case 'B52':
      baseUrl = 'https://gamebai.b5richkids.net/';
      ru = '';
      break;
    default:
      baseUrl = 'https://games.prorichvip.com/';
      break;
  }

  return `${baseUrl}?brand=${brand.toLowerCase()}&token=${token}&gameid=vgcg_1&ru=${ru}`;
};
