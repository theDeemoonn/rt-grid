import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

interface VirtualizationOptions {
    rowHeight?: number;
    overscan?: number;
}

 export function useTableVirtualization(
    rowCount: number,
    options: VirtualizationOptions = {}
) {
    const {
        rowHeight = 35,
        overscan = 10
    } = options;

    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: useCallback(() => rowHeight, [rowHeight]),
        overscan,
    });

    return { parentRef, virtualizer };
}
