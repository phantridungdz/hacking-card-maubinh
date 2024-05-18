import { flexRender } from '@tanstack/react-table';
import React from 'react';
import { TableCell, TableRow } from '../ui/table';

const AccountTableRow: React.FC<any> = ({ row }) => {
  const rowData = row.original;

  return (
    <TableRow
      className="px-0"
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell className="text-center px-0" key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default AccountTableRow;
