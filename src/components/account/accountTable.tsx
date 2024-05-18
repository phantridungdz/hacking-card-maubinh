import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { useEffect, useState } from 'react';
import { generateAccount, readValidAccount } from '../../lib/account';
import { readFile, updateFile } from '../../lib/file';
import { checkBalance } from '../../service/balance';
import useAccountStore from '../../store/accountStore';
import AddAccount from '../model/addAccount';
import AddProxy from '../model/addProxy';
import Deposit from '../model/deposit';
import { useToast } from '../toast/use-toast';
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
import { getAccountTableColumns } from './columnsTable';
import AccountTableRow from './rowTable';

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
  const columns = getAccountTableColumns(
    accountType,
    handleDeleteRow,
    checkBalance,
    updateAccount,
    removeProxy,
    setDialogDepositOpen,
    setDialogProxyOpen,
    setRowSelected,
    accounts,
    toast
  );

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
              table
                .getRowModel()
                .rows.map((row) => (
                  <AccountTableRow
                    key={row.id}
                    row={row}
                    handleDeleteRow={handleDeleteRow}
                    checkBalance={checkBalance}
                    accountType={accountType}
                    updateAccount={updateAccount}
                    removeProxy={removeProxy}
                    setDialogDepositOpen={setDialogDepositOpen}
                    setDialogProxyOpen={setDialogProxyOpen}
                    setRowSelected={setRowSelected}
                  />
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
          {table.getFilteredRowModel().rows.length} row(s) accounts.
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
        accountType={accountType}
      />
    </div>
  );
};
