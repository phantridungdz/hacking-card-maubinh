import { Paperclip, Plus, RefreshCcw, Trash } from 'lucide-react';
import React, { useRef } from 'react';
import { addUniqueAccounts, readValidAccount } from '../../lib/account';
import { checkBalance } from '../../service/balance';
import useAccountStore from '../../store/accountStore';
import { useToast } from '../toast/use-toast';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Tooltip, TooltipTrigger } from '../ui/tooltip';

const AccountMenu: React.FC<any> = ({
  isDialogAddAccountOpen,
  setDialogAddAccountOpen,
  table,
  accountType,
  updateAccount,
}) => {
  const { accounts, removeAccount, addAccount } = useAccountStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteSelectedRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row: any) => {
      removeAccount(accountType, row.original.username);
    });
    toast({
      title: 'Deleted accounts',
      description: `${selectedRows.length} account(s) deleted.`,
    });
  };
  const refreshAccount = async () => {
    const selectedAccounts = accounts[accountType].filter(
      (account: any) => account.isSelected
    );

    if (!selectedAccounts.length) {
      toast({
        title: 'No Selected Accounts',
        description: 'No selected accounts available to refresh.',
      });
      return;
    }

    const checkBalances = selectedAccounts.map((account: any) =>
      checkBalance(account, accountType, updateAccount)
    );

    try {
      await Promise.all(checkBalances);
      toast({
        title: 'Refreshed',
        description: `Selected accounts refreshed and balances updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to refresh some accounts`,
      });
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const text = e.target.result;
      const newAccounts = readValidAccount(text);
      addUniqueAccounts(newAccounts, accounts, accountType, addAccount);
    };
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: `Failed to read file`,
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-row justify-end items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            <Paperclip className="size-4" />
          </Button>
        </TooltipTrigger>
        <Dialog
          open={isDialogAddAccountOpen}
          onOpenChange={setDialogAddAccountOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setDialogAddAccountOpen(true)}
            >
              <Plus className="size-4" />
              <span className="sr-only">Add account</span>
            </Button>
          </DialogTrigger>
        </Dialog>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={handleDeleteSelectedRows}
          >
            <Trash className="w-3.5 h-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={refreshAccount}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </Button>
        </TooltipTrigger>
      </Tooltip>
      <div className="flex items-center p-3 pt-0">
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default AccountMenu;
