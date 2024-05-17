import axios from 'axios';
import { login } from './login';

const baseUrl = 'https://bordergw.api-inovated.com/user';

// export const checkBalance = async (payload: any) => {
//   if (axiosInstance) {
//     return axiosInstance.post(`${baseUrl}/register.aspx`, payload);
//   } else {
//     return axios.post(`${baseUrl}/register.aspx`, payload);
//   }
// };

export const checkBalance = async (
  rowData: any,
  accountType: string,
  updateAccount: any
) => {
  var mainBalance = rowData.main_balance;
  var xToken = rowData.session_id;
  let proxyConfig = {};
  if (rowData.proxy && rowData.passProxy && rowData.userProxy && rowData.port) {
    proxyConfig = {
      proxy: {
        host: rowData.proxy,
        port: Number(rowData.port),
        auth: {
          username: rowData.userProxy,
          password: rowData.passProxy,
        },
      },
    };
  }

  if (xToken) {
    try {
      const axiosConfig = {
        headers: {
          'X-Token': xToken,
        },
        ...proxyConfig,
      };

      const response = await axios.post(
        'https://bordergw.api-inovated.com/gwms/v1/safe/load.aspx',
        {},
        axiosConfig
      );
      mainBalance = response.data.data[0].main_balance;
      if (response.data.code === 401) {
        updateAccount(accountType, rowData.username, {
          main_balance: mainBalance,
          session_id: null,
        });
      } else {
        updateAccount(accountType, rowData.username, {
          main_balance: mainBalance,
        });
      }
    } catch (error) {
      console.error('Error checking balance:', error);
    }
  } else {
    const data = (await login(rowData, accountType, updateAccount)) as any;
    const cash = Array.isArray(data?.data) ? data?.data[0].main_balance : 0;
    mainBalance = cash;
  }
};

export const updateAccountDisplayName = async (
  sessionId: any,
  payload: any
) => {
  return axios.post(`${baseUrl}/update.aspx`, payload, {
    headers: {
      'X-Token': sessionId,
    },
  });
};

export const createAxiosInstanceWithProxy = (proxyConfig: any) => {
  if (!proxyConfig) {
    return;
  }
  return axios.create({
    proxy: {
      host: proxyConfig.host,
      port: proxyConfig.port,
      auth: {
        username: proxyConfig.username,
        password: proxyConfig.password,
      },
    },
  });
};
