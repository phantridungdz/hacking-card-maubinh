import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from '../components/toast/use-toast';
import { binhLungCard } from '../lib/arrangeCard';
import { fetchToken, login } from '../service/login';
import useAccountStore from '../store/accountStore';
import useBotRoomStore from '../store/botRoomStore';
import useGameConfigStore from '../store/gameConfigStore';
import useGameStore from '../store/gameStore';

export default function useBotWebSocket(bot: any, roomID: number) {
  const [socketUrl, setSocketUrl] = useState('');
  const [shouldConnect, setShouldConnect] = useState(false);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
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
    isReadyToJoin,
    joinRoom,
    joinLobby,
    addBotValid,
    updateBotStatus,
    outRoom,
    addBotReady,
    botsReady,
  } = useBotRoomStore();

  const {
    removeBotCard,
    setReadyToFindStatus,
    addCard,
    isStartGame,
    isFoundedRoom,
    clearGameState,
  } = useGameStore();
  const { updateAccount } = useAccountStore();
  const { wsTargetUrl, currentTargetSite } = useGameConfigStore();
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
            setReadyToFindStatus(false);
            removeBotCard();
          }
          //Not enought money
          if (message[1] === false && message[2] === 150) {
            toast({
              title: `${bot.username}`,
              description: message[4],
            });
          }
        }
        //Outed Room
        if (message[0] === 4) {
          if (message[1] === true && message[2] === 1) {
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`
            );
            outRoom(bot.username);
            setJoinedRoom(false);
            removeBotCard();
            if (isFoundedRoom) {
              sendMessage(`[3,"Simms",${roomID},"",true]`);
              updateBotStatus(bot.username, 'Joining Room');
            }
          }
        }
        if (message[0] === 5) {
          //joined-room
          if (message[1].cmd === 202 && message[1].Mu == 4) {
            if (!joinedRoom) {
              joinRoom(bot.username);
              setJoinedRoom(true);
            }
            // updateBotStatus(bot.username, 'Joined Room');
          }
          if (message[1].cmd === 5 && message[1].dn === fullName) {
            if (!botsReady.includes(bot.userName)) {
              setTimeout(() => {
                addBotReady(bot.username);
              }, 100);
            }
          }
          //send-Ready
          if (message[1].cmd === 204 || message[1].cmd === 203) {
            // updateBotStatus(bot.username, 'Sent ready');
            sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
            // if (!botsReady.includes(bot.userName)) {
            // addBotReady(bot.username);
            // }
          }
          //end-game-> out room
          if (message[1].cmd === 205 && message[1].ps) {
            // updateBotStatus(bot.username, 'Out room');
            if (!isFoundedRoom) {
              sendMessage(`[4,"Simms",${roomID}]`);
            }
          }
          // //In-lobby
          // if (message[1].cmd === 300 && message[1].rs) {
          //   if (bot.status != 'In lobby') {
          //     // updateBotStatus(bot.username, 'In lobby');
          //   }
          // }
          //Ping-join-lobby
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
            // updateBotStatus(bot.username, `${message[1].cs}`);
          }
          //ping-pong
        }
        if (message[0] === 6) {
          if (message[1] === 1) {
            setTimeout(() => {
              if (isStartGame) {
                sendMessage(`["7", "Simms", "1",${message[2] + 1}]`);
              }
              // setTimeout(() => {
              //   sendMessage(
              //     `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`
              //   );
              // }, 2000);
            }, 5000);
          }
        }
      }
    } catch (error) {
      console.error('Error processing messages:', error);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isReadyToJoin) {
      if (currentTargetSite !== 'RIK') {
        sendMessage(`[8,"Simms",${roomID},"123123",4]`);
      } else {
        sendMessage(`[3,"Simms",${roomID},"",true]`);
      }
      updateBotStatus(bot.username, 'Joining Room');
    }
  }, [isReadyToJoin]);

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
