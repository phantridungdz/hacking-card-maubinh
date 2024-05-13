// import useBotWebSocket from '../../hooks/useBotWebSocket';
import { Crown } from 'lucide-react';
import useHostWebSocket from '../../hooks/useHostBotWebSocket';
import { Card } from '../ui/card';

export const HostController: React.FC<any> = ({ bot, roomID }) => {
  const { connectionStatus } = useHostWebSocket(bot, roomID);
  return (
    <fieldset className=" rounded-lg border p-4 text-right">
      <legend className="-ml-1 px-1 text-sm font-medium flex gap-2 items-center">
        {connectionStatus}
        <Crown />
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