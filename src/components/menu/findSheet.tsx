import { useEffect, useState } from 'react';
import useAccountStore from '../../store/accountStore';
import useBotRoomStore from '../../store/botRoomStore';
import useGameConfigStore from '../../store/gameConfigStore';
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
  const { currentTargetSite } = useGameConfigStore();
  const { accounts, updateAccount } = useAccountStore();
  const { setReadyToFindStatus, setIsLogining } = useGameStore();
  const { addBot, bots, botRoomStatus, clearBots } = useBotRoomStore();
  const { addSub, subs, subRoomStatus, clearSubs } = useSubRoomStore();
  useEffect(() => {
    if (bots.length < 4) {
      const botsPerPair = 4;
      let availableBots = accounts['BOT'].filter(
        (bot: { used: any }) => !bot.used
      );
      availableBots = availableBots.filter(
        (bot: { isSelected: any; targetSite: string }) =>
          bot.isSelected && bot.targetSite === currentTargetSite
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
    clearBots();
  }, [currentTargetSite]);

  useEffect(() => {
    if (subs.length < 2) {
      const subsPerPair = 2;
      let availableSubs = accounts['SUB'].filter(
        (sub: { used: any }) => !sub.used
      );
      availableSubs = availableSubs.filter(
        (sub: { isSelected: any; targetSite: string }) =>
          sub.isSelected && sub.targetSite === currentTargetSite
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
    clearSubs();
  }, [currentTargetSite]);

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
      setIsLogining(false);
    } else {
      setReadyToFindStatus(false);
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
      <ScrollArea className="h-full rounded-md flex flex-col">
        <div className="flex flex-col  text-white space-y-4 flex-1 w-full">
          <SubRoomController />
          <BotRoomController />
        </div>
      </ScrollArea>
    </BotSetting>
  );
}
