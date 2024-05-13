import { useEffect, useState } from 'react';
import useAccountStore from '../../store/accountStore';
import useBotRoomStore from '../../store/botRoomStore';
import useGameStore from '../../store/gameStore';
import useSubRoomStore from '../../store/subRoomStore';
import { BotRoomController } from '../room/botRoomController';
import { SubRoomController } from '../room/subRoomController';
import { ScrollArea } from '../ui/scroll-area';
import BotSetting from './botSheet';

interface FindRoomSheetProps {
  isOpen: boolean;
  setIsOpen: any;
}

export function FindRoomSheet({ isOpen, setIsOpen }: FindRoomSheetProps) {
  const [roomsReady, setRoomsReady] = useState(0);

  const { accounts, updateAccount } = useAccountStore();
  const { setReadyToFindStatus } = useGameStore();

  const { addBot, bots, botRoomStatus } = useBotRoomStore();
  const { addSub, subs, subRoomStatus } = useSubRoomStore();
  useEffect(() => {
    if (bots.length < 4) {
      const botsPerPair = 4;
      let availableBots = accounts['BOT'].filter(
        (bot: { used: any }) => !bot.used
      );
      availableBots = availableBots.filter(
        (bot: { isSelected: any }) => bot.isSelected
      );
      availableBots
        .slice(0, botsPerPair)
        .forEach((bot: { username: any; role: any }, index: number) => {
          const role = index === 0 ? 'host' : index > 1 ? 'waiter' : 'guest';
          updateAccount('BOT', bot.username, { used: true, role: role });
          addBot(bot, role);
        });
    }
  }, [accounts['BOT']]);

  useEffect(() => {
    if (subs.length < 2) {
      const subsPerPair = 2;
      let availableSubs = accounts['SUB'].filter(
        (sub: { used: any }) => !sub.used
      );
      availableSubs = availableSubs.filter(
        (sub: { isSelected: any }) => sub.isSelected
      );
      availableSubs
        .slice(0, subsPerPair)
        .forEach((sub: { username: any; role: any }, index: number) => {
          const role = index === 0 ? 'host' : index > 1 ? 'waiter' : 'guest';
          updateAccount('SUB', sub.username, { used: true, role: role });
          addSub(sub, role);
        });
    }
  }, [accounts['SUB']]);

  useEffect(() => {
    var botRoomReadyCount = 0;
    var subRoomReadyCount = 0;
    if (botRoomStatus === 'Ready') {
      botRoomReadyCount += 1;
    }
    if (subRoomStatus === 'Ready') {
      subRoomReadyCount += 1;
    }
    setRoomsReady(botRoomReadyCount + subRoomReadyCount);
  }, [subRoomStatus, botRoomStatus]);

  useEffect(() => {
    if (roomsReady === 2) {
      setReadyToFindStatus(true);
    } else {
      // setTimeout(() => {
      setReadyToFindStatus(false);
      // }, 300);
    }
  }, [roomsReady]);

  return (
    <BotSetting isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="font-bold w-full flex justify-center">
        <p>
          Room ready:{' '}
          <span
            className={`${
              roomsReady == 2 ? 'text-green-500' : 'text-red-400'
            } `}
          >
            {roomsReady}/2
          </span>
        </p>
      </div>
      {/* <div className="flex gap-2">
        <Button onClick={() => setStartGameStatus(true)}>Connect</Button>
        <Button onClick={() => setStartGameStatus(false)}>Disconnect</Button>
        <Button onClick={() => setReadyToCreateStatus(true)}>Create</Button>
        <Button onClick={() => setRoomFoundStatus(true)}>Founded Game !</Button>
      </div> */}
      <ScrollArea className="h-full rounded-md flex flex-col">
        <div className="flex flex-col  text-white space-y-4 flex-1 w-full">
          <SubRoomController />
          <BotRoomController />
        </div>
      </ScrollArea>
    </BotSetting>
  );
}
