import { now } from 'lodash';
import { toast } from '../components/toast/use-toast';
import {
  generateRandomFg,
  generateRandomHex,
  getRandomBrowser,
  getRandomOS,
} from './utils';

const readValidAccount = (input: string): any => {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      if (line != '') {
        const [
          username,
          password,
          fullname,
          main_balance,
          IsSelected,
          proxy,
          port,
          userProxy,
          passProxy,
          isUseProxy,
          targetSite,
          session_id,
          token,
          fromSite,
        ] = line.trim().split('|');
        return {
          username,
          password,
          fullname,
          app_id: targetSite === 'RIK' ? 'rik.vip' : 'bc114103',
          os: getRandomOS(),
          device: 'Computer',
          browser: getRandomBrowser(),
          proxy: proxy,
          port: port,
          passProxy: passProxy,
          userProxy: userProxy,
          fg: generateRandomFg(),
          time: now(),
          aff_id: 'hit',
          targetSite: targetSite,
          isUseProxy: isUseProxy === 'true',
          isSelected: IsSelected === 'true',
          session_id,
          token,
          fromSite,
          main_balance: parseInt(main_balance),
        };
      } else {
        return;
      }
    });
};

const accountExists = (
  newAccount: any,
  currentAccounts: any,
  accountType: any
) => {
  return currentAccounts[accountType].some(
    (account: { username: any }) => account.username === newAccount.username
  );
};

const addUniqueAccounts = async (
  newAccounts: any[],
  accounts: any,
  accountType: string,
  addAccount: any,
  currentTargetSite: string
) => {
  const addAccountPromises = newAccounts.map(async (account) => {
    if (!accountExists(account, accounts, accountType)) {
      await addAccount(accountType, account, currentTargetSite);
      return { account, added: true };
    } else {
      toast({
        title: 'Warning',
        description: `Duplicate found: ${account.username} not added`,
      });
      return { account, added: false };
    }
  });

  const results = await Promise.all(addAccountPromises);

  const addedAccounts = results
    .filter((result) => result.added)
    .map((result) => result.account);

  toast({
    title: 'Task Done',
    description: `${addedAccounts.length} account(s) added successfully.`,
  });
};

const generateAccount = (account: any) => {
  const sessionId = account.session_id;
  const token = account.token;
  const isSelected = account.isSelected || false;
  const isUseProxy = account.isUseProxy || false;
  const targetSite = account.targetSite || false;
  const fromSite = account.fromSite || false;

  return {
    username: account.username,
    password: account.password,
    isSelected: isSelected,
    session_id: sessionId,
    app_id: targetSite === 'RIK' ? 'rik.vip' : 'bc114103',
    os: getRandomOS(),
    device: 'Computer',
    browser: getRandomBrowser(),
    fg: generateRandomHex(16),
    proxy: account.proxy,
    port: account.port,
    userProxy: account.userProxy,
    passProxy: account.passProxy,
    token: token,
    time: now(),
    aff_id: 'hit',
    main_balance: account.main_balance,
    isUseProxy: isUseProxy,
    targetSite: targetSite,
    fullname: account.fullname,
    fromSite: fromSite,
  };
};

export { accountExists, addUniqueAccounts, generateAccount, readValidAccount };
