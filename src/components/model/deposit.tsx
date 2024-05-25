import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { cardAmounts, homeNets } from '../../lib/config';
import { login } from '../../service/login';
import useAccountStore from '../../store/accountStore';
import useGameConfigStore from '../../store/gameConfigStore';
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

const Deposit: React.FC<any> = ({
  isDialogDepositOpen,
  setDialogDepositOpen,
  rowSelected,
  accountType,
}) => {
  const { toast } = useToast();
  const { updateAccount } = useAccountStore();
  const { loginUrl, trackingIPUrl, depositUrl } = useGameConfigStore();
  const [errorMessage, setErrorMessage] = useState('');
  const [homeNet, setHomeNet] = useState('VINAPHONE');
  const [cardAmount, setCardAmount] = useState(20000);
  const codeRef = useRef<HTMLInputElement>(null);
  const seriRef = useRef<HTMLInputElement>(null);

  const handleAddAccount = async () => {
    if (codeRef.current && seriRef.current) {
      const cardPayload = {
        browser: 'chrome',
        card_amount: cardAmount,
        card_code: codeRef.current.value,
        card_serial: seriRef.current.value,
        card_provider: homeNet,
        device: 'Computer',
        os: 'Windows',
      };

      try {
        const loginData = await login(rowSelected, accountType, updateAccount);
        if (loginData && loginData.code === 200) {
          const response = await axios.post(depositUrl, cardPayload, {
            headers: {
              'X-Token': loginData.data[0].session_id,
            },
          });
          if (response.data.code === 200) {
            toast({
              title: 'Đã gửi lệnh',
              description: response.data.msg,
            });
            setDialogDepositOpen(false);
          } else {
            toast({
              title: 'Error register',
              description: response.data.msg,
            });
            setErrorMessage(response.data.msg);
          }
        }
      } catch (error) {
        console.error('Error creating account:', error);
      }
    }
  };

  return (
    <Dialog open={isDialogDepositOpen} onOpenChange={setDialogDepositOpen}>
      <DialogContent>
        <DialogTitle>
          {rowSelected && `Nạp thẻ: ${rowSelected?.username}`}
        </DialogTitle>
        <DialogDescription className={`${errorMessage && 'text-red-400'}`}>
          {errorMessage ? errorMessage : 'Chọn sai mệnh giá sẽ bị mất thẻ !'}
        </DialogDescription>
        <div className="grid grid-cols-4 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="border">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 !border-[#fff]"
              >
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {homeNet}
                </span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="z-[1000]">
              <DropdownMenuLabel>Home Net</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {homeNets.map((aType: any) => (
                <DropdownMenuCheckboxItem
                  key={aType}
                  // checked={accountTypeS}
                  onSelect={() => setHomeNet(aType)}
                >
                  {aType}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input ref={codeRef} placeholder="Mã thẻ" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="border">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 !border-[#fff]"
              >
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {cardAmount}
                </span>

                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="z-[1000]">
              <DropdownMenuLabel>Money Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {cardAmounts.map((aType: any) => (
                <DropdownMenuCheckboxItem
                  key={aType}
                  // checked={accountTypeS}
                  onSelect={() => setCardAmount(aType)}
                >
                  {aType}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Input ref={seriRef} placeholder="Seri" className="col-span-3" />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setDialogDepositOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddAccount}>Nạp ngay</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Deposit;
