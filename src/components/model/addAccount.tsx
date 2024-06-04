import { ChevronDown, GlobeLock } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { generateAccount } from '../../lib/account';
import { fromHitSites, fromRikSites, fromSunWinSites } from '../../lib/config';
import { supabase } from '../../lib/supabase';
import useAccountStore from '../../store/accountStore';
import useGameConfigStore from '../../store/gameConfigStore';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const AddAccount: React.FC<any> = ({
  isDialogAddAccountOpen,
  setDialogAddAccountOpen,
  accountType,
}) => {
  const { addAccount } = useAccountStore();
  const { currentTargetSite } = useGameConfigStore();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [fromSite, setFromSite] = useState(currentTargetSite);
  const [fromSites, setFromSites] = useState(fromRikSites);
  const navigate = useNavigate();

  const handleAddAccountToSupabase = async () => {
    const licenseKey = localStorage.getItem('license-key');
    if (!licenseKey) {
      navigate('/');
    }
    if (usernameRef.current && passwordRef.current && licenseKey) {
      const { data, error } = await supabase.from('accounts').insert([
        {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
          target_site: currentTargetSite,
          from_site: fromSite,
          account_type: accountType,
          license_key: licenseKey,
        },
      ]);

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        setDialogAddAccountOpen(false);
      }
    } else {
      console.log('Required fields are missing');
    }
  };

  const handleAddAccount = () => {
    if (usernameRef.current && passwordRef.current) {
      const newAccount = {
        username: usernameRef.current.value.trim(),
        password: passwordRef.current.value.trim(),
        targetSite: currentTargetSite,
        fromSite: fromSite,
      };
      addAccount(accountType, generateAccount(newAccount), currentTargetSite);
      setDialogAddAccountOpen(false);
      if (accountType == 'MAIN') {
        handleAddAccountToSupabase();
      }
    }
  };

  const handleFromSiteChange = (target: number) => {
    setFromSite(target);
  };

  useEffect(() => {
    currentTargetSite === 'RIK'
      ? setFromSites(fromRikSites)
      : currentTargetSite === 'HIT'
      ? setFromSites(fromHitSites)
      : setFromSites(fromSunWinSites);
    setFromSite(currentTargetSite);
  }, [currentTargetSite]);
  return (
    <Dialog
      open={isDialogAddAccountOpen}
      onOpenChange={setDialogAddAccountOpen}
    >
      <DialogContent>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogDescription>
          Enter the details of the new account.
        </DialogDescription>
        <Input ref={usernameRef} placeholder="Username" className="mb-4" />
        <Input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="mb-4"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex p-[10px] rounded-sm border">
              <Label className="flex flex-row gap-2">
                <GlobeLock className="w-3.5 h-3.5" />
                Site:{' '}
                <span
                  className={`${
                    fromSite === 'RIK'
                      ? 'text-purple-500'
                      : fromSite === 'HIT' && 'text-yellow-500'
                  }`}
                >
                  {fromSite}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Label>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="z-[1000] w-full min-w-[450px]"
          >
            <DropdownMenuLabel>Target Site</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {fromSites.map((fromSite: any) => (
              <DropdownMenuCheckboxItem
                key={fromSite}
                checked={fromSite}
                onSelect={() => handleFromSiteChange(fromSite)}
              >
                {fromSite}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            className=" py-0"
            onClick={() => setDialogAddAccountOpen(false)}
          >
            Cancel
          </Button>
          <Button className=" py-0" onClick={handleAddAccount}>
            Add Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccount;
