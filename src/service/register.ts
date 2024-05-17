import axios from 'axios';

const baseUrl = 'https://bordergw.api-inovated.com/user';

export const registerAccount = async (payload: any, axiosInstance: any) => {
  if (axiosInstance) {
    return axiosInstance.post(`${baseUrl}/register.aspx`, payload);
  } else {
    return axios.post(`${baseUrl}/register.aspx`, payload);
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
