import { now } from 'lodash';
import { toast } from '../components/toast/use-toast';
import useAccountStore from '../store/accountStore';
import { accountLogin } from './login';

const { accounts, removeAccount, updateAccount } = useAccountStore();

const readValidAccount = (input: string): any => {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      if (line != '') {
        const [
          username,
          password,
          IsSelected,
          proxy,
          port,
          userProxy,
          passProxy,
        ] = line.trim().split('|');
        return {
          username,
          password: password || '',
          app_id: 'rik.vip',
          os: 'Windows',
          device: 'Computer',
          browser: 'chrome',
          proxy: proxy,
          port: port,
          passProxy: passProxy,
          userProxy: userProxy,
          fg: 'fea47ac6e0fd72cd768e977d51f3dc45',
          time: now(),
          aff_id: 'hit',
          isSelected: IsSelected === 'true',
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
  addAccount: any
) => {
  const addAccountPromises = newAccounts.map(async (account) => {
    if (!accountExists(account, accounts, accountType)) {
      await addAccount(accountType, account);
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
  return {
    username: account.username,
    password: account.password,
    isSelected: account.isSelected,
    app_id: 'rik.vip',
    os: 'Windows',
    device: 'Computer',
    browser: 'chrome',
    fg: 'fea47ac6e0fd72cd768e977d51f3dc45',
    proxy: account.proxy,
    port: account.port,
    userProxy: account.userProxy,
    passProxy: account.userProxy,
    time: now(),
    aff_id: 'hit',
    main_balance: 0,
  };
};

const checkBalance = async (rowData: any, accountType: string) => {
  var mainBalance = rowData.main_balance;

  const data = (await accountLogin(rowData)) as any;
  const cash = Array.isArray(data?.data) ? data?.data[0].main_balance : 0;
  mainBalance = cash;

  updateAccount(accountType, rowData.username, {
    main_balance: data.code === 200 ? mainBalance : data.message,
  });
};

export {
  accountExists,
  addUniqueAccounts,
  checkBalance,
  generateAccount,
  readValidAccount,
};
