import React, { useRef, useState } from 'react';
import useAccountStore from 'store/accountStore';
import { useToast } from '../toast/use-toast';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

const Token: React.FC<any> = ({
  isDialogTokenOpen,
  setDialogTokenOpen,
  rowSelected,
  accountType,
}) => {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');
  const codeRef = useRef<HTMLInputElement>(null);
  const { updateAccount } = useAccountStore();

  const onUpdate = async () => {
    updateAccount(accountType, rowSelected.username, {
      main_balance: 'Đăng nhập thành công',
      token: token,
      fullname: rowSelected.fullname,
    });
    setDialogTokenOpen(false);
  };

  return (
    <Dialog open={isDialogTokenOpen} onOpenChange={setDialogTokenOpen}>
      <DialogContent>
        <DialogTitle>{`Token for: ${rowSelected?.username}`}</DialogTitle>
        <DialogDescription className={`${errorMessage && 'text-red-400'}`}>
          {errorMessage ? errorMessage : 'Nhập token và nhấn Update !'}
        </DialogDescription>
        <div className="grid grid-cols-4 gap-2">
          <Input
            ref={codeRef}
            placeholder="Type account token"
            className="col-span-3"
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            size={'sm'}
            onClick={() => setDialogTokenOpen(false)}
          >
            Cancel
          </Button>
          <Button size={'sm'} onClick={() => onUpdate()}>
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Token;
