import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { generateAccount } from '../../lib/account';
import { accountType } from '../../lib/config';
import useAccountStore from '../../store/accountStore';
import { useToast } from '../toast/use-toast';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const CreateAccount: React.FC<any> = ({
  isOpenCreateAccount,
  setIsOpenCreateAccount,
}) => {
  const { addAccount } = useAccountStore();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState('');
  const [accountTypeS, setAccountTypeS] = useState('BOT');
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const inGameNameRef = useRef<HTMLInputElement>(null);
  const generateRandomFg = () => {
    return Math.random().toString(36).substring(2, 18);
  };
  const handleAddAccount = async () => {
    if (usernameRef.current && passwordRef.current && inGameNameRef.current) {
      const newAccount = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        fullname: inGameNameRef.current.value,
      };
      const payload = {
        aff_id: 'hit',
        app_id: 'rik.vip',
        avatar: 'Avatar35',
        browser: 'chrome',
        device: 'Computer',
        fg: generateRandomFg(),
        fullname: newAccount.fullname,
        os: 'Windows',
        password: newAccount.password,
        username: newAccount.username,
      };

      try {
        const response = await axios.post(
          'https://bordergw.api-inovated.com/user/register.aspx',
          payload
        );
        if (response.data.code === 200) {
          addAccount(accountTypeS, generateAccount(newAccount));

          const inGameNamePayload = {
            fullname: newAccount.fullname,
          };
          const updateDisplayName = await axios.post(
            'https://bordergw.api-inovated.com/user/update.aspx',
            inGameNamePayload,
            {
              headers: {
                'X-Token': response.data.data[0].session_id,
              },
            }
          );
          if (updateDisplayName.data.code === 200) {
            toast({
              title: 'Create account',
              description: response.data.message,
            });
          } else {
            toast({
              title: 'Error register',
              description: response.data.message,
            });
            setErrorMessage(response.data.message);
          }
          setIsOpenCreateAccount(false);
        } else {
          toast({
            title: 'Error register',
            description: response.data.message,
          });
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        console.error('Error creating account:', error);
      }
    } else {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin !');
    }
  };

  return (
    <Dialog open={isOpenCreateAccount} onOpenChange={setIsOpenCreateAccount}>
      <DialogContent>
        <DialogTitle>Create Account</DialogTitle>
        <DialogDescription className={`${errorMessage && 'text-red-400'}`}>
          {errorMessage
            ? errorMessage
            : 'Enter the details of the new account.'}
        </DialogDescription>
        <div className="grid grid-cols-4 gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="border">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 !border-[#fff]"
              >
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {accountTypeS}
                </span>

                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="z-[1000]">
              <DropdownMenuLabel>Account Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {accountType.map((aType: any) => (
                <DropdownMenuCheckboxItem
                  key={aType}
                  // checked={accountTypeS}
                  onSelect={() => setAccountTypeS(aType)}
                >
                  {aType}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            ref={inGameNameRef}
            placeholder="In-Game name"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 items-center">
          <Label className="text-center">Username</Label>
          <Input
            ref={usernameRef}
            placeholder="Username"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 items-center">
          <Label className="text-center">Password</Label>
          <Input
            ref={passwordRef}
            placeholder="Password"
            className="col-span-3"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setIsOpenCreateAccount(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddAccount}>Create Account</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccount;
