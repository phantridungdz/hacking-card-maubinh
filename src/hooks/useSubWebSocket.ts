import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from '../components/toast/use-toast';
import { binhLungCard } from '../lib/arrangeCard';
import { login } from '../service/login';
import useAccountStore from '../store/accountStore';
import useGameConfigStore from '../store/gameConfigStore';
import useGameStore from '../store/gameStore';
import useSubRoomStore from '../store/subRoomStore';

export default function useSubWebSocket(sub: any, roomID: number) {
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
    updateStatus,
    joinRoom,
    joinLobby,
    addSubValid,
    updateSubStatus,
    outRoom,
    subsValid,
  } = useSubRoomStore();

  const {
    removeSubCard,
    setReadyToFindStatus,
    addCard,
    isStartGame,
    clearGameState,
  } = useGameStore();
  const { updateAccount } = useAccountStore();
  const { loginUrl, trackingIPUrl } = useGameConfigStore();
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

  const onConnect = async (sub: any) => {
    login(sub, 'SUB', updateAccount, loginUrl, trackingIPUrl)
      .then(async (data: any) => {
        if (data.code == 200) {
          const user = data?.data[0];
          let connectURL;
          if (
            sub.proxy &&
            sub.port &&
            sub.userProxy &&
            sub.passProxy &&
            sub.isUseProxy
          ) {
            connectURL = 'ws://localhost:4500';
            await sendMessage(
              JSON.stringify({
                type: 'proxyInfo',
                proxyUrl:
                  'http://' +
                  sub.userProxy +
                  ':' +
                  sub.passProxy +
                  '@' +
                  sub.proxy +
                  ':' +
                  sub.port,
              })
            );
            setToken(user.token);
          } else {
            connectURL = 'wss://cardskgw.ryksockesg.net/websocket';
            await sendMessage(
              `[1,"Simms","","",{"agentId":"1","accessToken":"${user.token}","reconnect":false}]`
            );
          }
          await setSocketUrl(connectURL);
          await setShouldConnect(true);
          addSubValid(user.fullname);
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
        // console.log(message);
        if (message[0] === 1) {
          if (message[1] === true && message[2] === 0) {
            sendMessage(`[6,"Simms","channelPlugin",{"cmd":310}]`);
            if (!joinedLobby) {
              joinLobby(sub.username);
            }
            setJoinedLobby(true);
          }
        }
        //Destroyed room
        if (message[0] === 3) {
          if (message[1] === false && message[2] === 104) {
            // updateStatus('Not-ready');
            setReadyToFindStatus(false);
            removeSubCard();
          }
          //not enought money
          if (message[1] === false && message[2] === 150) {
            toast({
              title: `${sub.username}`,
              description: message[4],
            });
          }
        }
        if (message[0] === 4) {
          if (message[1] === true && message[2] === 1) {
            // updateSubStatus(sub.username, 'Outed Room');
            outRoom(sub.username);
            setJoinedRoom(false);
            removeSubCard();
          }
        }
        if (message[0] === 5) {
          //Detect-user-join
          if (message[1].cmd === 200) {
            if (!subsValid.includes(message[1].p.dn)) {
              console.log(`Có chó vào phòng:${message[1].p.dn}`);
              // updateSubStatus(
              //   sub.username,
              //   'Phát hiện người chơi khác vào phòng'
              // );
              // sendMessage(`[4,"Simms",${roomID}]`);
            }
          }
          //joined-room
          if (message[1].cmd === 202 && message[1].Mu == 4) {
            if (!joinedRoom) {
              joinRoom(sub.username);
              setJoinedRoom(true);
            }
            // updateSubStatus(sub.username, 'Joined Room');
          }

          //send-Ready
          if (message[1].cmd === 204 || message[1].cmd === 607) {
            // updateSubStatus(sub.username, 'Sent ready');
            sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
          }
          //end-game-> out room
          if (message[1].cmd === 205 && message[1].ps) {
            // updateSubStatus(sub.username, 'Out room');
            sendMessage(`[4,"Simms",${roomID}]`);
          }
          // //In-lobby
          // if (message[1].cmd === 300 && message[1].rs) {
          //   if (sub.status != 'In lobby') {
          //     // updateSubStatus(sub.username, 'In lobby');
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
          //       title: `${sub.username} sắp hết tiền`,
          //       description: `Tài khoản còn dưới 2000, vui lòng nạp thêm !`,
          //     });
          //   }
          //   updateAccount('SUB', sub.username, {
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
            updateSubStatus(sub.username, `${message[1].cs}`);
            addCard('subCards', message[1].cs);
            const baiLung = binhLungCard(message[1].cs) as any;
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":606,"cs":[${baiLung.cards}]}]`
            );
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":603,"cs":[${baiLung.cards}]}]`
            );
            // updateSubStatus(sub.username, `${message[1].cs}`);
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
      sendMessage(`[3,"Simms",${roomID},"",true]`);
      updateSubStatus(sub.username, 'Joining Room');
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
      updateSubStatus(sub.username, 'idle');
    } else {
      onConnect(sub);
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
