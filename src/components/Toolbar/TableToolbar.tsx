import React from "react";
import { Table, RowData } from "@tanstack/react-table";

interface TableToolbarProps<TData extends RowData> {
    table: Table<TData>;
    onExport: () => void;
    onSettings: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export function TableToolbar<TData extends RowData>({
                                                        table,
                                                        onExport,
                                                        onSettings,
                                                        onRefresh,
                                                        isRefreshing = false
                                                    }: TableToolbarProps<TData>): React.ReactElement {
    const totalRows = table.getRowModel().rows.length;
    const selectedRows = table.getSelectedRowModel().rows.length;

    return (
        <div
            className="table-toolbar"
            role="toolbar"
            aria-label="Панель инструментов таблицы"
        >
            <div className="toolbar-group">
                <button
                    className="toolbar-button"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    aria-label="Обновить данные"
                >
                    <span
                        className={`button-icon ${isRefreshing ? 'spinning' : ''}`}
                        aria-hidden="true"
                    >
                        🔄
                    </span>
                    {isRefreshing ? 'Обновление...' : 'Обновить'}
                </button>
                <span className="toolbar-info">
                    Всего записей: {totalRows}
                    {selectedRows > 0 && ` (выбрано: ${selectedRows})`}
                </span>
            </div>

            <div className="toolbar-group">
                <button
                    className="toolbar-button"
                    onClick={onExport}
                    aria-label="Экспорт данных"
                >
                    <span className="button-icon" aria-hidden="true">📥</span>
                    Экспорт
                </button>
                <button
                    className="toolbar-button"
                    onClick={onSettings}
                    aria-label="Настройки таблицы"
                >
                    <span className="button-icon" aria-hidden="true">⚙️</span>
                    Настройки
                </button>
            </div>
        </div>
    );
}