import { clsx, type ClassValue } from 'clsx';
import CryptoJS from 'crypto-js';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomHex = (size: number): string => {
  const randomBytes = CryptoJS.lib.WordArray.random(size);
  return randomBytes.toString(CryptoJS.enc.Hex);
};
export const generateRandomCode = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
export const getRandomOS = (): string => {
  const osChoices = ['OS X', 'Windows'];
  return osChoices[Math.floor(Math.random() * osChoices.length)];
};
export const getRandomBrowser = (): string => {
  const browserChoices = ['chrome'];
  return browserChoices[Math.floor(Math.random() * browserChoices.length)];
};
export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const isMatchCards = (cardPlayer1: any[], cardPlayer2: any[]) => {
  if (cardPlayer1.length < 2 || cardPlayer2.length < 2) {
    return false;
  }

  const isFound1 =
    cardPlayer1[0] === cardPlayer2[0] || cardPlayer1[0] === cardPlayer2[1];
  const isFound2 =
    cardPlayer1[1] === cardPlayer2[0] || cardPlayer1[1] === cardPlayer2[1];

  return isFound1 && isFound2;
};
const generateRandomNumber = (length: number) => {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generateRandomCookie = () => {
  const randomValue1 = generateRandomNumber(10);
  const randomValue2 = generateRandomNumber(10);
  const randomValue3 = generateRandomNumber(10);
  const randomValue4 = generateRandomNumber(10);
  const randomValue5 = generateRandomNumber(10);
  const randomValue6 = generateRandomNumber(10);
  const randomValue7 = generateRandomNumber(10);

  return `device=desktop; _gcl_au=1.1.${randomValue1}.${randomValue2}; _ga_171YF2R0MV=GS1.1.${randomValue3}.1.0.${randomValue4}.0.0.0; _ga=GA1.2.${randomValue5}.${randomValue6}; _gid=GA1.2.${randomValue7}.${randomValue2}; _gat_UA-185855122-1=1; _ga_LNECPR22W8=GS1.2.${randomValue3}.1.0.${randomValue4}.60.0.0`;
};

export const generateRandomFg = () => {
  return Math.random().toString(36).substring(2, 18);
};

export const delay = (ms: number | undefined) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
