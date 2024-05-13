import { Gamepad, Home } from 'lucide-react';
import { useEffect } from 'react';
import useBotRoomStore from '../../store/botRoomStore';
import useGameStore from '../../store/gameStore';
import { BotController } from './botController';
import { HostController } from './hostController';
import { WaiterController } from './waiterController';

export const BotRoomController: React.FC<any> = ({}) => {
  const { bots, botsInLobby, botsInRoom, botRoomStatus, roomID, updateStatus } =
    useBotRoomStore();
  const { isFoundedRoom } = useGameStore();
  useEffect(() => {
    if (botsInLobby.length == 4) {
      updateStatus('Ready');
    }
    if (isFoundedRoom) {
      if (botsInLobby.length == 2 && botRoomStatus != 'Not-ready') {
        updateStatus('Not-ready');
      }
    } else {
      if (botsInLobby.length == 0 && botRoomStatus != 'Not-ready') {
        updateStatus('Not-ready');
      }
    }
  }, [botsInLobby]);
  return (
    <fieldset className=" rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">BOT ROOM</legend>
      <div className="grid grid-cols-4 p-2 border mb-2 text-[13px]">
        <div className="font-bold">RoomID: {roomID}</div>
        <div className="font-bold flex flex-row gap-2 items-center">
          <Home className="w-3.5 h-3.5" /> {botsInLobby.length}
        </div>
        <div className="font-bold flex flex-row gap-2 items-center">
          <Gamepad className="w-3.5 h-3.5" /> {botsInRoom.length}
        </div>
        <div className="font-bold flex flex-row gap-2">
          <p>
            Status:{' '}
            <span
              className={`${
                botRoomStatus === 'Ready' ? 'text-green-500' : 'text-red-400'
              }`}
            >
              {botRoomStatus}
            </span>
          </p>{' '}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {bots &&
          bots.map((bot: any, index: any) =>
            bot.role == 'host' ? (
              <HostController key={index} bot={bot} roomID={roomID} />
            ) : bot.role == 'guest' ? (
              <BotController key={index} bot={bot} roomID={roomID} />
            ) : (
              <WaiterController key={index} bot={bot} roomID={roomID} />
            )
          )}
      </div>
    </fieldset>
  );
};
