import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useGameConfigStore = create<any>(
  devtools(
    (set) => ({
      currentTargetSite: 'RIK',
      checkBalanceUrl:
        'https://bordergw.api-inovated.com/gwms/v1/safe/load.aspx',
      loginUrl: 'https://bordergw.api-inovated.com/user/login.aspx',
      trackingIPUrl: 'https://apirvp4.traskiprik.info/sw/collect',
      registerUrl: 'https://bordergw.api-inovated.com/user',
      depositUrl: 'https://baymentes.gwrykgems.net/payment/card',
      wsTargetUrl: 'wss://cardskgw.ryksockesg.net/websocket',
      setTargetSite: (site: any) => {
        let newCheckBalanceUrl;
        let newLoginUrl;
        let newTrackingIPUrl;
        let newRegisterUrl;
        let newDepositUrl;
        let newWsTargetUrl;
        switch (site) {
          case 'RIK':
            newCheckBalanceUrl =
              'https://bordergw.api-inovated.com/gwms/v1/safe/load.aspx';
            newLoginUrl = 'https://bordergw.api-inovated.com/user/login.aspx';
            newTrackingIPUrl = 'https://apirvp4.traskiprik.info/sw/collect';
            newRegisterUrl = 'https://bordergw.api-inovated.com/user';
            newDepositUrl = 'https://baymentes.gwrykgems.net/payment/card';
            newWsTargetUrl = 'wss://cardskgw.ryksockesg.net/websocket';
            break;
          case 'HIT':
            newCheckBalanceUrl =
              'https://bodergatez.dsrcgoms.net/gwms/v1/safe/load.aspx';
            newLoginUrl = 'https://bodergatez.dsrcgoms.net/user/login.aspx';
            newTrackingIPUrl = 'https://bodergatez.dsrcgoms.net/sw/collect';
            newRegisterUrl = 'https://bodergatez.dsrcgoms.net/user';
            newDepositUrl = 'https://pmbodergw.dsrcgoms.net/payment/card/hit';
            newWsTargetUrl = 'wss://carkgwaiz.hytsocesk.com/websocket';
            break;
          default:
            newCheckBalanceUrl =
              'https://default.api-inovated.com/gwms/v1/safe/load.aspx';
            newLoginUrl = 'https://bordergw.api-inovated.com/user/login.aspx';
            newTrackingIPUrl = 'https://apirvp4.traskiprik.info/sw/collect';
            newRegisterUrl = 'https://bordergw.api-inovated.com/user';
            newDepositUrl = 'https://baymentes.gwrykgems.net/payment/card';
            newWsTargetUrl = 'wss://cardskgw.ryksockesg.net/websocket';
        }
        set({
          currentTargetSite: site,
          checkBalanceUrl: newCheckBalanceUrl,
          loginUrl: newLoginUrl,
          trackingIPUrl: newTrackingIPUrl,
          registerUrl: newRegisterUrl,
          depositUrl: newDepositUrl,
          wsTargetUrl: newWsTargetUrl,
        });
      },
    }),
    {
      name: 'game-config-store',
    }
  )
);

export default useGameConfigStore;
