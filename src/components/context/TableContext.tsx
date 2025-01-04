import { useReactTable } from "@tanstack/react-table";
import React, { createContext, useContext, useMemo } from 'react';
import {
    RowData,
    Table,
    ColumnDef,
    VisibilityState,
    ColumnPinningState,
    SortingState,
    ColumnFiltersState,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getGroupedRowModel,
} from '@tanstack/table-core';
import { TableStore } from "../../types";

interface TableContextValue<T extends RowData> {
    table: Table<T>;
    store: TableStore<T>;
}

interface TableProviderProps<T extends RowData> {
    children: React.ReactNode;
    store: TableStore<T>;
    columns?: ColumnDef<T>[];
    initialState?: {
        columnVisibility?: VisibilityState;
        columnPinning?: ColumnPinningState;
        sorting?: SortingState;
        columnFilters?: ColumnFiltersState;
        grouping?: string[];
    };
}

const TableContext = createContext<TableContextValue<any> | undefined>(undefined);

export function TableProvider<T extends RowData>({
                                                     children,
                                                     store,
                                                     columns: customColumns,
                                                     initialState
                                                 }: TableProviderProps<T>): React.ReactElement {
    // Генерация колонок по умолчанию
    const defaultColumns = useMemo(() => {
        if (!store.Data.length) return [];

        const firstRow = store.Data[0] as Record<string, unknown>;
        return Object.entries(firstRow).map(([key, value]) => {
            const type = typeof value === 'number' ? 'number' :
                typeof value === 'boolean' ? 'boolean' :
                    value instanceof Date ? 'date' : 'string';

            return {
                id: key,
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
                meta: { type }
            } as ColumnDef<T>;
        });
    }, [store.Data]);

    // Используем или пользовательские колонки, или сгенерированные по умолчанию
    const columns = useMemo(() =>
            customColumns || defaultColumns,
        [customColumns, defaultColumns]);

    const table = useReactTable({
        data: store.Data,
        columns,
        state: initialState,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
    });

    const value = useMemo(() => ({
        store,
        table
    }), [store, table]);

    return (
        <TableContext.Provider value={value}>
            {children}
        </TableContext.Provider>
    );
}

export function useTable<T extends RowData>(): TableContextValue<T> {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context as TableContextValue<T>;
}