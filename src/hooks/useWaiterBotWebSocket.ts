import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from '../components/toast/use-toast';
import { arrangeCard } from '../lib/arrangeCard';
import { login } from '../lib/login';
import useBotRoomStore from '../store/botRoomStore';
import useGameStore from '../store/gameStore';

export default function useWaiterWebSocket(bot: any, roomID: number) {
  const [socketUrl, setSocketUrl] = useState('');
  const [shouldConnect, setShouldConnect] = useState(false);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
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
    botsReady,
    joinRoom,
    joinLobby,
    addBotValid,
    updateBotStatus,
    outRoom,
    botsValid,
    addBotReady,
  } = useBotRoomStore();

  const {
    removeBotCard,
    setReadyToFindStatus,
    addCard,
    isStartGame,
    isFoundedRoom,
    clearGameState,
  } = useGameStore();

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
    login(bot)
      .then(async (data: any) => {
        if (data.code == 200) {
          const user = data?.data[0];
          const connectURL = 'wss://cardskgw.ryksockesg.net/websocket';
          await setSocketUrl(connectURL);
          await setShouldConnect(true);
          await sendMessage(
            `[1,"Simms","","",{"agentId":"1","accessToken":"${user.token}","reconnect":false}]`
          );
          addBotValid(user.fullname);
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
  };

  useEffect(() => {
    try {
      if (lastMessage !== null) {
        const message = JSON.parse(lastMessage.data);

        // console.log(message);
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
            // updateStatus('Not-ready');
            setReadyToFindStatus(false);
            removeBotCard();
          }
        }
        if (message[0] === 4) {
          if (message[1] === true && message[2] === 1) {
            // updateBotStatus(bot.username, 'Outed Room');
            outRoom(bot.username);
            setJoinedRoom(false);
            removeBotCard();
          }
        }
        if (message[0] === 5) {
          //Detect-user-join
          if (message[1].cmd === 200) {
            if (!botsValid.includes(message[1].p.dn)) {
              console.log(`Có chó vào phòng:${message[1].p.dn}`);
              // updateBotStatus(
              //   bot.username,
              //   'Phát hiện người chơi khác vào phòng'
              // );
              // sendMessage(`[4,"Simms",${roomID}]`);
            }
          }
          //joined-room
          if (message[1].cmd === 202 && message[1].Mu == 4) {
            if (!joinedRoom) {
              joinRoom(bot.username);
              setJoinedRoom(true);
            }
            // updateBotStatus(bot.username, 'Joined Room');
          }

          //send-Ready
          if (message[1].cmd === 204 || message[1].cmd === 607) {
            // updateBotStatus(bot.username, 'Sent ready');
            sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
            if (!botsReady.includes(bot.userName)) {
              addBotReady(bot.username);
            }
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
              `[6,"Simms","channelPlugin",{"cmd":"306","subi":true}]`
            );
            sendMessage(`["7", "Simms", "1",1]`);
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`
            );
          }
          //check money
          if (message[1].cmd === 317 && message[1].As) {
            const money = message[1].As.guarranteed_gold;
            if (money < 2000) {
              toast({
                title: `${bot.username} sắp hết tiền`,
                description: `Tài khoản còn dưới 2000, vui lòng nạp thêm !`,
              });
            }
          }
          //Received-card
          if (message[1].cs && message[1].T === 60000) {
            updateBotStatus(bot.username, `${message[1].cs}`);
            addCard('botCards', message[1].cs);
            const arrangedCard = arrangeCard(message[1].cs) as any;
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":606,"cs":[${arrangedCard.cards}]}]`
            );
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":603,"cs":[${arrangedCard.cards}]}]`
            );
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
    if (isFoundedRoom) {
      sendMessage(`[3,"Simms",${roomID},"",true]`);
      updateBotStatus(bot.username, 'Joining Room');
    }
  }, [isFoundedRoom]);

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
  };
}
