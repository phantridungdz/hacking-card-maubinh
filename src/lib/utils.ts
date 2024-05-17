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
export const getRandomOS = (): string => {
  const osChoices = ['Mac', 'Windows', 'Linux'];
  return osChoices[Math.floor(Math.random() * osChoices.length)];
};
export const getRandomBrowser = (): string => {
  const browserChoices = ['chrome', 'safari', 'edge', 'firefox', 'opera'];
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

export const generateRandomFg = () => {
  return Math.random().toString(36).substring(2, 18);
};
