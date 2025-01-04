import { TableState } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

export function useTableState(
    initialState?: Partial<TableState>
): [TableState, React.Dispatch<React.SetStateAction<TableState>>] {
    const [state, setState] = useState<TableState>(() => ({
        columnPinning: { left: [], right: [] },
        rowPinning: { top: [], bottom: [] },
        grouping: [],
        columnVisibility: {},
        columnSizing: {},
        columnOrder: [],
        columnWidth: {},
        ...initialState
    }as TableState));

    useEffect(() => {
        const savedState = localStorage.getItem('tableState');
        if (savedState) {
            try {
                setState(prevState => ({
                    ...prevState,
                    ...JSON.parse(savedState)
                }));
            } catch (error) {
                console.error('Failed to parse saved table state:', error);
            }
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('tableState', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save table state:', error);
        }
    }, [state]);

    return [state, setState];
}
