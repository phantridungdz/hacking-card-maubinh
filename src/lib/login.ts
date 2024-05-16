import axios, { AxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';
import { BotStatus } from '../renderer/providers/app';
import { loginUrl } from './config';

export interface LoginResponseDto {
  avatar: string;
  deposit_today: number;
  event_deposit_max: number;
  fullname: string;
  is_deposit: boolean;
  level: string;
  main_balance: number;
  session_id: string;
  token: string;
  username: string;
  status?: BotStatus;
  currentCard?: number[];
  isReconnected?: boolean;
  uid: string[];
}

export interface LoginResponse {
  code: number;
  message: string;
  status: string;
  data: Array<LoginResponseDto>;
}

export interface LoginParams {
  username: string;
  password: string;
  app_id: string;
  os: string;
  device: string;
  browser: string;
  fg: string;
  time: number;
  aff_id: string;
  proxy: string;
  passProxy: string;
  userProxy: string;
  port: string;
}

const generateRandomHex = (size: number): string => {
  const randomBytes = CryptoJS.lib.WordArray.random(size);
  return randomBytes.toString(CryptoJS.enc.Hex);
};
const getRandomOS = (): string => {
  const osChoices = ['Mac', 'Windows', 'Linux'];
  return osChoices[Math.floor(Math.random() * osChoices.length)];
};
const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

const login = async (botInfo: LoginParams): Promise<LoginResponse | null> => {
  const credentials = {
    aff_id: botInfo.aff_id,
    browser: botInfo.browser,
    device: botInfo.device,
    fg: generateRandomHex(16),
    os: getRandomOS(),
    password: botInfo.password,
    sign: generateRandomHex(16),
    time: getCurrentTimestamp(),
    username: botInfo.username,
  };

  try {
    const proxyConfig: AxiosRequestConfig = {
      proxy: {
        host: botInfo.proxy,
        port: Number(botInfo.port),
        auth: {
          username: botInfo.userProxy,
          password: botInfo.passProxy,
        },
      },
    };
    const response = await axios.post<LoginResponse>(
      loginUrl,
      credentials,
      proxyConfig
    );
    await axios.get<ConnectTokenResponse>(
      'https://apirvp4.traskiprik.info/sw/collect',
      proxyConfig
    );
    return response.data;
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};

interface ConnectTokenResponse {
  connectionToken: string;
}

const getConnectToken = async (
  token?: string
): Promise<ConnectTokenResponse | null> => {
  try {
    const url = `https://maubinh.twith.club/signalr/negotiate?access_token=${token}`;
    const response = await axios.get<ConnectTokenResponse>(url);

    return response.data;
  } catch (error) {
    console.error(
      'Error fetching the token:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};

export { getConnectToken, login };

export async function setupBot(
  bot: LoginParams,
  setToken: any,
  setConnectionToken: any,
  setUser: any
) {
  try {
    const res = await login(bot);
    const token = res?.data[0].token;

    const connectionToken = await getConnectToken(token);

    setToken(token);
    setConnectionToken(connectionToken?.connectionToken);
    setUser(bot.username);
  } catch (err) {
    console.error('Error when calling setup bot:', err);
  }
}

export async function accountLogin(account: any) {
  try {
    const res = await login(account);
    return res;
  } catch (err) {
    console.error('Error when calling accountLogin:', err);
    return { error: true, message: 'An error occurred during login.' };
  }
}

export async function openAccounts(account: any) {
  await window.backend.sendMessage('open-accounts', account);
}

export function joinRoom(account: any, room?: number): void {
  if (room) {
    window.backend.sendMessage(
      'execute-script',
      account,
      `__require('GamePlayManager').default.getInstance().joinRoom(${room},0,'',true);`
    );
  }
}
