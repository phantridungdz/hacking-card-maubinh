import { ChevronDown, GlobeLock } from 'lucide-react';
import React, { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { targetSites } from '../../lib/config';
import useGameConfigStore from '../../store/gameConfigStore';
import useGameStore from '../../store/gameStore';
import { Label } from '../ui/label';

const TargetSite: React.FC<any> = () => {
  const { roomType, setRoomType } = useGameStore();
  const { currentTargetSite, setTargetSite } = useGameConfigStore();
  const handleTargetSiteChange = (target: number) => {
    setTargetSite(target);
    window.backend.sendMessage('update-header', target);
  };
  useEffect(() => {
    setTargetSite('RIK');
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex p-[10px] rounded-sm border">
          <Label className="flex flex-row gap-2">
            <GlobeLock className="w-3.5 h-3.5" />
            Site:{' '}
            <span className={`text-${currentTargetSite.toLowerCase()}`}>
              {currentTargetSite}
            </span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Label>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Target Site</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {targetSites.map((targetSite: any) => (
          <DropdownMenuCheckboxItem
            key={targetSite}
            checked={roomType}
            className={`text-${currentTargetSite.toLowerCase()}`}
            onSelect={() => handleTargetSiteChange(targetSite)}
          >
            {targetSite}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TargetSite;
