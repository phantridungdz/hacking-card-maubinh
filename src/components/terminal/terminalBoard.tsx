import {
  ArrowLeft,
  ArrowRight,
  Chrome,
  Home,
  MapPin,
  Play,
  PlusCircle,
  RefreshCcw,
  TrashIcon,
  UserPlus,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { ScrollArea } from '../../components/ui/scroll-area';
import { highlightSyntax } from '../../lib/terminal';
import useAccountStore from '../../store/accountStore';
import useGameConfigStore from '../../store/gameConfigStore';
import useGameStore from '../../store/gameStore';
import { useToast } from '../toast/use-toast';
import { Badge } from '../ui/badge';
import { Toggle } from '../ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { getAddNameTagCommand } from './commandTerminal';
import {
  arrangeCards,
  checkPosition,
  createRoom,
  invitePlayer,
  joinLobby,
  joinRoom,
  moneyChange,
  openAccounts,
  outInRoom,
  outRoom,
  sendStart,
} from './handlerTerminal';

export const TerminalBoard: React.FC<any> = ({ main }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState<unknown[]>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [currentSit, setCurrentSit] = useState('');
  const [autoInvite, setAutoInvite] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(false);

  const autoStartRef = useRef(autoStart);
  const { mainRoomID, isStartGame, setMainJoinStatus, setMainCard } =
    useGameStore();
  const { currentTargetSite } = useGameConfigStore();
  const { updateAccount } = useAccountStore();

  const parseData = (dataString: string) => {
    try {
      const parsedData = JSON.parse(dataString);
      return parsedData;
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };

  const handleData = ({ data, username, displayName }: any) => {
    if (username === main.username) {
      setIsLogin(true);

      const parsedData = parseData(data);
      if (parsedData[1].cmd === 310 && parsedData[1].As) {
        if (parsedData[1].As.gold) {
          updateAccount('MAIN', main.username, {
            main_balance: parsedData[1].As.gold,
          });
        }
      }
      if (parsedData[0] == 5 && parsedData[1].cmd === 317) {
      }
      if (parsedData[0] == 3 && parsedData[1] === true) {
        setCurrentRoom(parsedData[3].toString());
        toast({
          title: 'Đã vào phòng',
          description: 'ID Room:  ' + parsedData[3].toString(),
        });
      }
      if (parsedData[0] == 5) {
        if (
          parsedData[1].cmd === 204 ||
          parsedData[1].cmd === 607 ||
          parsedData[1].cmd === 5
        ) {
          if (autoStartRef.current) {
            sendStart(main);
          }
        }
        checkPosition(main);
        if (parsedData[1].cmd === 205) {
        }
        if (parsedData[1].p) {
          toast({
            title: parsedData[1].p.dn,
            description: parsedData[1].p.dn + ' tới chơi.',
          });
        }
        if (
          parsedData[1].cmd === 602 &&
          (parsedData[1].hsl == false || parsedData[1].hsl == true)
        ) {
          const user = parsedData[1].ps.find(
            (item: { dn: string }) => item.dn === displayName
          );
          if (user) {
            const licenseKey =
              process.env.NODE_ENV != 'development'
                ? localStorage.getItem('license-key')
                : ('local-chase' as string);
            moneyChange(licenseKey, parseInt(user.mX), navigate);
          } else {
            console.log('Username not found.');
          }
        }
        if (parsedData[1].cs && parsedData[1].cmd === 600) {
          const currentCards = parsedData[1].cs
            .toString()
            .split(',')
            .map(Number);
          toast({
            title: 'Đã phát bài',
            description: currentCards,
          });
          setMainCard(parsedData[1].cs);

          setData((currentData) => [
            ...currentData,
            parsedData[1].cs.toString().split(',').map(Number),
          ]);

          arrangeCards(main);
        }
      }
      if (parsedData[0] !== '7' && parsedData[0] != 5) {
        setData((currentData) => [...currentData, parsedData]);
      }
    }
  };

  const handleDataSent = ({ data, username }: any) => {
    if (username === main.username) {
      if (data == `[ 1, true, 0, "rik_${main.username}", "Simms", null ]`) {
        console.log('Đã login man');
      }
      if (
        !data.includes('[6,1') &&
        !data.includes(
          '[5,{"rs":[{"mM":1000000,"b' && !data.includes('["7","Simms",')
        )
      ) {
        const parsedData = parseData(data);

        if (parsedData[0] == 3 && parsedData[2] === 19) {
          window.backend.sendMessage(
            'check-room',
            main,
            `__require('GamePlayManager').default.getInstance().getRoomId()`
          );
        }
      }
    }
  };

  const handleCheckPosition = ({ data, username }: any) => {
    if (username === main.username) {
      setCurrentSit(parseInt(data + 1).toString());
    }
  };

  useEffect(() => {
    autoStartRef.current = autoStart;
  }, [autoStart]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoInvite) {
      interval = setInterval(() => {
        invitePlayer(main);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoInvite, main]);

  useEffect(() => {
    window.backend.on('websocket-data', handleData);
    window.backend.on('websocket-data-sent', handleDataSent);
    window.backend.on('check-position', handleCheckPosition);

    return () => {
      window.backend.removeListener('websocket-data', handleData);
      window.backend.removeListener('websocket-data-sent', handleDataSent);
      window.backend.removeListener('check-position', handleCheckPosition);
    };
  }, []);

  useEffect(() => {
    if (mainRoomID) {
      if (currentTargetSite === 'RIK') {
        window.backend.sendMessage(
          'execute-script',
          main,
          `__require('GamePlayManager').default.getInstance().joinRoom(${mainRoomID},0,'',true);`
        );
      } else {
        if (
          main.fromSite === 'LUCKY88' ||
          main.fromSite === 'DEBET' ||
          main.fromSite === 'MAY88' ||
          main.fromSite === 'SV88' ||
          main.fromSite === 'FIVE88' ||
          main.fromSite === 'UK88' ||
          main.fromSite === '11BET'
        ) {
          window.backend.sendMessage(
            'execute-script',
            main,
            `__require('GamePlayManager').default.getInstance().joinRoomWithGameID(${mainRoomID},'',4);`
          );
        } else {
          window.backend.sendMessage(
            'execute-script',
            main,
            `__require('GamePlayManager').default.getInstance().joinRoomWithGameID(${mainRoomID},0,'',4);`
          );
        }
        setMainJoinStatus(true);
      }
    }
  }, [mainRoomID]);

  useEffect(() => {
    if (isStartGame) {
      openAccounts(main);
    }
  }, [isStartGame]);

  useEffect(() => {
    window.backend.sendMessage(
      'execute-script',
      main,
      getAddNameTagCommand(main)
    );
  }, [isLogin]);

  const clearData = () => {
    setData([]);
  };

  return (
    <fieldset className=" rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium flex items-center gap-2">
        <Badge className=" uppercase" variant={main.fromSite.toLowerCase()}>
          {main.fromSite}
        </Badge>
        {main.username}
      </legend>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-[10px]">
          <div className="flex justify-end gap-2">
            <Label
              style={{ fontFamily: 'monospace' }}
              className="flex items-center bg-background border p-[5px]  flex-grow justify-start font-bold rounded-sm"
            >
              Room: {currentRoom ?? ''}
            </Label>

            <div>
              <Label
                style={{ fontFamily: 'monospace' }}
                className="flex items-center bg-background border p-[5px] w-[40px] h-[30px] flex-grow justify-center font-bold rounded-full flex-row gap-[3px]"
              >
                <MapPin className="w-3.5 h-3.5" />
                {currentSit}
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-2">
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => openAccounts(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full border bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <Chrome className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Browser</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => joinLobby(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full border bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <Home className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Join Lobby</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => createRoom(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full border bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Room</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => {
                    joinRoom(main, mainRoomID, currentTargetSite);
                    setMainJoinStatus(true);
                  }}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full border bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Join Room</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => {
                    outRoom(main), setMainJoinStatus(false);
                  }}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full border bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Out Room</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => outInRoom(main, mainRoomID)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-[30px] border bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <RefreshCcw className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Out-In Room</p>
              </TooltipContent>
            </Tooltip>
            <div className="h-full w-full rounded-[5px] flex justify-center items-center border cursor-pointer">
              <Toggle pressed={autoInvite} onPressedChange={setAutoInvite}>
                <UserPlus className="h-3.5 w-3.5" />
              </Toggle>
            </div>
            <div className="h-full w-full rounded-[5px] flex justify-center items-center border cursor-pointer">
              <Toggle pressed={autoStart} onPressedChange={setAutoStart}>
                <Play className="h-3.5 w-3.5" />
              </Toggle>
            </div>
          </div>
        </div>
        <div className="flex flex-col terminal relative rounded-md border ">
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={clearData}
              className="  hover:bg-slate-400 rounded-[5px] p-0 border-[2px] flex justify-center items-center cursor-pointer  gap-[2px] px-[7px] h-[30px]"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
          <ScrollArea
            id="messageContainer"
            className="flex flex-col grow h-full max-w-screen"
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="font-bold text-left command-input"
                style={{ fontFamily: 'monospace' }}
                dangerouslySetInnerHTML={{
                  __html: highlightSyntax(JSON.stringify(item, null, 2)),
                }}
              />
            ))}
          </ScrollArea>
        </div>
      </div>
    </fieldset>
  );
};
