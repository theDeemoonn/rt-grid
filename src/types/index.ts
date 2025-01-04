import {  Table, RowData, Column } from '@tanstack/table-core';

// Базовые типы, которые действительно нужны
export type ColumnType = 'string' | 'number' | 'boolean' | 'date';

// Расширяем базовые типы TanStack Table
declare module '@tanstack/table-core' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        type?: ColumnType;
    }
}

// Хранилище данных таблицы
export interface TableStore<T extends RowData> {
    Data: T[];
    IsLoading: boolean;
    Filters: Partial<Record<keyof T, string>>;
    SortColumns: Array<{ columnKey: keyof T; direction: 'ASC' | 'DESC' }>;
    FilteredData: T[];
    SortedFilteredData: T[];
}

// Значения фильтров
export interface FilterValue {
    min?: number;
    max?: number;
    from?: string;
    to?: string;
    value?: string;
    values?: string[];
}

// Только необходимые пропсы компонентов
export interface TableToolbarProps<T extends RowData> {
    table: Table<T>;
    onExport: () => void;
    onSettings: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export interface ColumnHeaderProps<T extends RowData> {
    header: Column<T, unknown>;
    onSort: () => void;
    onFilter: (value: FilterValue) => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

export interface FilterPanelProps<T extends RowData> {
    column: Column<T, unknown>;
    onFilterChange: (value: FilterValue) => void;
}

export interface SettingsPanelProps<T extends RowData> {
    table: Table<T>;
    onReset: () => void;
}



declare module '@tanstack/react-virtual' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface VirtualizerInstance<TScrollElement extends Element, TItemElement extends Element> {
        scrollElement: TScrollElement | null;
    }
}