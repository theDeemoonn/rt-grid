import { useMemo } from 'react';
import {
    ColumnDef,
    RowData,
    FilterFn,
    Row
} from '@tanstack/react-table';
import { ColumnType } from "../types";
import { formatValue } from "../utils/tableUtils.ts";

function getColumnType(value: unknown): ColumnType {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'date';
    return 'string';
}



function getColumnFilter<TData extends RowData>(type: ColumnType): FilterFn<TData> {
    return (row: Row<TData>, columnId: string, filterValue: any) => {
        const value = row.getValue(columnId);
        if (!filterValue) return true;

        switch (type) {
            case 'number': {
                const numValue = Number(value);
                const { min, max } = filterValue as { min?: number; max?: number };
                return (min === undefined || numValue >= min) &&
                    (max === undefined || numValue <= max);
            }
            case 'date': {
                const dateValue = value instanceof Date ? value : new Date(value as string | number);
                const { from, to } = filterValue as { from?: string; to?: string };
                return (from === undefined || dateValue >= new Date(from)) &&
                    (to === undefined || dateValue <= new Date(to));
            }
            case 'boolean': {
                return value === filterValue;
            }
            default: {
                const strValue = String(value).toLowerCase();
                const searchValue = String(filterValue).toLowerCase();
                return strValue.includes(searchValue);
            }
        }
    };
}

export function useTableColumns<TData extends RowData>(
    data: TData[],
    customColumns?: ColumnDef<TData>[]
): ColumnDef<TData>[] {
    return useMemo(() => {
        if (customColumns) {
            return customColumns;
        }

        if (!data.length) return [];

        const sample = data[0] as Record<string, unknown>;
        return Object.entries(sample).map(([key, value]) => {
            const type = getColumnType(value);

            return {
                id: key,
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
                cell: info => formatValue(info.getValue(), type),
                meta: { type },
                sortingFn: (rowA, rowB) => {
                    const a = rowA.getValue(key) as string;
                    const b = rowB.getValue(key) as string;
                    return a < b ? -1 : a > b ? 1 : 0;
                },
                filterFn: getColumnFilter<TData>(type),
                enableSorting: true,
                enableFiltering: true
            } as ColumnDef<TData>;
        });
    }, [data, customColumns]);
}