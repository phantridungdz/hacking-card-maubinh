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
export const joinRoom = (account: any, mainRoomID: any): void => {
  if (mainRoomID) {
    window.backend.sendMessage(
      'execute-script',
      account,
      `__require('GamePlayManager').default.getInstance().joinRoom(${mainRoomID},0,'',true);`
    );
  }
};
export const checkPosition = (account: any): void => {
  window.backend.sendMessage('check-position', account, checkPositionCommand);
};
export const moneyChange = async (key: string | null, money: number) => {
  if (money && key) {
    addMoney(key, money);
  } else {
    toast({ title: 'Error', description: 'Not have money to change.' });
  }
};
export const outInRoom = async (
  account: any,
  mainRoomID: any
): Promise<void> => {
  if (mainRoomID) {
    await outRoom(account);
    await new Promise((resolve) => setTimeout(resolve, 500));
    window.backend.sendMessage(
      'execute-script',
      account,
      `__require('GamePlayManager').default.getInstance().joinRoom(${mainRoomID},0,'',true);`
    );
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
  await window.backend.sendMessage('open-accounts', account);
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
