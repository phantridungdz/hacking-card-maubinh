import React, { useId, useMemo } from 'react';
import useGameStore from '../../store/gameStore';
import { HandCard } from '../card/handcard';
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
    cards.forEach((card: number, index: number) => {
      const playerIndex = index % numPlayers;
      if (playerHands[playerIndex].length < 13) {
        playerHands[playerIndex].push(card);
      }
    });

    return playerHands;
  }, [cards, numPlayers]);

  return (
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
  );
};

export default BoardCard;
