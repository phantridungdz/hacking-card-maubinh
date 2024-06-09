import { Gamepad, Home } from 'lucide-react';
import { useEffect } from 'react';
import useSubRoomStore from '../../store/subRoomStore';
import { HostSubController } from './hostSubController';
import { HostSubSunController } from './hostSubSunController';
import { SubController } from './subController';
import { SubSunController } from './subSunController';

export const SubRoomController: React.FC<any> = ({}) => {
  const { subs, subsInLobby, subsInRoom, subRoomStatus, roomID, updateStatus } =
    useSubRoomStore();
  useEffect(() => {
    if (subsInLobby.length == 2) {
      updateStatus('Ready');
    }
    if (subsInLobby.length < 2 && subRoomStatus != 'Not-ready') {
      updateStatus('Not-ready');
    }
  }, [subsInLobby]);
  return (
    <fieldset className=" rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">SUB ROOM</legend>
      <div className="grid grid-cols-4 p-2 border mb-2 text-[13px]">
        <div className="font-bold">RoomID: {roomID}</div>
        <div className="font-bold flex flex-row gap-2 items-center">
          <Home className="w-3.5 h-3.5" /> {subsInLobby.length}
        </div>
        <div className="font-bold flex flex-row gap-2 items-center">
          <Gamepad className="w-3.5 h-3.5" /> {subsInRoom.length}
        </div>
        <div className="font-bold flex flex-row gap-2">
          <p>
            Status:{' '}
            <span
              className={`${
                subRoomStatus === 'Ready' ? 'text-green-500' : 'text-red-400'
              }`}
            >
              {subRoomStatus}
            </span>
          </p>{' '}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {subs &&
          subs.map((sub: any, index: any) => {
            if (sub.role === 'host') {
              if (sub.targetSite !== 'SUNWIN') {
                return (
                  <HostSubController key={index} sub={sub} roomID={roomID} />
                );
              } else {
                return (
                  <HostSubSunController key={index} sub={sub} roomID={roomID} />
                );
              }
            } else if (sub.role === 'guest') {
              if (sub.targetSite !== 'SUNWIN') {
                return <SubController key={index} sub={sub} roomID={roomID} />;
              } else {
                return (
                  <SubSunController key={index} sub={sub} roomID={roomID} />
                );
              }
            }
          })}
      </div>
    </fieldset>
  );
};
