export const createColumnFilters = (filters: Record<string, any>) => {
    return Object.entries(filters).map(([columnId, value]) => ({
        id: columnId,
        value: value
    }));
};