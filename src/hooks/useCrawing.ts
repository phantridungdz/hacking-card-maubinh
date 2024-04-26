import { LoginParams } from '../lib/login';
import { useSetupCraw } from './useSetupCraw';
import { useSetupWaiter } from './useSetupWaiter';

export function useCrawing(bot1: LoginParams, bot2: LoginParams) {
  const coupleId = bot1.username + bot2.username;

  const {
    user: user1,
    handleLoginClick: loginHost,
    handleConnectMauBinh: connectMbHost,
    messageHistory: messageHistoryBot1,
    setMessageHistory: setMessageHistoryBot1,
    connectionStatus: connectionStatusBot1,
    handleCreateRoom: hostCreateRoom,
    handleLeaveRoom: hostLeaveRoom,
    disconnectGame: hostDisconnect,
  } = useSetupCraw(bot1, coupleId, true);

  const {
    user: user2,
    handleLoginClick: loginGuess,
    handleConnectMauBinh: connectMbGuess,
    messageHistory: messageHistoryBot2,
    setMessageHistory: setMessageHistoryBot2,
    connectionStatus: connectionStatusBot2,
    handleLeaveRoom: guessLeaveRoom,
    disconnectGame: guessDisconnect,
  } = useSetupCraw(bot2, coupleId, false);

  return {
    coupleId,
    host: user1,
    guess: user2,
    loginHost,
    connectMbHost,
    loginGuess,
    connectMbGuess,
    msgHost: messageHistoryBot1,
    msgGuess: messageHistoryBot2,
    setMsgHost: setMessageHistoryBot1,
    setMsgGuess: setMessageHistoryBot2,
    connectionStatusHost: connectionStatusBot1,
    connectionStatusGuess: connectionStatusBot2,
    hostCreateRoom,
    hostLeaveRoom,
    guessLeaveRoom,
    hostDisconnect,
    guessDisconnect,
  };
}

export function useWaiting(bot1: LoginParams, bot2: LoginParams) {
  const coupleId = bot1.username + bot2.username;

  const {
    user: user1,
    handleLoginClick: loginHost,
    handleConnectMauBinh: connectMbHost,
    messageHistory: messageHistoryBot1,
    setMessageHistory: setMsgHistoryBot1,
    connectionStatus: connectionStatusBot1,
    handleLeaveRoom: hostLeaveRoom,
    disconnectGame: hostDisconnect,
  } = useSetupWaiter(bot1);

  const {
    user: user2,
    handleLoginClick: loginGuess,
    handleConnectMauBinh: connectMbGuess,
    messageHistory: messageHistoryBot2,
    setMessageHistory: setMsgHistoryBot2,
    connectionStatus: connectionStatusBot2,
    handleLeaveRoom: guessLeaveRoom,
    disconnectGame: guessDisconnect,
  } = useSetupWaiter(bot2);

  return {
    coupleId,
    host: user1,
    guess: user2,
    loginHost,
    connectMbHost,
    loginGuess,
    connectMbGuess,
    msgHost: messageHistoryBot1,
    msgGuess: messageHistoryBot2,
    setMsgHost: setMsgHistoryBot1,
    setMsgGuess: setMsgHistoryBot2,
    connectionStatusHost: connectionStatusBot1,
    connectionStatusGuess: connectionStatusBot2,
    hostLeaveRoom,
    guessLeaveRoom,
    hostDisconnect,
    guessDisconnect,
  };
}