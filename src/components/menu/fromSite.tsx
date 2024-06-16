import { ChevronDown, GlobeLock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  fromB52Sites,
  fromHitSites,
  fromRikSites,
  fromSunWinSites,
} from '../../lib/config';
import useGameConfigStore from '../../store/gameConfigStore';
import useGameStore from '../../store/gameStore';
import { Label } from '../ui/label';

const FromSite: React.FC<any> = () => {
  const { roomType } = useGameStore();
  const { currentFromSite, setCurrentFromSite } = useGameConfigStore();

  const [fromSites, setFromSites] = useState<any>([]);

  useEffect(() => {
    console.log('currentFromSite', currentFromSite);
    switch (currentFromSite) {
      case 'RIK':
        setFromSites(fromRikSites);
        break;
      case 'HIT':
        console.log('fromHitSites', fromHitSites);

        setFromSites(fromHitSites);
        break;
      case 'B52':
        console.log('fromB52Sites', fromB52Sites);
        setFromSites(fromB52Sites);
        break;
      default:
        setFromSites(fromSunWinSites);
        break;
    }
  }, [currentFromSite]);

  const handleFromSiteChange = (site: string) => {
    console.log('site', site);
    setCurrentFromSite(site);
  };

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
        {fromSites.map((site: string) => (
          <DropdownMenuCheckboxItem
            key={site}
            className={`text-${roomType.toLowerCase()}-500`}
            checked={site === currentFromSite}
            onSelect={() => handleFromSiteChange(site)}
          >
            {site}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FromSite;
