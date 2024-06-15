import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useToast } from '../components/toast/use-toast';
import { binhLungCard } from '../lib/arrangeCard';
import { fetchToken, login } from '../service/login';
import useAccountStore from '../store/accountStore';
import useBotRoomStore from '../store/botRoomStore';
import useGameConfigStore from '../store/gameConfigStore';
import useGameStore from '../store/gameStore';
import useSubRoomStore from '../store/subRoomStore';

export default function useHostWebSocket(bot: any, roomID: number) {
  const { toast } = useToast();
  const [socketUrl, setSocketUrl] = useState('');
  const [shouldConnect, setShouldConnect] = useState(false);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(false);
  const [isFirstFounded, setIsFirstFounded] = useState(false);
  const [fullName, setFullName] = useState('');
  const [botMoneyChange, setBotMoneyChange] = useState('');
  const [token, setToken] = useState('');
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
    },
    shouldConnect
  );
  const {
    joinRoom,
    joinLobby,
    addBotValid,
    updateStatus,
    updateBotStatus,
    outRoom,
    botsValid,
    updateRoomID,
    setReadyToJoinStatus,
    botsReady,
    clearBotReady,
    setBotStart,
  } = useBotRoomStore();
  const {
    isReadyToCreate,
    removeBotCard,
    setReadyToFindStatus,
    addCard,
    isStartGame,
    isReadyToFind,
    isFoundedRoom,
    setCrawlCard,
    clearGameState,
    botCards,
  } = useGameStore();
  const { updateAccount } = useAccountStore();
  const { isSubStart } = useSubRoomStore();
  const { currentTargetSite, wsTargetUrl } = useGameConfigStore();
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Đang kết nối',
    [ReadyState.OPEN]: 'Sẵn sàng',
    [ReadyState.CLOSING]: 'Ngắt kết nối',
    [ReadyState.CLOSED]: 'Đã đóng',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      toast({
        title: 'Connection Error',
        description: 'Kết nối bị gián đoạn, vui lòng thử lại.',
      });
    }
  }, [readyState]);

  function arraysEqual(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    let sortedArr1 = arr1.slice().sort();
    let sortedArr2 = arr2.slice().sort();
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }
    return true;
  }

  function replaceCards(receivedCard: any[], arrays: any) {
    return receivedCard.map((cardSet) => {
      for (let array of arrays) {
        if (arraysEqual(cardSet.cs, array)) {
          return { ...cardSet, cs: array };
        }
      }
      return cardSet;
    });
  }

  const startSocketOn = async (token: string, fullName: string) => {
    try {
      if (bot.isUseProxy) {
        await sendMessage(
          JSON.stringify({
            type: 'proxyInfo',
            proxyUrl: `http://${bot.userProxy}:${bot.passProxy}@${bot.proxy}:${bot.port}`,
            wsTargetUrl,
          })
        );
        await setSocketUrl('ws://localhost:4500');
      } else {
        await sendMessage(
          `[1,"Simms","","",{"agentId":"1","accessToken":"${token}","reconnect":true}]`
        );
        await setSocketUrl(wsTargetUrl);
      }
      await setShouldConnect(true);
      addBotValid(fullName);
      setFullName(fullName);
    } catch (error) {
      console.error('Error in startSocketOn:', error);
      toast({
        title: 'Connection Error',
        description: 'Không thể thiết lập kết nối WebSocket.',
      });
    }
  };

  const onConnect = async (bot: any) => {
    if (!bot.token) {
      const res = await login(bot, 'BOT', updateAccount);
      if ((res.code = 200)) {
        const user = res?.data[0];
        setToken(user.token);
        startSocketOn(user.token, user.fullname);
        setToken(user.token);
      } else {
        toast({ title: 'Error', description: res.message });
        setSocketUrl('');
        setShouldConnect(false);
        clearGameState();
      }
    } else {
      if (!bot.token) {
        const resToken = await fetchToken(bot);
        if (resToken?.data) {
          startSocketOn(bot.token, resToken.data.displayName);
        } else {
          toast({
            title: 'Error',
            description: 'Token hết hạn, mời đăng nhập lại trước khi bắt đầu',
          });
          updateAccount('BOT', bot.username, {
            session_id: null,
            token: null,
          });
        }
      } else {
        setToken(bot.token);
        startSocketOn(bot.token, bot.fullname);
      }
    }
  };

  useEffect(() => {
    try {
      if (lastMessage !== null) {
        const message = JSON.parse(lastMessage.data);
        if (message.type === 'proxyConnected' && token) {
          sendMessage(
            `[1,"Simms","","",{"agentId":"1","accessToken":"${token}","reconnect":true}]`
          );
        }
        if (message.error) {
          toast({
            title: bot.username + ' lỗi proxy',
            description: message.error,
          });
        }
        if (message[0] === 1) {
          if (message[1] === true && message[2] === 0) {
            sendMessage(`[6,"Simms","channelPlugin",{"cmd":310}]`);
            if (!joinedLobby) {
              joinLobby(bot.username);
            }
            setJoinedLobby(true);
          }
        }
        //Destroyed room
        if (message[0] === 3) {
          if (message[1] === false && message[2] === 104) {
            updateStatus('Not-ready');
            setReadyToFindStatus(false);
            removeBotCard();
          }
          //not enought money
          if (message[1] === false && message[2] === 150) {
            toast({
              title: `${bot.username}`,
              description: message[4],
            });
          }
        }
        if (message[0] === 4) {
          if (message[1] === true && message[2] === 1) {
            updateBotStatus(bot.username, 'Outed Room');
            outRoom(bot.username);
            removeBotCard();
            setCreatedRoom(false);
          }
        }
        if (message[0] === 5) {
          //Detect-user-join
          if (message[1].cmd === 200) {
            if (!botsValid.includes(message[1].p.dn)) {
              toast({
                title: `Người chơi khác vào phòng:${message[1].p.dn}`,
                description: 'Quan sát để tránh không tìm được bài.',
              });

              // updateBotStatus(
              //   bot.username,
              //   'Phát hiện người chơi khác vào phòng'
              // );
              // sendMessage(`[4,"Simms",${roomID}]`);
            }
          }

          //send-Start
          if (message[1].cmd === 204 || message[1].cmd === 607) {
            if (isFoundedRoom && message[1].cmd === 607) {
              if (botsReady.length === 3) {
                updateBotStatus(bot.username, 'Sent start');
                sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
                sendMessage(`[5,"Simms",${roomID},{"cmd":698}]`);
                clearBotReady();
              }
            }
            if (!isFoundedRoom) {
              updateBotStatus(bot.username, 'Sent start');
              sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
              sendMessage(`[5,"Simms",${roomID},{"cmd":698}]`);
              clearBotReady();
            }
          }
          //end-game-> out room
          if (message[1].cmd === 205 && message[1].ps) {
            if (!isFoundedRoom) {
              updateBotStatus(bot.username, 'Out room');
              sendMessage(`[4,"Simms",${roomID}]`);
              setReadyToJoinStatus(false);
            } else {
              clearBotReady();
            }
          }
          // //In-lobby
          // if (message[1].cmd === 300 && message[1].rs) {
          //   if (bot.status != 'In lobby') {
          //     updateBotStatus(bot.username, 'In lobby');
          //   }
          // }
          //Created-room
          if (message[1].cmd === 308 && message[1].ri) {
            updateRoomID(message[1].ri.rid.toString());
            joinRoom(bot.username);
            updateBotStatus(bot.username, 'Joined Room');
            updateStatus('Created Room');
            if (!isFoundedRoom) {
              setBotStart(true);
              setBotStart(false);
            }
            setReadyToJoinStatus(true);
            if (currentTargetSite === 'HIT') {
              sendMessage(`[3,"Simms",${message[1].ri.rid},"123123"]`);
            } else {
              sendMessage(`[3,"Simms",${message[1].ri.rid},""]`);
            }
          }
          //Ping-join-room
          if (message[1].cmd === 310 && message[1].As) {
            if (message[1].As.gold) {
              updateAccount('BOT', bot.username, {
                main_balance: message[1].As.gold,
              });
            }
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":"306","subi":false}]`
            );
            sendMessage(`["7", "Simms", "1",1]`);
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`
            );
          }
          //check money
          // if (message[1].cmd === 200 && message[1].p) {
          //   const money = message[1].p.As.gold;
          //   if (parseInt(money) < 2000) {
          //     toast({
          //       title: `${bot.username} sắp hết tiền`,
          //       description: `Tài khoản còn dưới 2000, vui lòng nạp thêm !`,
          //     });
          //   }
          //   updateAccount('BOT', bot.username, {
          //     main_balance: money,
          //   });
          // }
          if (
            message[1].cmd === 602 &&
            (message[1].hsl == false || message[1].hsl == true)
          ) {
            const user = message[1].ps.find(
              (item: { dn: string }) => item.dn === fullName
            );
            if (user) {
              setBotMoneyChange(user.mX);
            }
          }
          //end-game
          if (message[1].cmd === 602 && message[1].ps) {
            if (isFoundedRoom && message[1].ps.length === 4) {
              const receivedCard = message[1].ps;
              const updatedReceivedCard = replaceCards(receivedCard, botCards);
              setCrawlCard(updatedReceivedCard);
              removeBotCard();
              setIsFirstFounded(true);
            }
            if (message[1].ps.length < 4 && isFoundedRoom && isFirstFounded) {
              toast({
                title: 'Lỗi tìm bài',
                description: 'Bài không đủ, vui lòng kiểm tra',
              });
              setCrawlCard([]);
            }
          }
          //Received-card
          if (message[1].cs && message[1].T === 60000) {
            updateBotStatus(bot.username, `${message[1].cs}`);
            addCard('botCards', message[1].cs);
            if (!isFoundedRoom) {
              const baiLung = binhLungCard(message[1].cs) as any;
              sendMessage(
                `[5,"Simms",${roomID},{"cmd":606,"cs":[${baiLung.cards}]}]`
              );
              sendMessage(
                `[5,"Simms",${roomID},{"cmd":603,"cs":[${baiLung.cards}]}]`
              );
            } else {
              const arrangedCard = binhLungCard(message[1].cs) as any;
              sendMessage(
                `[5,"Simms",${roomID},{"cmd":606,"cs":[${arrangedCard.cards}]}]`
              );
              sendMessage(
                `[5,"Simms",${roomID},{"cmd":603,"cs":[${arrangedCard.cards}]}]`
              );
            }
            updateBotStatus(bot.username, `${message[1].cs}`);
          }
        }
        //ping-pong
        if (message[0] === 6) {
          if (message[1] === 1) {
            setTimeout(() => {
              if (isStartGame) {
                sendMessage(`["7", "Simms", "1",${message[2] + 1}]`);
              }
              // if (bot.status != 'In lobby') {
              //   setTimeout(() => {
              //     sendMessage(
              //       `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`
              //     );
              //   }, 2000);
              // }
            }, 5000);
          }
        }
      }
    } catch (error) {
      console.error('Error processing messages:', error);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (
      (isReadyToFind && isReadyToCreate && !createdRoom) ||
      (isSubStart && !createdRoom)
    ) {
      if (currentTargetSite === 'HIT') {
        sendMessage(
          '[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":"123123"}]'
        );
      } else {
        sendMessage(
          '[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]'
        );
      }

      updateBotStatus(bot.username, 'Create Room');
      updateStatus('Create Room');
      setCreatedRoom(true);
    }
  }, [lastMessage, isReadyToCreate, isReadyToFind, isSubStart]);
  useEffect(() => {
    if (isFoundedRoom) {
      if (botsReady.length === 3) {
        updateBotStatus(bot.username, 'Sent start');
        sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
        sendMessage(`[5,"Simms",${roomID},{"cmd":698}]`);
      }
    }
  }, [botsReady, isFoundedRoom]);

  const onDisconnect = useCallback(() => {
    setSocketUrl('');
    setShouldConnect(false);
  }, []);

  useEffect(() => {
    if (!isStartGame) {
      setShouldConnect(false);
      onDisconnect();
      updateBotStatus(bot.username, 'idle');
    } else {
      onConnect(bot);
    }
  }, [isStartGame]);

  return {
    sendMessage,
    lastMessage,
    readyState,
    connectionStatus,
    onConnect,
    onDisconnect,
    botMoneyChange,
  };
}
