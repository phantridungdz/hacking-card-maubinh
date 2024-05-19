export default function useGetFgOfGame() {
  const getFg = () => {
    return new Promise((resolve) => {
      const handleGetFG = (data: any) => {
        console.log('event', data);

        resolve(data);
      };
      window.backend.on('generateFgReply', handleGetFG);

      window.backend.sendMessage(
        'generateFg',
        `
      function convertUTCDateToLocalDate(t) {
        var e = new Date(t.getTime() + 6e4 * t.getTimezoneOffset()),
          i = e.getHours();
        return e.setHours(i - -7), e;
      }

      var y = Math.floor(convertUTCDateToLocalDate(new Date()).getTime() / 1e3);
      var A = __require('PopupDangNhap').default.prototype.checkSign(y, 'phantridungdz')
      var result = {fg: A, time: y }
      result
      `
      );
    });
  };

  return { getFg };
}
