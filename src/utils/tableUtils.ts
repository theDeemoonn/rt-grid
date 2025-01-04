import {
    ColumnDef,
    RowData,
    SortingFn,
    FilterFn,
    Row,
    Table,
    VisibilityState,
    ColumnPinningState
} from '@tanstack/react-table';
import { ColumnType } from "../types";

// Определение типа значения ячейки
export function detectColumnType(value: unknown): ColumnType {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'date';
    return 'string';
}

// Форматирование значений для отображения
export function formatValue(value: unknown, type?: ColumnType): string {
    if (value == null) return '';

    switch (type) {
        case 'date':
            return value instanceof Date ?
                value.toLocaleDateString() :
                new Date(value as string | number).toLocaleDateString();
        case 'boolean':
            return value ? 'Да' : 'Нет';
        case 'number':
            return typeof value === 'number' ?
                value.toLocaleString() :
                Number(value).toLocaleString();
        default:
            return String(value);
    }
}

// Создание базовых колонок из данных
export function createDefaultColumns<TData extends RowData>(
    data: TData[]
): ColumnDef<TData, unknown>[] {
    if (!data.length) return [];

    const sample = data[0] as Record<string, unknown>;
    return Object.entries(sample).map(([key, value]) => {
        const type = detectColumnType(value);

        return {
            id: key,
            accessorKey: key as keyof TData,
            header: key.charAt(0).toUpperCase() + key.slice(1),
            cell: info => formatValue(info.getValue(), type),
            meta: { type },
        };
    });
}

// Функции сортировки для разных типов данных
export const createSortingFn = <TData extends RowData>(
    type: ColumnType
): SortingFn<TData> => {
    return (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
        const a = rowA.getValue(columnId);
        const b = rowB.getValue(columnId);

        if (a === b) return 0;
        if (a == null) return 1;
        if (b == null) return -1;

        switch (type) {
            case 'number':
                return Number(a) - Number(b);
            case 'date':
                return new Date(a as string).getTime() - new Date(b as string).getTime();
            case 'boolean':
                return (a === b ? 0 : a ? 1 : -1);
            default:
                return String(a).localeCompare(String(b));
        }
    };
};

// Функции фильтрации для разных типов данных
export const createFilterFn = <TData extends RowData>(
    type: ColumnType
): FilterFn<TData> => {
    return (row: Row<TData>, columnId: string, filterValue: any): boolean => {
        const value = row.getValue(columnId);
        if (!filterValue) return true;

        switch (type) {
            case 'number': {
                const numValue = Number(value);
                const { min, max } = filterValue as { min?: number; max?: number };
                return (!min || numValue >= min) && (!max || numValue <= max);
            }
            case 'date': {
                const dateValue = value instanceof Date ? value : new Date(value as string);
                const { from, to } = filterValue as { from?: string; to?: string };
                return (!from || dateValue >= new Date(from)) &&
                    (!to || dateValue <= new Date(to));
            }
            case 'boolean': {
                return value === (filterValue === 'true');
            }
            default: {
                const strValue = String(value).toLowerCase();
                const searchValue = String(filterValue).toLowerCase();
                return strValue.includes(searchValue);
            }
        }
    };
};

// Утилиты для управления состоянием таблицы
export function resetTableState<TData extends RowData>(
    table: Table<TData>
): void {
    table.resetSorting();
    table.resetColumnFilters();
    table.resetColumnVisibility();
    table.resetColumnOrder();
    table.resetColumnPinning();
    table.resetRowSelection();
    table.resetExpanded();
    table.resetGrouping();
}

export function saveTableState<TData extends RowData>(
    table: Table<TData>,
    key: string
): void {
    const state = {
        sorting: table.getState().sorting,
        columnFilters: table.getState().columnFilters,
        columnVisibility: table.getState().columnVisibility,
        columnOrder: table.getState().columnOrder,
        columnPinning: table.getState().columnPinning,
        grouping: table.getState().grouping
    };
    localStorage.setItem(key, JSON.stringify(state));
}

export function loadTableState<TData extends RowData>(
    table: Table<TData>,
    key: string
): void {
    try {
        const savedState = localStorage.getItem(key);
        if (!savedState) return;

        const state = JSON.parse(savedState);

        if (state.sorting) table.setSorting(state.sorting);
        if (state.columnFilters) table.setColumnFilters(state.columnFilters);
        if (state.columnVisibility) table.setColumnVisibility(state.columnVisibility as VisibilityState);
        if (state.columnOrder) table.setColumnOrder(state.columnOrder);
        if (state.columnPinning) table.setColumnPinning(state.columnPinning as ColumnPinningState);
        if (state.grouping) table.setGrouping(state.grouping);
    } catch (error) {
        console.error('Error loading table state:', error);
    }
}

// Утилиты для экспорта данных
export function prepareDataForExport<TData extends RowData>(
    table: Table<TData>
): Record<string, string>[] {
    const visibleColumns = table.getAllLeafColumns().filter(col => col.getIsVisible());
    const rows = table.getRowModel().rows;

    return rows.map(row => {
        const exportRow: Record<string, string> = {};
        visibleColumns.forEach(column => {
            const header = column.columnDef.header;
            const value = row.getValue(column.id);
            const type = column.columnDef.meta?.type as ColumnType;
            exportRow[header as string] = formatValue(value, type);
        });
        return exportRow;
    });
}

export function downloadCsv(data: Record<string, string>[], filename: string): void {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const cell = row[header] ?? '';
                const escaped = cell.replace(/"/g, '""');
                return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}