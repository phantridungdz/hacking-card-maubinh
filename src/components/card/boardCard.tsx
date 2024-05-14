import { Ban } from 'lucide-react';
import React, { useId, useMemo } from 'react';
import useGameStore from '../../store/gameStore';
import { HandCard } from '../card/handcard';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { TableCell } from '../ui/table';

const BoardCard: React.FC<any> = ({ indexProps, cards, numPlayers }) => {
  const { activeGame } = useGameStore();

  const id = useId();
  const playerHands = useMemo(() => {
    const playerHands: number[][] = Array.from(
      { length: numPlayers },
      () => []
    );
    cards.length > 0 &&
      cards.forEach((card: number, index: number) => {
        const playerIndex = index % numPlayers;
        if (playerHands[playerIndex].length < 13) {
          playerHands[playerIndex].push(card);
        }
      });

    return playerHands;
  }, [cards, numPlayers]);

  return (
    <>
      {cards.length > 1 && (
        <TableCell
          key={indexProps}
          className={`grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 !w-[100%] gap-[10px] py-6 bg-opacity-60 ${
            activeGame === indexProps && 'bg-gray-400'
          }`}
          id={activeGame === indexProps ? 'boardCard-active' : id}
        >
          <Label className="absolute top-[-10px] left-[-10px] border bg-background rounded-md p-2 z-[20]">
            {indexProps + 1}
          </Label>
          {playerHands.map((hand, index) => (
            <HandCard key={index} index={indexProps} cardProp={hand} />
          ))}
        </TableCell>
      )}
      {cards.length == 0 && (
        <Card className="w-full h-[200px] flex flex-col justify-center items-center">
          <Label className="absolute top-[-10px] left-[-10px] border bg-background rounded-md p-2 z-[20]">
            {indexProps + 1}
          </Label>
          <Ban />
          <Label className="font-bold text-[15px] text-red-400">
            Error Card !
          </Label>
          <Label className="font-bold text-[12px] text-white">
            We can not see this game :(
          </Label>
        </Card>
      )}
    </>
  );
};

export default BoardCard;
