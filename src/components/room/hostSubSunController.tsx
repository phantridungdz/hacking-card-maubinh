import useHostSubSunWebSocket from 'hooks/useHostSubSunWebSocket';
import { Crown, DollarSign } from 'lucide-react';
import { Card } from '../ui/card';

export const HostSubSunController: React.FC<any> = ({ sub, roomID }) => {
  const { connectionStatus, botMoneyChange } = useHostSubSunWebSocket(
    sub,
    roomID
  );
  return (
    <fieldset className=" rounded-lg border p-4 text-right">
      <legend className="-ml-1 px-1 text-sm font-medium flex gap-2 items-center">
        SUN-{connectionStatus}
        <Crown />
      </legend>

      <div className="flex flex-col gap-2">
        <Card
          x-chunk="dashboard-07-chunk-1"
          className="grid grid-cols-4 p-2 text-left"
        >
          <div>{sub.username}</div>
          <div className="col-span-2">{sub.status}</div>
          <div className="flex flex-row justify-center items-center">
            <DollarSign className="w-3.5 h-3.5" />
            {botMoneyChange}
          </div>
        </Card>
      </div>
    </fieldset>
  );
};
