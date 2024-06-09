import axios from 'axios';

export const getCaptcha = async (sessionId: string) => {
  try {
    const response = await axios.get(
      `https://api.azhkthg1.net/id?command=getCaptcha&sessionId=${sessionId}`,
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          authorization: 'e60c614f5bbe4b8cabb7438b6132f4d3',
          'cache-control': 'no-cache',
          dnt: '1',
          origin: 'https://web.sunwin.uk',
          pragma: 'no-cache',
          priority: 'u=1, i',
          referer: 'https://web.sunwin.uk/',
          'sec-ch-ua': `"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': `"Windows"`,
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch captcha:', error);
    throw error;
  }
};
