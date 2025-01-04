import React from 'react';
import { UniversalTable } from './UniversalTable';
import { TableStore } from './types';
import { ColumnDef } from '@tanstack/react-table';

// Тестовые данные
const sampleData = [
    { id: 1, name: 'Alice', age: 25, city: 'New York' },
    { id: 2, name: 'Bob', age: 30, city: 'Los Angeles' },
    { id: 3, name: 'Charlie', age: 35, city: 'Chicago' },
];

// Определение колонок
const columns: ColumnDef<typeof sampleData[0]>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'age',
        header: 'Age',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
];

// Эмуляция TableStore
const tableStore: TableStore<typeof sampleData[0]> = {
    Data: sampleData,
    IsLoading: false,
    Filters: {}, // Добавьте объект для хранения фильтров
    SortColumns: [], // Добавьте массив для хранения информации о сортировке
    FilteredData: sampleData, // В этом примере изначально отфильтрованные данные равны оригинальным
    SortedFilteredData: sampleData, // Изначально отсортированные и отфильтрованные данные равны оригинальным
};

 const UniversalTableExample: React.FC = () => {
    const handleStateChange = (table: any) => {
        console.log('Table state changed:', table.getState());
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>UniversalTable Example</h2>
            <UniversalTable
                store={tableStore}
                columns={columns}

                estimateRowHeight={50}
                onStateChange={handleStateChange}
            />
        </div>
    );
};

export default UniversalTableExample;