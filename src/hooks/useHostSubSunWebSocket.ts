import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from '../components/toast/use-toast';
import { arrangeCard, binhLungCard } from '../lib/arrangeCard';
import { fetchToken, login } from '../service/login';
import useAccountStore from '../store/accountStore';
import useBotRoomStore from '../store/botRoomStore';
import useGameConfigStore from '../store/gameConfigStore';
import useGameStore from '../store/gameStore';
import useSubRoomStore from '../store/subRoomStore';

export default function useHostSubSunWebSocket(sub: any, roomID: number) {
  const [socketUrl, setSocketUrl] = useState('');
  const [shouldConnect, setShouldConnect] = useState(false);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(false);
  const [haveAnotherPlayer, setHaveAnotherPlayer] = useState(false);
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
    addSubValid,
    updateStatus,
    updateSubStatus,
    outRoom,
    subsValid,
    updateRoomID,
    setReadyToJoinStatus,
    setSubStart,
  } = useSubRoomStore();
  const {
    isReadyToCreate,
    removeSubCard,
    setReadyToFindStatus,
    addCard,
    isStartGame,
    isReadyToFind,
    isFoundedRoom,
    roomType,
    clearGameState,
  } = useGameStore();
  const { isBotStart } = useBotRoomStore();
  const { updateAccount } = useAccountStore();
  const { wsTargetUrl } = useGameConfigStore();
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
      if (sub.isUseProxy) {
        await sendMessage(
          JSON.stringify({
            type: 'proxyInfo',
            proxyUrl: `http://${sub.userProxy}:${sub.passProxy}@${sub.proxy}:${sub.port}`,
            wsTargetUrl,
          })
        );
        await setSocketUrl('ws://localhost:4500');
      } else {
        await sendMessage(
          JSON.stringify([
            1,
            'Simms',
            sub.info.username,
            sub.password,
            {
              info: sub.info,
              signature: sub.signature,
              pid: 4,
              subi: true,
            },
          ])
        );
        await setSocketUrl('wss://websocket.azhkthg1.net/websocket2');
      }
      await setShouldConnect(true);
    } catch (error) {
      console.error('Error in startSocketOn:', error);
      toast({
        title: 'Connection Error',
        description: 'Không thể thiết lập kết nối WebSocket.',
      });
    }
  };

  const onConnect = async (sub: any) => {
    if (!sub.token) {
      const res = await login(sub, 'SUB', updateAccount);
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
      if (!sub.token) {
        const resToken = await fetchToken(sub);
        if (resToken?.data) {
          startSocketOn(sub.token, resToken.data.displayName);
        } else {
          toast({
            title: 'Error',
            description: 'Token hết hạn, mời đăng nhập lại trước khi bắt đầu',
          });
          updateAccount('SUB', sub.username, {
            session_id: null,
            token: null,
          });
        }
      } else {
        setToken(sub.token);
        startSocketOn(sub.token, sub.fullname);
      }
    }
  };

  useEffect(() => {
    try {
      if (lastMessage !== null) {
        const message = JSON.parse(lastMessage.data);
        if (message.type === 'proxyConnected' && token) {
          sendMessage(
            JSON.stringify([
              1,
              'Simms',
              sub.info.username,
              sub.password,
              {
                info: sub.info,
                signature: sub.signature,
                pid: 4,
                subi: true,
              },
            ])
          );
        }
        if (message[0] === 1) {
          if (message[1] === true && message[2] === 0) {
            sendMessage(`[7,"Simms",1,0]`);
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
            updateStatus('Not-ready');
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
            updateSubStatus(sub.username, 'Outed Room');
            outRoom(sub.username);
            removeSubCard();
            setCreatedRoom(false);
          }
        }
        if (message[0] === 5) {
          if (message[1].dn) {
            addSubValid(message[1].dn);
            setFullName(message[1].dn);
          }
          //Detect-user-join
          if (message[1].cmd === 200) {
            if (!subsValid.includes(message[1].p.dn)) {
              setHaveAnotherPlayer(true);
              // updateSubStatus(
              //   sub.username,
              //   'Phát hiện người chơi khác vào phòng'
              // );
              // sendMessage(`[4,"Simms",${roomID}]`);
            }
          }

          //send-Start
          if (message[1].cmd === 204 || message[1].cmd === 607) {
            updateSubStatus(sub.username, 'Sent start');
            sendMessage(`[5,"Simms",${roomID},{"cmd":698}]`);
            sendMessage(`[5,"Simms",${roomID},{"cmd":5}]`);
          }
          //end-game-> out room
          if (message[1].cmd === 205 && message[1].ps) {
            updateSubStatus(sub.username, 'Out room');
            sendMessage(`[4,"Simms",${roomID}]`);
            setHaveAnotherPlayer(false);
            setReadyToJoinStatus(false);
          }
          // //In-lobby
          // if (message[1].cmd === 300 && message[1].rs) {
          //   if (sub.status != 'In lobby') {
          //     updateSubStatus(sub.username, 'In lobby');
          //   }
          // }
          //Created-room
          if (message[1].cmd === 308 && message[1].ri) {
            updateRoomID(message[1].ri.rid.toString());
            joinRoom(sub.username);
            updateSubStatus(sub.username, 'Joined Room');
            updateStatus('Created Room');
            setSubStart(true);
            setSubStart(false);
            setReadyToJoinStatus(true);
            sendMessage(`[3,"Simms",${message[1].ri.rid},"123123"]`);
          }
          if (message[1].cmd === 308 && message[1].mgs) {
            toast({
              title: `SUB ${sub.username} không đủ tiền`,
              description: message[1].mgs,
            });
          }
          //Ping-join-room
          if (message[1].cmd === 310 && message[1].As) {
            if (message[1].As.gold) {
              updateAccount('SUB', sub.username, {
                main_balance: message[1].As.gold,
              });
            }
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":"306","subi":false}]`
            );
            sendMessage(`["7", "Simms", "1",1]`);
            sendMessage(
              `[6,"Simms","channelPlugin",{"cmd":300,"gid":1,"aid":1}]`
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
            let finalCard;
            if (haveAnotherPlayer) {
              finalCard = arrangeCard(message[1].cs) as any;
            } else {
              finalCard = binhLungCard(message[1].cs) as any;
            }
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":606,"cs":[${finalCard.cards}]}]`
            );
            sendMessage(
              `[5,"Simms",${roomID},{"cmd":603,"cs":[${finalCard.cards}]}]`
            );
            updateSubStatus(sub.username, `${message[1].cs}`);
          }
        }
        //ping-pong
        if (message[0] === 6) {
          if (message[1] === 1 && message[2] == 0) {
            sendMessage(`[6,"Simms","channelPlugin",{"cmd":310}]`);
            setTimeout(() => {
              sendMessage(`["7", "Simms",2,74]`);
            }, 3000);
          } else {
            setTimeout(() => {
              sendMessage(`["7", "Simms",${message[1] + 1},${message[2]}]`);
            }, 3000);
          }
        }
      }
    } catch (error) {
      console.error('Error processing messages:', error);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isReadyToFind && isReadyToCreate && !createdRoom) {
      if (!isFoundedRoom) {
        // sendMessage(
        //   `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":1,"b":${roomType},"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
        // );
        sendMessage(
          `[6,"Simms","channelPlugin",{"cmd":308,"gid":1,"aid":1,"b":${roomType},"Mu":4,"pwd":"123123","iJ":true}]`
        );
        updateSubStatus(sub.username, 'Create Room');
        updateStatus('Create Room');
        setCreatedRoom(true);
      }
    }
  }, [lastMessage, isReadyToCreate, isReadyToFind]);

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
  // useEffect(() => {
  //   if (isMainJoin) {
  //     updateSubStatus(sub.username, 'Out room');
  //     sendMessage(`[4,"Simms",${roomID}]`);

  //     setReadyToJoinStatus(false);
  //   }
  // }, [isMainJoin]);

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
