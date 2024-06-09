const updateFile = async (accountsUpdate: any, accountType: string) => {
  const accountsText = accountsUpdate
    .map(
      (account: {
        proxy: string;
        port: string;
        isSelected: any;
        username: string;
        password: string;
        fullname: string;
        passProxy: string;
        userProxy: string;
        isUseProxy: any;
        targetSite: string;
        session_id: string;
        token: string;
        fromSite: string;
        main_balance: any;
        info: any;
        signature: string;
        refreshToken: string;
      }) => {
        console.log(
          'JSON.stringify(account.info)',
          JSON.stringify(account.info)
        );

        return `${account.username}|${account.password}|${account.fullname}|${
          account.main_balance ? account.main_balance.toString() : 'undefined'
        }|${account.isSelected}|${account.proxy}|${account.port}|${
          account.userProxy
        }|${account.passProxy}|${account.isUseProxy}|${account.targetSite}|${
          account.session_id
        }|${account.token}|${account.fromSite}|${JSON.stringify(
          account.info
        )}|${account.signature}|${account.refreshToken}|`;
      }
    )
    .join('\n');
  window.backend.sendMessage(
    'update-file',
    accountsText,
    [`account/${accountType.toLowerCase()}Account.txt`],
    accountType
  );
};

const readFile = (accountType: string) => {
  window.backend.sendMessage(
    'read-file',
    [`account/${accountType.toLowerCase()}Account.txt`],
    accountType
  );
};

export { readFile, updateFile };
