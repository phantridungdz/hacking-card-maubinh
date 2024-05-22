const updateFile = async (accountsUpdate: any, accountType: string) => {
  const accountsText = accountsUpdate
    .map(
      (account: {
        proxy: string;
        port: string;
        isSelected: any;
        username: string;
        password: string;
        passProxy: string;
        userProxy: string;
        isUseProxy: any;
        targetSite: string;
        session_id: string;
        token: string;
      }) =>
        `${account.username}|${account.password}|${account.isSelected}|${account.proxy}|${account.port}|${account.userProxy}|${account.passProxy}|${account.isUseProxy}|${account.targetSite}|${account.session_id}|${account.token}|`
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
