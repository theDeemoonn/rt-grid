import { Row, RowData } from '@tanstack/react-table';
import './TableRow.css';
import React from "react";
import { TableCell } from "./TableCell.tsx";

interface TableRowProps<TData extends RowData> {
    row: Row<TData>;
    virtualRow: {
        size: number;
        start: number;
    };
}

export function TableRow<TData extends RowData>({
                                                    row,
                                                    virtualRow,
                                                }: TableRowProps<TData>): React.ReactElement {
    return (
        <tr
            className={`
                table-row
                ${row.getIsGrouped() ? 'grouped-row' : ''}
                ${row.getIsExpanded() ? 'expanded-row' : ''}
            `}
            style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
            }}
        >
            {row.getVisibleCells().map(cell => (
                <TableCell<TData>
                    key={cell.id}
                    cell={cell}
                    row={row}
                />
            ))}
        </tr>
    );
}