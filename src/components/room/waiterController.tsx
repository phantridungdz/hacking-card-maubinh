// import useBotWebSocket from '../../hooks/useBotWebSocket';
import { Clock } from 'lucide-react';
import useWaiterWebSocket from '../../hooks/useWaiterBotWebSocket';
import useBotRoomStore from '../../store/botRoomStore';
import { Card } from '../ui/card';

export const WaiterController: React.FC<any> = ({ bot, roomID }) => {
  const { joinRoom } = useBotRoomStore();
  const { connectionStatus } = useWaiterWebSocket(bot, roomID);
  return (
    <fieldset className=" rounded-lg border p-4 text-right">
      <legend className="-ml-1 px-1 text-sm font-medium flex gap-2 items-center">
        {connectionStatus}
        <Clock />
      </legend>

      <div className="flex flex-col gap-2">
        <Card
          x-chunk="dashboard-07-chunk-1"
          className="grid grid-cols-3 p-2 text-left"
        >
          <div>{bot.username}</div>
          <div className="col-span-2">{bot.status}</div>
        </Card>
      </div>
    </fieldset>
  );
};
