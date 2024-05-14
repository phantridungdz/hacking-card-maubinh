import { ChevronDown, DollarSign } from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { roomTypes } from '../../lib/config';
import useGameStore from '../../store/gameStore';
import { Button } from '../ui/button';

const RoomType: React.FC<any> = () => {
  const { roomType, setRoomType } = useGameStore();
  function formatCurrency(value: number) {
    const cash = value / 1000;
    return cash < 1 ? value : `${value} (${cash}k)`;
  }
  const handleRoomTypeChange = (money: number) => {
    setRoomType(money);
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
            {formatCurrency(roomType)}
          </span>
          <DollarSign className="h-3.5 w-3.5" />
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Room Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roomTypes.map((rType: any) => (
          <DropdownMenuCheckboxItem
            key={rType}
            checked={roomType}
            onSelect={() => handleRoomTypeChange(rType)}
          >
            {formatCurrency(rType)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoomType;
