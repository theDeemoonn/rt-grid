export const generateColumnId = (columnDef: any) => {
    if (typeof columnDef.id === 'string') return columnDef.id;
    if (typeof columnDef.accessorKey === 'string') return columnDef.accessorKey;
    if (typeof columnDef.header === 'string') return columnDef.header;
    return Math.random().toString(36).substring(7);
};