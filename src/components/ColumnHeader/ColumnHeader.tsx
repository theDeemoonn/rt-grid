import React from 'react';
import { Header, flexRender, RowData } from '@tanstack/react-table';
import { FilterPanel } from '../FilterPanel/FilterPanel.tsx';
import { FilterValue } from '../../types';
import './ColumnHeader.css';

interface ColumnHeaderProps<TData extends RowData> {
    header: Header<TData, unknown>;
    onSort: () => void;
    onFilter: (value: FilterValue) => void;
    onContextMenu: (e: React.MouseEvent) => void;
    showFilter?: boolean;
}

export function ColumnHeader<TData extends RowData>({
                                                        header,
                                                        onSort,
                                                        onFilter,
                                                        onContextMenu,
                                                        showFilter = true
                                                    }: ColumnHeaderProps<TData>): React.ReactElement {
    return (
        <div className="column-header">
            <div
                className="header-content"
                onClick={onSort}
                onContextMenu={onContextMenu}
            >
                <span className="header-text">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                </span>
                <span className="sort-indicator">
                    {header.column.getIsSorted() === 'asc' ? '↑' :
                        header.column.getIsSorted() === 'desc' ? '↓' : ''}
                </span>
            </div>
            {showFilter && header.column.getCanFilter() && (
                <FilterPanel<TData>
                    column={header.column}
                    onFilterChange={onFilter}
                />
            )}
        </div>
    );
}