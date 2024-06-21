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
const getCardType = (cardT: any) => {
  switch (cardT) {
    case 'set1':
      return 'Loại 1';
    case 'set2':
      return 'Loại 2';
    default:
      return 'Loại 3';
  }
};
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
            {getCardType(cardType)}
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
            {getCardType(cardT)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CardType;
