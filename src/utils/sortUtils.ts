export const createSortingState = (
    sortColumns: Array<{ columnKey: string; direction: 'ASC' | 'DESC' }>
) => {
    return sortColumns.map(sort => ({
        id: sort.columnKey,
        desc: sort.direction === 'DESC'
    }));
};