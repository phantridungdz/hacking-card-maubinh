import { ChevronDown, GlobeLock } from 'lucide-react';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { fromHitSites, fromRikSites } from '../../lib/config';
import useGameConfigStore from '../../store/gameConfigStore';
import useGameStore from '../../store/gameStore';
import { Label } from '../ui/label';

const FromSite: React.FC<any> = () => {
  const { roomType, setRoomType } = useGameStore();
  const { currentFromSite } = useGameConfigStore();
  const [fromSite, setFromSite] = useState(currentFromSite);
  const handleFromSiteChange = (target: number) => {
    setFromSite(target);
  };
  const fromSites = currentFromSite === 'RIK' ? fromRikSites : fromHitSites;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex p-[10px] rounded-sm border">
          <Label className="flex flex-row gap-2">
            <GlobeLock className="w-3.5 h-3.5" />
            Site:{' '}
            <span className={`text-${roomType.toLowerCase()}`}>{roomType}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Label>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>From Site</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {fromSites.map((fromSite: any) => (
          <DropdownMenuCheckboxItem
            key={fromSite}
            className={`text-${roomType.toLowerCase()}-500`}
            checked={fromSite}
            onSelect={() => handleFromSiteChange(fromSite)}
          >
            {fromSite}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FromSite;
