import axios from 'axios';

export const registerAccount = async (
  payload: any,
  axiosInstance: any,
  registerUrl: string
) => {
  if (axiosInstance) {
    return axiosInstance.post(`${registerUrl}/register.aspx`, payload);
  } else {
    return axios.post(`${registerUrl}/register.aspx`, payload);
  }
};

export const updateAccountDisplayName = async (
  sessionId: any,
  payload: any,
  registerUrl: string
) => {
  return axios.post(`${registerUrl}/update.aspx`, payload, {
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
