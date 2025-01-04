import React from 'react';
import { Column, RowData } from '@tanstack/react-table';
import './FilterPanel.css';
import { FilterValue, ColumnType } from "../../types";

interface FilterPanelProps<TData extends RowData> {
    column: Column<TData, unknown>;
    onFilterChange: (value: FilterValue) => void;
}

export function FilterPanel<TData extends RowData>({
                                                       column,
                                                       onFilterChange
                                                   }: FilterPanelProps<TData>): React.ReactElement {
    const filterValue = column.getFilterValue() as FilterValue;
    const columnType = column.columnDef.meta?.type as ColumnType || 'string';

    const renderNumberFilter = () => (
        <div className="number-filter">
            <input
                type="number"
                className="filter-input"
                placeholder="От"
                value={filterValue?.min ?? ''}
                onChange={(e) => {
                    onFilterChange({
                        ...filterValue,
                        min: e.target.value ? Number(e.target.value) : undefined
                    });
                }}
            />
            <input
                type="number"
                className="filter-input"
                placeholder="До"
                value={filterValue?.max ?? ''}
                onChange={(e) => {
                    onFilterChange({
                        ...filterValue,
                        max: e.target.value ? Number(e.target.value) : undefined
                    });
                }}
            />
        </div>
    );

    const renderBooleanFilter = () => (
        <select
            className="filter-select"
            value={filterValue?.value ?? ''}
            onChange={(e) => onFilterChange({ value: e.target.value })}
        >
            <option value="">Все</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
        </select>
    );

    const renderDateFilter = () => (
        <div className="date-filter">
            <input
                type="date"
                className="filter-input"
                value={filterValue?.from ?? ''}
                onChange={(e) => {
                    onFilterChange({
                        ...filterValue,
                        from: e.target.value || undefined
                    });
                }}
            />
            <input
                type="date"
                className="filter-input"
                value={filterValue?.to ?? ''}
                onChange={(e) => {
                    onFilterChange({
                        ...filterValue,
                        to: e.target.value || undefined
                    });
                }}
            />
        </div>
    );

    const renderTextFilter = () => (
        <input
            type="text"
            className="filter-input"
            placeholder="Фильтр..."
            value={filterValue?.value ?? ''}
            onChange={(e) => onFilterChange({ value: e.target.value || undefined })}
        />
    );

    const renderFilter = () => {
        switch (columnType) {
            case 'number':
                return renderNumberFilter();
            case 'boolean':
                return renderBooleanFilter();
            case 'date':
                return renderDateFilter();
            default:
                return renderTextFilter();
        }
    };

    return (
        <div className="filter-panel">
            {renderFilter()}
        </div>
    );
}