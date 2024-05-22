import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from '../components/toast/use-toast';
import { binhLungCard } from '../lib/arrangeCard';
import { login } from '../service/login';
import useAccountStore from '../store/accountStore';
import useBotRoomStore from '../store/botRoomStore';
import useGameConfigStore from '../store/gameConfigStore';
import useGameStore from '../store/gameStore';

export default function useBotWebSocket(bot: any, roomID: number) {
  const [socketUrl, setSocketUrl] = useState('');
  const [shouldConnect, setShouldConnect] = useState(false);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [fullName, setFullName] = useState();
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
  const { loginUrl, trackingIPUrl, wsTargetUrl, currentTargetSite } =
    useGameConfigStore();
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

  const onConnect = async (bot: any) => {
    if (!bot.token) {
      login(bot, 'BOT', updateAccount, loginUrl, trackingIPUrl)
        .then(async (data: any) => {
          if (data.code == 200) {
            const user = data?.data[0];

            let connectURL;
            if (
              bot.proxy &&
              bot.port &&
              bot.userProxy &&
              bot.passProxy &&
              bot.isUseProxy
            ) {
              connectURL = 'ws://localhost:4500';

              await sendMessage(
                JSON.stringify({
                  type: 'proxyInfo',
                  proxyUrl:
                    'http://' +
                    bot.userProxy +
                    ':' +
                    bot.passProxy +
                    '@' +
                    bot.proxy +
                    ':' +
                    bot.port,
                })
              );
              setToken(user.token);
            } else {
              connectURL = wsTargetUrl;
              await sendMessage(
                `[1,"Simms","","",{"agentId":"1","accessToken":"${user.token}","reconnect":false}]`
              );
            }
            await setSocketUrl(connectURL);
            await setShouldConnect(true);
            addBotValid(user.fullname);
            setFullName(user.fullname);
          } else {
            toast({ title: 'Error', description: data?.message });
            setSocketUrl('');
            setShouldConnect(false);
            clearGameState();
          }
        })
        .catch((err: Error) => {
          console.error('Error when calling login function:', err);
          setSocketUrl('');
          setShouldConnect(false);
          clearGameState();
        });
    } else {
      let connectURL = wsTargetUrl;
      await sendMessage(
        `[1,"Simms","","",{"agentId":"1","accessToken":"${bot.token}","reconnect":false}]`
      );
      await setSocketUrl(connectURL);
      await setShouldConnect(true);
      addBotValid(bot.fullname);
      setFullName(bot.fullname);
    }
  };

  useEffect(() => {
    try {
      if (lastMessage !== null) {
        const message = JSON.parse(lastMessage.data);
        if (message.type === 'proxyConnected' && token) {
          sendMessage(
            `[1,"Simms","","",{"agentId":"1","accessToken":"${token}","reconnect":false}]`
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
            console.log('message[1].dn', message[1].dn);
            console.log('fullName', fullName);
            if (!botsReady.includes(bot.userName)) {
              setTimeout(() => {
                addBotReady(bot.username);
              }, 100);
            }
          }
          //send-Ready
          if (
            message[1].cmd === 204 ||
            message[1].cmd === 607 ||
            message[1].cmd === 5
          ) {
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
      if (currentTargetSite === 'HIT') {
        sendMessage(`[8,"Simms",${roomID},"",4]`);
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
