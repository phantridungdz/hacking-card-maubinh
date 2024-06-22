import { debounce } from 'lodash';
import { addMoney } from '../../lib/supabase';
import { toast } from '../toast/use-toast';
import {
  arrangeCardCommand,
  checkPositionCommand,
  inviteCommand,
} from './commandTerminal';

export const createRoom = (account: any): void => {
  window.backend.sendMessage(
    'execute-script',
    account,
    `__require('GamePlayManager').default.getInstance().requestcreateRoom(4,100,4,)`
  );
};
export const outRoom = (account: any): void => {
  window.backend.sendMessage(
    'execute-script',
    account,
    `__require('GameController').default.prototype.sendLeaveRoom();`
  );
};
export const sendStart = (account: any): void => {
  window.backend.sendMessage(
    'execute-script',
    account,
    `__require('CardGameCommonRequest').default.getInstance().sendStart(698)`
  );
};
export const joinRoom = (
  account: any,
  mainRoomID: any,
  targetSite: string
): void => {
  if (!mainRoomID) return;

  const joinRoomScript = (script: string) =>
    window.backend.sendMessage('execute-script', account, script);

  const commonScript = `__require('GamePlayManager').default.getInstance().joinRoom(${mainRoomID},0,'',true);`;
  const specialScript = `__require('GamePlayManager').default.getInstance().joinRoomWithGameID(${mainRoomID},'',4);`;
  const defaultScript = `__require('GamePlayManager').default.getInstance().joinRoomWithGameID(${mainRoomID},0,'',4);`;

  if (targetSite === 'RIK' || targetSite === 'B52') {
    joinRoomScript(commonScript);
  } else {
    const specialSites = [
      'DEBET',
      'LUCKY88',
      'ZBET',
      'MAY88',
      'SV88',
      'XO88',
      'UK88',
      'TA88',
      'MU99',
      'ONE88',
      'M11BET',
      'OXBET',
      'FIVE88',
      'SKY88',
      'LODE88',
      'RED88',
    ];
    if (specialSites.includes(account.fromSite)) {
      joinRoomScript(specialScript);
    } else {
      joinRoomScript(defaultScript);
    }
  }
};

export const checkPosition = (account: any): void => {
  window.backend.sendMessage('check-position', account, checkPositionCommand);
};
export const moneyChange = async (
  key: string | null,
  money: number,
  account: string,
  navigate: any
) => {
  if (money && key) {
    addMoney(key, money, account, navigate);
  } else {
    toast({ title: 'Error', description: 'Not have money to change.' });
  }
};
export const debouncedMoneyChange = debounce(moneyChange, 10);
export const outInRoom = async (
  account: any,
  mainRoomID: any
): Promise<void> => {
  if (mainRoomID) {
    await outRoom(account);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await joinRoom(account, mainRoomID, account.targetSite);
  }
};
export const joinLobby = (account: any): void => {
  window.backend.sendMessage(
    'execute-script',
    account,
    `__require('LobbyViewController').default.Instance.onClickIConGame(null,"vgcg_4");`
  );
};

export const invitePlayer = async (account: any): Promise<void> => {
  await window.backend.sendMessage('execute-script', account, inviteCommand);
};
export const openAccounts = async (account: any) => {
  if (
    account.fromSite === 'HIT' ||
    account.fromSite === 'RIK' ||
    account.fromSite === 'B52' ||
    (account.token && account.token != 'undefined')
  ) {
    await window.backend.sendMessage('open-accounts', account);
  } else {
    toast({
      title: account.username + ' not login',
      description: 'Vui lòng đăng nhập main trước khi mở.',
    });
  }
};
export const arrangeCards = async (account: any) => {
  await window.backend.sendMessage(
    'execute-script',
    account,
    arrangeCardCommand
  );
};
export const checkRoom = (account: any) => {
  window.backend.sendMessage(
    'check-room',
    account,
    `__require('GamePlayManager').default.getInstance().getRoomId()`
  );
};
