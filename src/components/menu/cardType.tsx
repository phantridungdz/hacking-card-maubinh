import { ChevronDown } from 'lucide-react';
import React from 'react';
import { cardTypes } from '../../lib/config';
import useGameConfigStore from '../../store/gameConfigStore';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { HandCardIcon } from '../ui/icons';

const CardType: React.FC<any> = () => {
  const { cardType, setCardType } = useGameConfigStore();

  const handleRoomTypeChange = (money: number) => {
    setCardType(money);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 !border-[#fff]"
        >
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {cardType === 'set1' ? 'Loại 1' : 'Loại 2'}
          </span>
          <HandCardIcon />
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Room Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {cardTypes.map((cardT: any) => (
          <DropdownMenuCheckboxItem
            key={cardT}
            checked={cardType}
            onSelect={() => handleRoomTypeChange(cardT)}
          >
            {cardT === 'set1' ? 'Loại 1' : 'Loại 2'}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CardType;
