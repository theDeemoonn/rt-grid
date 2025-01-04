import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Column, RowData, Table } from '@tanstack/react-table';
import './SettingsPanel.css';

interface SettingsPanelProps<TData extends RowData> {
    table: Table<TData>;
    onReset: () => void;
    onColumnReorder?: (sourceId: string, targetId: string) => void;
}

export function SettingsPanel<TData extends RowData>({
                                                         table,
                                                         onReset,
                                                         onColumnReorder
                                                     }: SettingsPanelProps<TData>): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    const handleDragStart = (columnId: string) => {
        setDraggedColumn(columnId);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const handleDrop = (targetColumnId: string) => {
        if (draggedColumn && onColumnReorder) {
            onColumnReorder(draggedColumn, targetColumnId);
        }
        setDraggedColumn(null);
    };

    const renderColumnOption = (column: Column<TData, unknown>) => {
        const columnVisibility = table.getState().columnVisibility;

        return (
            <div
                key={column.id}
                className={`column-visibility-option ${draggedColumn === column.id ? 'dragging' : ''}`}
                draggable={!!onColumnReorder}
                onDragStart={() => handleDragStart(column.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
            >
                <label className="visibility-checkbox">
                    <input
                        type="checkbox"
                        checked={!columnVisibility[column.id]}
                        onChange={() =>
                            table.setColumnVisibility(prev => ({
                                ...prev,
                                [column.id]: !prev[column.id]
                            }))
                        }
                        aria-label={`Показать колонку ${column.columnDef.header as string}`}
                    />
                    <span>{column.columnDef.header as string}</span>
                </label>
                {onColumnReorder && (
                    <span
                        className="drag-handle"
                        aria-hidden="true"
                    >
                        ⋮⋮
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="settings-panel" ref={panelRef}>
            <button
                className="settings-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="settings-dropdown"
            >
                <span aria-hidden="true">⚙️</span>
                Настройки
            </button>

            {isOpen && (
                <div
                    id="settings-dropdown"
                    className="settings-dropdown"
                    role="dialog"
                    aria-label="Настройки таблицы"
                >
                    <div className="settings-header">
                        <h3>Настройки таблицы</h3>
                        <button
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Закрыть настройки"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="settings-content">
                        <div className="settings-section">
                            <h4>Видимые колонки</h4>
                            <div
                                className="column-list"
                                role="group"
                                aria-label="Видимые колонки"
                            >
                                {table.getAllColumns().map(column => renderColumnOption(column))}
                            </div>
                        </div>

                        <div className="settings-footer">
                            <button
                                className="reset-button"
                                onClick={() => {
                                    onReset();
                                    setIsOpen(false);
                                }}
                            >
                                Сбросить настройки
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}