const updateFile = async (accountsUpdate: any, accountType: string) => {
  const accountsText = accountsUpdate
    .map(
      (account: {
        proxy: any;
        port: any;
        isSelected: any;
        username: any;
        password: any;
        passProxy: any;
        userProxy: any;
      }) =>
        `${account.username}|${account.password}|${account.isSelected}|${account.proxy}|${account.port}|${account.userProxy}|${account.passProxy}|`
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
