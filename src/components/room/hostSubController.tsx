// import useSubWebSocket from '../../hooks/useSubWebSocket';
import { Crown } from 'lucide-react';
import useHostSubWebSocket from '../../hooks/useHostSubWebSocket';
import { Card } from '../ui/card';

export const HostSubController: React.FC<any> = ({ sub, roomID }) => {
  const { connectionStatus } = useHostSubWebSocket(sub, roomID);
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
          <div>{sub.username}</div>
          <div className="col-span-2">{sub.status}</div>
        </Card>
      </div>
    </fieldset>
  );
};
