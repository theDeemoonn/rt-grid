import { Cell, Row, flexRender, RowData } from "@tanstack/react-table";

interface TableCellProps<TData extends RowData> {
    cell: Cell<TData, unknown>;
    row: Row<TData>;
}

export function TableCell<TData extends RowData>({
                                                     cell,
                                                     row
                                                 }: TableCellProps<TData>): React.ReactElement {
    if (cell.getIsGrouped()) {
        return (
            <td
                colSpan={cell.column.getSize()}
                className="grouped-cell"
                onClick={row.getToggleExpandedHandler()}
                role="gridcell"
                aria-expanded={row.getIsExpanded()}
            >
                <span aria-hidden="true">
                    {row.getIsExpanded() ? '👇' : '👉'}{' '}
                </span>
                {cell.column.columnDef.header?.toString()}: {cell.getValue() as string}{' '}
                ({row.subRows.length})
            </td>
        );
    }

    if (cell.getIsAggregated()) {
        return (
            <td
                className="aggregated-cell"
                role="gridcell"
            >
                {cell.getValue() as string} (всего)
            </td>
        );
    }

    return (
        <td
            className="table-cell"
            style={{ width: `${cell.column.getSize()}px` }}
            role="gridcell"
        >
            {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
            )}
        </td>
    );
}