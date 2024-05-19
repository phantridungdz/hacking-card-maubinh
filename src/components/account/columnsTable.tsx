// components/columns/AccountTableColumns.ts

import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  Check,
  DollarSign,
  MoreHorizontal,
  Plug,
  RefreshCcw,
  RemoveFormatting,
  Trash,
} from 'lucide-react';
import useGetFgOfGame from '../../hooks/useGetFgOfGame';
import { checkBalance } from '../../service/balance';
import useGameConfigStore from '../../store/gameConfigStore';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Switch } from '../ui/switch';

export const getAccountTableColumns = (
  accountType: string,
  handleDeleteRow: any,
  updateAccount: any,
  removeProxy: any,
  setDialogDepositOpen: any,
  setDialogProxyOpen: any,
  setRowSelected: any,
  accounts: any[],
  toast: any,
  onCheckAll: any
): ColumnDef<unknown, any>[] => {
  const { checkBalanceUrl, loginUrl, trackingIPUrl } = useGameConfigStore();
  const { getFg } = useGetFgOfGame();

  const columns: ColumnDef<unknown, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="bg-white"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            onCheckAll(value, accounts, accountType, updateAccount, toast);
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          className="!border-[#fff] !border"
          style={{ background: '#fff' }}
          checked={row?.original.isSelected || row.getIsSelected()}
          onCheckedChange={async (value) => {
            row.toggleSelected(!!value);
            var mainBalance = row.original.main_balance;
            if (value) {
              checkBalance(
                row.original,
                accountType,
                updateAccount,
                checkBalanceUrl,
                loginUrl,
                trackingIPUrl
              );
            }

            updateAccount(accountType, row?.original.username, {
              isSelected: value,
              main_balance: mainBalance,
            });
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('username')}</div>
      ),
    },
    {
      accessorKey: 'password',
      header: () => <div className="text-center">Password</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium px-0">
            {row.getValue('password')}
          </div>
        );
      },
    },
    {
      accessorKey: 'main_balance',
      header: ({ column }) => {
        return (
          <Button
            type="button"
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <DollarSign className="h-4 w-4" />
            Cash
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <div className="lowercase flex flex-row justify-center items-center">
            {row.getValue('main_balance') ===
            'Tài khoản bị khoá vì hành vi lừa đảo, trục lợi cá nhân.'
              ? 'Đã bị khóa'
              : row.getValue('main_balance')}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                checkBalance(
                  rowData,
                  accountType,
                  updateAccount,
                  checkBalanceUrl,
                  loginUrl,
                  trackingIPUrl
                );
              }}
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
    {
      id: 'proxy',
      enableHiding: false,
      accessorKey: 'proxy',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 truncate"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Proxy
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rowData = row.original as any;
        return (
          <div className="text-center grid grid-cols-2">
            {row.getValue('proxy')}
            <Switch
              checked={rowData.isUseProxy}
              onCheckedChange={(e) => {
                console.log('value', e);
                if (rowData && rowData?.username) {
                  updateAccount(accountType, rowData.username, {
                    isUseProxy: e,
                  });
                }
              }}
            />
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[1000]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex flex-row items-center gap-1"
                onClick={() => handleDeleteRow(rowData)}
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
                Delete account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex flex-row items-center gap-1"
                onClick={() =>
                  checkBalance(
                    rowData,
                    accountType,
                    updateAccount,
                    checkBalanceUrl,
                    loginUrl,
                    trackingIPUrl
                  )
                }
              >
                <Check className="w-3.5 h-3.5" />
                Check balance
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => removeProxy(rowData)}
                className="flex flex-row items-center gap-1"
              >
                <Trash className="w-3.5 h-3.5" />
                Remove Proxy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDialogDepositOpen(true);
                  setRowSelected(rowData);
                }}
                className="flex flex-row items-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5" />
                Deposit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex flex-row items-center gap-1"
                onClick={() => {
                  setDialogProxyOpen(true);
                  setRowSelected(rowData);
                }}
              >
                <Plug className="w-3.5 h-3.5" />
                Set proxy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
