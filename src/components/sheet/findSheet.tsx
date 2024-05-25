import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAccountStore from '../../store/accountStore';
import useBotRoomStore from '../../store/botRoomStore';
import useGameConfigStore from '../../store/gameConfigStore';
import useGameStore from '../../store/gameStore';
import useSubRoomStore from '../../store/subRoomStore';
import { BotRoomController } from '../room/botRoomController';
import { SubRoomController } from '../room/subRoomController';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import BotSetting from './botSheet';

interface FindRoomSheetProps {
  isOpen: boolean;
  setIsOpen: any;
  onRefreshBot: any;
}

export function FindRoomSheet({
  isOpen,
  setIsOpen,
  onRefreshBot,
}: FindRoomSheetProps) {
  const [roomsReady, setRoomsReady] = useState(0);
  const { currentTargetSite } = useGameConfigStore();
  const { accounts, updateAccount } = useAccountStore();
  const { setReadyToFindStatus, setIsLogining } = useGameStore();
  const { addBot, bots, botRoomStatus, clearBots, removeBot } =
    useBotRoomStore();
  const { addSub, subs, subRoomStatus, clearSubs, removeSub } =
    useSubRoomStore();

  // Clear bots and subs when currentTargetSite changes
  useEffect(() => {
    clearBots();
    clearSubs();
  }, [currentTargetSite, clearBots, clearSubs]);

  // Add bots when accounts or currentTargetSite changes
  useEffect(() => {
    if (bots.length < 4) {
      const botsPerPair = 4;

      let availableBots = accounts['BOT'].filter(
        (bot: { isSelected: boolean; targetSite: string }) =>
          bot.isSelected && bot.targetSite === currentTargetSite
      );

      availableBots
        .slice(0, botsPerPair)
        .forEach((bot: { username: string; role: string }, index: number) => {
          const role =
            bot.role || (index === 0 ? 'host' : index > 1 ? 'waiter' : 'guest');
          if (
            !bots.some(
              (existingBot: { username: string }) =>
                existingBot.username === bot.username
            )
          ) {
            updateAccount('BOT', bot.username, { role });
            addBot(bot, role);
          }
        });
    }
  }, [accounts, currentTargetSite, bots, addBot, updateAccount]);

  // Add subs when accounts or currentTargetSite changes
  useEffect(() => {
    if (subs.length < 2) {
      const subsPerPair = 2;

      let availableSubs = accounts['SUB'].filter(
        (sub: { isSelected: boolean; targetSite: string }) =>
          sub.isSelected && sub.targetSite === currentTargetSite
      );

      availableSubs
        .slice(0, subsPerPair)
        .forEach((sub: { username: string; role: string }, index: number) => {
          const role =
            sub.role || (index === 0 ? 'host' : index > 1 ? 'waiter' : 'guest');
          if (
            !subs.some(
              (existingSub: { username: string }) =>
                existingSub.username === sub.username
            )
          ) {
            updateAccount('SUB', sub.username, { role });
            addSub(sub, role);
          }
        });
    }
  }, [accounts, currentTargetSite, subs, addSub, updateAccount]);

  // Remove bots or subs that are no longer selected or no longer target the current site
  useEffect(() => {
    const botsToRemove = bots.filter(
      (bot: any) =>
        !accounts['BOT'].some(
          (account: any) =>
            account.username === bot.username &&
            account.isSelected &&
            account.targetSite === currentTargetSite
        )
    );
    const subsToRemove = subs.filter(
      (sub: any) =>
        !accounts['SUB'].some(
          (account: any) =>
            account.username === sub.username &&
            account.isSelected &&
            account.targetSite === currentTargetSite
        )
    );

    botsToRemove.forEach((bot: any) => removeBot(bot.username));
    subsToRemove.forEach((sub: any) => removeSub(sub.username));
  }, [accounts, currentTargetSite, bots, subs, removeBot, removeSub]);

  // Update room ready status
  useEffect(() => {
    let botRoomReadyCount = botRoomStatus === 'Ready' ? 1 : 0;
    let subRoomReadyCount = subRoomStatus === 'Ready' ? 1 : 0;
    setRoomsReady(botRoomReadyCount + subRoomReadyCount);
  }, [subRoomStatus, botRoomStatus]);

  // Update find status based on room readiness
  useEffect(() => {
    if (roomsReady === 2) {
      setReadyToFindStatus(true);
      setIsLogining(false);
    } else {
      setReadyToFindStatus(false);
    }
  }, [roomsReady, setReadyToFindStatus, setIsLogining]);

  return (
    <BotSetting isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="font-bold w-full flex justify-center items-center gap-3">
        <p>
          Room ready:{' '}
          <span
            className={`${roomsReady == 2 ? 'text-green-500' : 'text-red-400'}`}
          >
            {roomsReady}/2
          </span>
        </p>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 border"
          onClick={onRefreshBot}
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </Button>
      </div>
      <ScrollArea className="h-full rounded-md flex flex-col">
        <div className="flex flex-col text-white space-y-4 flex-1 w-full">
          <SubRoomController />
          <BotRoomController />
        </div>
      </ScrollArea>
    </BotSetting>
  );
}
