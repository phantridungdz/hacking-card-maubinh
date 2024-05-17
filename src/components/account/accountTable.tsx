import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
import * as React from 'react';

import { useEffect, useState } from 'react';
import {
  checkBalance,
  generateAccount,
  readValidAccount,
} from '../../lib/account';
import { readFile, updateFile } from '../../lib/file';
import { login } from '../../service/login';
import useAccountStore from '../../store/accountStore';
import AddAccount from '../model/addAccount';
import AddProxy from '../model/addProxy';
import Deposit from '../model/deposit';
import { useToast } from '../toast/use-toast';
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
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import AccountMenu from './accountMenu';

export const AccountTable: React.FC<any> = ({ accountType }) => {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [dataTable, setDataTable] = useState<any>([]);
  const [isDialogAddAccountOpen, setDialogAddAccountOpen] = useState(false);
  const [isDialogDepositOpen, setDialogDepositOpen] = useState(false);
  const [isDialogProxyOpen, setDialogProxyOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState<any>();

  const [readedFile, setReadedFile] = useState(false);

  const { accounts, updateAccount, addAccount, removeAccount } =
    useAccountStore();

  useEffect(() => {
    const handleReadFile = (data: any, accountTypeReceived: any) => {
      if (accountTypeReceived == accountType) {
        const newAccounts = readValidAccount(data);
        if (newAccounts.length > 0) {
          newAccounts.map(async (account: any) => {
            if (account?.username) {
              try {
                addAccount(accountType, generateAccount(account));
              } catch (err) {
                console.error('Setup bot failed:', err);
              }
            }
          });
        }
      }
    };
    window.backend.on('read-file', handleReadFile);

    return () => {
      window.backend.removeListener('read-file', handleReadFile);
    };
  }, []);

  useEffect(() => {
    if (!readedFile) {
      readFile(accountType);
      setReadedFile(true);
    }
  }, []);

  useEffect(() => {
    if (accounts[accountType] && readedFile) {
      setDataTable(accounts[accountType]);
      updateFile(accounts[accountType], accountType);
    }
  }, [accounts]);

  const handleDeleteRow = (rowData: any) => {
    removeAccount(accountType, rowData.username);
  };

  const removeProxy = (rowData: any) => {
    updateAccount(accountType, rowData.username, {
      proxy: '',
      passProxy: '',
    });
  };

  const onCheckAll = async (value: any) => {
    const selectedAccounts = accounts[accountType];

    const checkBalances = selectedAccounts.map((account: any) => {
      updateAccount(accountType, account.username, {
        isSelected: value,
      });
      if (value) {
        checkBalance(account, accountType, updateAccount);
      }
    });

    try {
      await Promise.all(checkBalances);
      toast({
        title: 'Updated',
        description: `Table was update`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to this action`,
      });
    }
  };
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
            onCheckAll(value);
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
              const data = (await login(row.original)) as any;
              const cash = Array.isArray(data?.data)
                ? data?.data[0].main_balance
                : 0;
              mainBalance = cash;
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
            {row.getValue('main_balance')}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => checkBalance(rowData, accountType, updateAccount)}
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </Button>
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
                  checkBalance(rowData, accountType, updateAccount)
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
  const cashIndex = columns.findIndex(
    (col: any) => col.accessorKey === 'main_balance'
  );
  if (accountType === 'MAIN') {
    columns.splice(cashIndex + 1, 0, {
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
        return <div className="text-center">{row.getValue('proxy')}</div>;
      },
    });
  }

  const table = useReactTable({
    data: dataTable,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter username..."
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event: { target: { value: any } }) =>
            table.getColumn('username')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AccountMenu
          isDialogAddAccountOpen={isDialogAddAccountOpen}
          setDialogAddAccountOpen={setDialogAddAccountOpen}
          table={table}
          accountType={accountType}
          updateAccount={updateAccount}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="px-0"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center px-0" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
      <AddProxy
        isDialogProxyOpen={isDialogProxyOpen}
        setDialogProxyOpen={setDialogProxyOpen}
        rowSelected={rowSelected}
        accountType={accountType}
      />
      <AddAccount
        isDialogAddAccountOpen={isDialogAddAccountOpen}
        setDialogAddAccountOpen={setDialogAddAccountOpen}
        accountType={accountType}
      />
      <Deposit
        isDialogDepositOpen={isDialogDepositOpen}
        setDialogDepositOpen={setDialogDepositOpen}
        rowSelected={rowSelected}
      />
    </div>
  );
};
