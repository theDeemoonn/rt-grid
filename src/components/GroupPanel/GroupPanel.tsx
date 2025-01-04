import React from 'react';
import { Column, RowData } from '@tanstack/react-table';
import './GroupPanel.css';

interface GroupPanelProps<TData extends RowData> {
    grouping: string[];
    columns: Column<TData, unknown>[];
    onRemoveGroup: (groupId: string) => void;
}

export function GroupPanel<TData extends RowData>({
                                                      grouping,
                                                      columns,
                                                      onRemoveGroup
                                                  }: GroupPanelProps<TData>): React.ReactElement | null {
    if (!grouping.length) return null;

    const getColumnHeader = (columnId: string): string => {
        const column = columns.find(col => col.id === columnId);
        return typeof column?.columnDef.header === 'string'
            ? column.columnDef.header
            : columnId;
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
        groupId: string
    ) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onRemoveGroup(groupId);
        }
    };

    return (
        <div
            className="group-panel"
            role="region"
            aria-label="Группировка"
        >
            <span className="group-label">Сгруппировано по:</span>
            <div className="group-tags">
                {grouping.map(groupId => (
                    <div
                        key={groupId}
                        className="group-tag"
                        role="listitem"
                    >
                        <span>{getColumnHeader(groupId)}</span>
                        <button
                            className="remove-group"
                            onClick={() => onRemoveGroup(groupId)}
                            onKeyDown={(e) => handleKeyDown(e, groupId)}
                            aria-label={`Удалить группировку по ${getColumnHeader(groupId)}`}
                            title={`Удалить группировку по ${getColumnHeader(groupId)}`}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}