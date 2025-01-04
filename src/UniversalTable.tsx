import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getGroupedRowModel,
    ColumnDef,
    RowData,
    Table,
    SortingState,
    ColumnFiltersState,
    ColumnPinningState,
    VisibilityState,
    HeaderGroup,
    TableOptions
} from '@tanstack/react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TableBody from "./components/TableBody/TableBody.tsx";
import { useTableVirtualization } from "./hooks/useVirtualScroll.ts";

import { TableStore } from './types';
import { ColumnHeader } from './components/ColumnHeader/ColumnHeader.tsx';
import { GroupPanel } from './components/GroupPanel/GroupPanel.tsx';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay.tsx';
import { NoData } from './components/Status/NoData.tsx';
import { TableToolbar } from './components/Toolbar/TableToolbar.tsx';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel.tsx';

import './UniversalTable.css';

interface UniversalTableProps<TData extends RowData> {
    store: TableStore<TData>;
    columns: ColumnDef<TData, unknown>[];
    enableSorting?: boolean;
    enableFilters?: boolean;
    enableGrouping?: boolean;
    enablePinning?: boolean;
    enableToolbar?: boolean;
    enableSettings?: boolean;
    estimateRowHeight?: number;
    initialState?: {
        sorting?: SortingState;
        grouping?: string[];
        columnPinning?: ColumnPinningState;
        columnVisibility?: VisibilityState;
        columnFilters?: ColumnFiltersState;
    };
    onStateChange?: (table: Table<TData>) => void;
}

export function UniversalTable<TData extends RowData>({
                                                          store,
                                                          columns,
                                                          enableSorting = true,
                                                          enableFilters = true,
                                                          enableGrouping = true,
                                                          enablePinning = true,
                                                          enableToolbar = true,
                                                          enableSettings = true,
                                                          estimateRowHeight = 48,
                                                          initialState,
                                                          onStateChange
                                                      }: UniversalTableProps<TData>): React.ReactElement {
    const tableOptions: TableOptions<TData> = {
        data: store.Data,
        columns,
        state: initialState,
        enableSorting,
        enableFilters,
        enableGrouping,
        enableColumnPinning: enablePinning,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
    };

    const table = useReactTable<TData>(tableOptions);

    React.useEffect(() => {
        if (onStateChange) {
            onStateChange(table);
        }
    }, [table.getState(), onStateChange, table]);

    const { parentRef, rowVirtualizer } = useTableVirtualization<TData>(table, {
        rowHeight: estimateRowHeight,
        overscan: 5
    });

    // Отображение загрузки
    if (store.IsLoading) {
        return <LoadingOverlay />;
    }

    // Отображение пустого состояния
    if (!store.Data.length) {
        return <NoData />;
    }

    const handleExport = () => {
        // Реализация экспорта
        console.log('Export');
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="universal-table">
                {enableToolbar && (
                    <TableToolbar<TData>
                        table={table}
                        onSettings={() => table.resetColumnVisibility()}
                        onRefresh={() => table.resetRowSelection()}
                        onExport={handleExport}
                        isRefreshing={store.IsLoading}
                    />
                )}

                {enableGrouping && table.getState().grouping.length > 0 && (
                    <GroupPanel<TData>
                        columns={table.getAllColumns()}
                        grouping={table.getState().grouping}
                        onRemoveGroup={(groupId: string) =>
                            table.setGrouping(prev => prev.filter(id => id !== groupId))
                        }
                    />
                )}

                <div
                    ref={parentRef}
                    className="table-container"
                >
                    <table>
                        <thead>
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <ColumnHeader
                                        key={header.id}
                                        header={header}
                                        onSort={() => header.column.toggleSorting()}
                                        onFilter={value => header.column.setFilterValue(value)}
                                        onContextMenu={(e: React.MouseEvent) => {
                                            e.preventDefault();
                                            // Здесь можно добавить обработку контекстного меню
                                        }}
                                        showFilter={enableFilters}
                                    />
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <TableBody
                            table={table}
                            rowVirtualizer={rowVirtualizer}
                        />
                    </table>
                </div>

                {enableSettings && (
                    <SettingsPanel
                        table={table}
                        onReset={() => table.resetColumnVisibility()}
                    />
                )}
            </div>
        </DndProvider>
    );
}