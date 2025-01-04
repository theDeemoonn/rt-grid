import { Table, Row, RowData } from '@tanstack/react-table';
import { Virtualizer } from '@tanstack/react-virtual';
import './TableBody.css';
import { TableRow } from "./TableRow.tsx";

interface TableBodyProps<TData extends RowData> {
    table: Table<TData>;
    rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
}

function TableBody<TData extends RowData>({
                                                     table,
                                                     rowVirtualizer
                                                 }: TableBodyProps<TData>) {
    const rows = table.getRowModel().rows;

    return (
        <tbody>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<TData>;
            if (!row) return null;

            return (
                <TableRow<TData>
                    key={row.id}
                    row={row}
                    virtualRow={{
                        size: virtualRow.size,
                        start: virtualRow.start
                    }}
                />
            );
        })}
        <tr>
            <td style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
        </tr>
        </tbody>
    );
}

export default TableBody;