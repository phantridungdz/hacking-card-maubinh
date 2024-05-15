import { Paperclip, Plus, RefreshCcw, Trash } from 'lucide-react';
import React, { useRef } from 'react';
import { checkBalance } from '../../lib/account';
import useAccountStore from '../../store/accountStore';
import { useToast } from '../toast/use-toast';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Tooltip, TooltipTrigger } from '../ui/tooltip';

const AddAccount: React.FC<any> = ({
  isDialogAddAccountOpen,
  setDialogAddAccountOpen,
  table,
  accountType,
}) => {
  const { accounts, removeAccount } = useAccountStore();
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
      checkBalance(account, accountType)
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

  return (
    <div className="flex flex-row justify-end items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
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
    </div>
  );
};

export default AddAccount;
