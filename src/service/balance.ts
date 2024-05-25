import axios from 'axios';
import { login } from './login';

export const checkBalance = async (
  rowData: any,
  accountType: string,
  updateAccount: any,
  checkBalanceUrl: string
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

      const response = await axios.post(checkBalanceUrl, {}, axiosConfig);

      if (response.data.code === 200) {
        mainBalance = response.data.data[0].main_balance;
        updateAccount(accountType, rowData.username, {
          main_balance: mainBalance,
        });
      } else {
        updateAccount(accountType, rowData.username, {
          main_balance: mainBalance,
          session_id: null,
          token: null,
        });
        const data = (await login(rowData, accountType, updateAccount)) as any;
        const cash = Array.isArray(data?.data) ? data?.data[0].main_balance : 0;
        mainBalance = cash;
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
