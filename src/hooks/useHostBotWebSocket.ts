import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { login } from '../lib/login';
import useBotRoomStore from '../store/botRoomStore';
import useGameStore from '../store/gameStore';

export default function useHostWebSocket(bot: any, roomID: number) {
  const [socketUrl, setSocketUrl] = useState('');
  const [shouldConnect, setShouldConnect] = useState(false);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(false);
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
  } = useGameStore();
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Đang kết nối',
    [ReadyState.OPEN]: 'Sẵn sàng',
    [ReadyState.CLOSING]: 'Ngắt kết nối',
    [ReadyState.CLOSED]: 'Đã đóng',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const onConnect = async (bot: any) => {
    login(bot)
      .then(async (data: any) => {
        const user = data?.data[0];
        if (user) {
          const connectURL = 'wss://cardskgw.ryksockesg.net/websocket';
          await setSocketUrl(connectURL);
          await setShouldConnect(true);
          await sendMessage(
            `[1,"Simms","","",{"agentId":"1","accessToken":"${user.token}","reconnect":false}]`
          );
          addBotValid(user.fullname);
        } else {
          setSocketUrl('');
          setShouldConnect(false);
        }
      })
      .catch((err: Error) => {
        console.error('Error when calling login function:', err);
        setSocketUrl('');
        setShouldConnect(false);
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
            updateStatus('Not-ready');
            setReadyToFindStatus(false);
            removeBotCard();
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
              console.log(`Có chó vào phòng:${message[1].p.dn}`);
              // updateBotStatus(
              //   bot.username,
              //   'Phát hiện người chơi khác vào phòng'
              // );
              // sendMessage(`[4,"Simms",${roomID}]`);
            }
          }

          //send-Start
          if (message[1].cmd === 204 || message[1].cmd === 607) {
            if (isFoundedRoom) {
              if (botsReady.length == 3) {
                updateBotStatus(bot.username, 'Sent start');
                sendMessage(`[5,"Simms",${roomID},{"cmd":698}]`);
                sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
                clearBotReady();
              }
            } else {
              updateBotStatus(bot.username, 'Sent start');
              sendMessage(`[5,"Simms",${roomID},{"cmd":698}]`);
              sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
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
              console.log('isFoundedRoom', isFoundedRoom);
              clearBotReady();
            }
          }
          // //In-lobby
          // if (message[1].cmd === 300 && message[1].rs) {
          //   if (bot.status != 'In lobby') {
          //     console.log(bot.username, bot.status);
          //     updateBotStatus(bot.username, 'In lobby');
          //   }
          // }
          //Created-room
          if (message[1].cmd === 308 && message[1].ri) {
            updateRoomID(message[1].ri.rid);
            joinRoom(bot.username);
            updateBotStatus(bot.username, 'Joined Room');
            updateStatus('Created Room');
            setReadyToJoinStatus(true);
            sendMessage(`[3,"Simms",${message[1].ri.rid},""]`);
          }
          //Ping-join-room
          if (message[1].cmd === 310 && message[1].As) {
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":"306","subi":true}]`
            );
            sendMessage(`["7", "Simms", "1",1]`);
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`
            );
          }
          //end-game
          if (message[1].cmd === 602 && message[1].ps) {
            if (isFoundedRoom && message[1].ps.length === 4) {
              setCrawlCard(message[1].ps);
            }
          }
          //Received-card
          if (message[1].cs && message[1].T === 60000) {
            updateBotStatus(bot.username, `${message[1].cs}`);
            addCard('botCards', message[1].cs);
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":606,"cs":[${message[1].cs}]}]`
            );
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":603,"cs":[${message[1].cs}]}]`
            );
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
    if (isReadyToFind && isReadyToCreate && !createdRoom) {
      sendMessage(
        '[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]'
      );
      updateBotStatus(bot.username, 'Create Room');
      updateStatus('Create Room');
      setCreatedRoom(true);
    }
  }, [lastMessage, isReadyToCreate, isReadyToFind]);
  useEffect(() => {
    if (isFoundedRoom) {
      if (botsReady.length == 3) {
        updateBotStatus(bot.username, 'Sent start');
        sendMessage(`[5,"Simms",${roomID},{"cmd":698}]`);
        sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
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
  };
}