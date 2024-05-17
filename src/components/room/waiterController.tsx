// import useBotWebSocket from '../../hooks/useBotWebSocket';
import { Clock, DollarSign } from 'lucide-react';
import useWaiterWebSocket from '../../hooks/useWaiterBotWebSocket';
import { Card } from '../ui/card';

export const WaiterController: React.FC<any> = ({ bot, roomID }) => {
  const { connectionStatus, botMoneyChange } = useWaiterWebSocket(bot, roomID);
  return (
    <fieldset className=" rounded-lg border p-4 text-right">
      <legend className="-ml-1 px-1 text-sm font-medium flex gap-2 items-center">
        {connectionStatus}
        <Clock />
      </legend>

      <div className="flex flex-col gap-2">
        <Card
          x-chunk="dashboard-07-chunk-1"
          className="grid grid-cols-4 p-2 text-left"
        >
          <div>{bot.username}</div>
          <div className="col-span-2">{bot.status}</div>
          <div className="flex flex-row justify-center items-center">
            <DollarSign className="w-3.5 h-3.5" />
            {botMoneyChange}
          </div>
        </Card>
      </div>
    </fieldset>
  );
};
