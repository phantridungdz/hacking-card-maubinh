import axios from 'axios';

import { accessToken, loginUrl, trackingIPUrl } from '../lib/config';
import {
  generateRandomHex,
  getCurrentTimestamp,
  getRandomOS,
} from '../lib/utils';

const login = async (
  botInfo: any,
  accountType: any,
  updateAccount: any
): Promise<any> => {
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
    let proxyConfig = {};
    if (
      botInfo.proxy &&
      botInfo.passProxy &&
      botInfo.userProxy &&
      botInfo.passProxy
    ) {
      proxyConfig = {
        proxy: {
          host: botInfo.proxy,
          port: Number(botInfo.port),
          auth: {
            username: botInfo.userProxy,
            password: botInfo.passProxy,
          },
        },
      };
    }

    const response = await axios.post<any>(loginUrl, credentials, proxyConfig);
    const data = response.data.data[0];
    updateAccount(accountType, botInfo.username, {
      session_id: data.session_id,
      main_balance: data.main_balance | 0,
      token: data.token,
      fullname: data.fullname,
    });
    await axios.get<ConnectTokenResponse>(trackingIPUrl, proxyConfig);

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
    const url = accessToken + token;
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
