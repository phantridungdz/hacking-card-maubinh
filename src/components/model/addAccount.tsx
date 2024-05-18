import React, { useRef } from 'react';
import { generateAccount } from '../../lib/account';
import useAccountStore from '../../store/accountStore';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

const AddAccount: React.FC<any> = ({
  isDialogAddAccountOpen,
  setDialogAddAccountOpen,
  accountType,
}) => {
  const { addAccount } = useAccountStore();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleAddAccount = () => {
    if (usernameRef.current && passwordRef.current) {
      const newAccount = {
        username: usernameRef.current.value.trim(),
        password: passwordRef.current.value.trim(),
      };
      addAccount(accountType, generateAccount(newAccount));
      setDialogAddAccountOpen(false);
    }
  };
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
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setDialogAddAccountOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddAccount}>Add Account</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccount;
