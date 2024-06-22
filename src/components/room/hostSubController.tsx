// import useSubWebSocket from '../../hooks/useSubWebSocket';
import { Crown, DollarSign } from 'lucide-react';
import useHostSubWebSocket from '../../hooks/useHostSubWebSocket';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const HostSubController: React.FC<any> = ({ sub, roomID }) => {
  const { connectionStatus, botMoneyChange } = useHostSubWebSocket(sub, roomID);
  return (
    <fieldset className=" rounded-lg border p-4 text-right">
      <legend className="-ml-1 px-1 text-sm font-medium flex gap-2 items-center">
        {connectionStatus}
        <Badge className=" uppercase" variant={sub.fromSite.toLowerCase()}>
          {sub.fromSite}
        </Badge>
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
