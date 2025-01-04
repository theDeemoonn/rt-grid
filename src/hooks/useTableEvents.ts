import { useCallback } from 'react';
import {
    Table,
    Column,
    RowData,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ColumnPinningState,
    Row
} from '@tanstack/react-table';

interface TableEventHandlers<TData extends RowData> {
    onSortingChange?: (sorting: SortingState) => void;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
    onVisibilityChange?: (visibility: VisibilityState) => void;
    onPinningChange?: (pinning: ColumnPinningState) => void;
    onRowSelectionChange?: (rows: Row<TData>[]) => void;
    onColumnReorder?: (draggedColumnId: string, targetColumnId: string) => void;
}

export function useTableEvents<TData extends RowData>(
    table: Table<TData>,
    handlers?: TableEventHandlers<TData>
) {
    const handleColumnResize = useCallback((column: Column<TData, unknown>, width: number) => {
        table.setColumnSizing(prev => ({
            ...prev,
            [column.id]: width,
        }));
    }, [table]);

    const handleColumnReorder = useCallback((draggedColumnId: string, targetColumnId: string) => {
        const currentOrder = table.getState().columnOrder;
        const draggedIndex = currentOrder.indexOf(draggedColumnId);
        const targetIndex = currentOrder.indexOf(targetColumnId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newOrder = [...currentOrder];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumnId);

        table.setColumnOrder(newOrder);
        handlers?.onColumnReorder?.(draggedColumnId, targetColumnId);
    }, [table, handlers]);

    const handleSorting = useCallback((columnId: string) => {
        const column = table.getColumn(columnId);
        if (!column?.getCanSort()) return;

        const nextSortingOrder = column.getNextSortingOrder();
        const sorting: SortingState = nextSortingOrder
            ? [{ id: columnId, desc: nextSortingOrder === 'desc' }]
            : [];

        table.setSorting(sorting);
        handlers?.onSortingChange?.(sorting);
    }, [table, handlers]);

    const handleFiltering = useCallback((columnId: string, filterValue: any) => {
        table.getColumn(columnId)?.setFilterValue(filterValue);
        handlers?.onFiltersChange?.(table.getState().columnFilters);
    }, [table, handlers]);

    const handleVisibilityChange = useCallback((columnId: string, isVisible: boolean) => {
        table.setColumnVisibility(prev => ({
            ...prev,
            [columnId]: !isVisible,
        }));
        handlers?.onVisibilityChange?.(table.getState().columnVisibility);
    }, [table, handlers]);

    const handlePinning = useCallback((columnId: string, position: 'left' | 'right' | false) => {
        const pinning = { ...table.getState().columnPinning };

        // Удаляем колонку из текущих позиций
        pinning.left = (pinning.left || []).filter(id => id !== columnId);
        pinning.right = (pinning.right || []).filter(id => id !== columnId);

        // Добавляем в новую позицию
        if (position === 'left') {
            pinning.left = [...(pinning.left || []), columnId];
        } else if (position === 'right') {
            pinning.right = [...(pinning.right || []), columnId];
        }

        table.setColumnPinning(pinning);
        handlers?.onPinningChange?.(pinning);
    }, [table, handlers]);

    const handleRowSelection = useCallback((rowSelection: Record<string, boolean>) => {
        const selectedRows = table
            .getRowModel()
            .rows.filter(row => rowSelection[row.id]);
        handlers?.onRowSelectionChange?.(selectedRows);
    }, [table, handlers]);

    return {
        handleColumnResize,
        handleColumnReorder,
        handleSorting,
        handleFiltering,
        handleVisibilityChange,
        handlePinning,
        handleRowSelection,
    };
}