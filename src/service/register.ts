import axios from 'axios';

const baseUrl = 'https://bordergw.api-inovated.com/user';

export const registerAccount = async (payload: any) => {
  return axios.post(`${baseUrl}/register.aspx`, payload);
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
