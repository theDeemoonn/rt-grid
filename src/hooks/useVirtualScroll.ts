import { useVirtualizer, VirtualizerOptions } from "@tanstack/react-virtual";
import { useCallback, useRef, useState, useEffect } from "react";
import { RowData, Table } from "@tanstack/react-table";

interface TableVirtualizationOptions {
    rowHeight?: number;
    overscan?: number;
}


export function useTableVirtualization<TData extends RowData>(
    table: Table<TData>,
    options: TableVirtualizationOptions = {}
) {
    const {
        rowHeight = 35,
        overscan = 10
    } = options;

    const parentRef = useRef<HTMLDivElement>(null);

    const virtualOptions: VirtualizerOptions<HTMLDivElement, Element> = {
        count: table.getRowModel().rows.length,
        getScrollElement: useCallback(() => parentRef.current, []),
        estimateSize: useCallback(() => rowHeight, [rowHeight]),
        overscan,
        scrollToFn: (offset, smooth) => {
            const scrollElement = parentRef.current;
            if (scrollElement) {
                scrollElement.scrollTo({
                    top: offset,
                    behavior: smooth ? "smooth" : "auto",
                });
            }
        },
        observeElementRect: (instance, callback) => {
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    callback(entry.contentRect);
                }
            });
            const element = instance.scrollElement;
            if (element) {
                observer.observe(element);
            }
            return () => observer.disconnect();
        },
        observeElementOffset: (instance, cb) => {
            const element = instance.scrollElement;
            if (!element) return;

            // Обработчик скролла
            const handleScroll = () => {
                const offset = element.scrollTop;
                const isScrolling = true;
                cb(offset, isScrolling);
            };

            // Привязываем обработчик к событию scroll
            element.addEventListener("scroll", handleScroll);

            // Возвращаем функцию для отключения обработчика
            return () => {
                element.removeEventListener("scroll", handleScroll);
            };
        },
    };

    const rowVirtualizer = useVirtualizer(virtualOptions);

    return { parentRef, rowVirtualizer };
}

// Расширенный хук для сложной виртуализации с динамическими размерами
interface VirtualScrollOptions<TData extends RowData> {
    table: Table<TData>;
    itemHeight: number;
    overscan?: number;
    containerHeight: number;
    onVisibleRowsChange?: (startIndex: number, endIndex: number) => void;
}

interface VirtualItem {
    index: number;
    start: number;
    size: number;
    measureRef?: (el: HTMLElement | null) => void;
}

export function useVirtualScroll<TData extends RowData>({
                                                            table,
                                                            itemHeight,
                                                            overscan = 3,
                                                            containerHeight,
                                                            onVisibleRowsChange
                                                        }: VirtualScrollOptions<TData>) {
    const [scrollTop, setScrollTop] = useState(0);
    const [measurements, setMeasurements] = useState<Map<number, number>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);

    const measureElement = useCallback((index: number, element: HTMLElement | null) => {
        if (element) {
            const size = element.getBoundingClientRect().height;
            setMeasurements(prev => {
                const next = new Map(prev);
                next.set(index, size);
                return next;
            });
        }
    }, []);

    const getVirtualItems = useCallback((): VirtualItem[] => {
        const rows = table.getRowModel().rows;
        const items: VirtualItem[] = [];
        let currentPosition = 0;
        let startIndex = Math.floor(scrollTop / itemHeight) - overscan;
        let endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan;

        startIndex = Math.max(0, startIndex);
        endIndex = Math.min(rows.length - 1, endIndex);

        onVisibleRowsChange?.(startIndex, endIndex);

        for (let index = startIndex; index <= endIndex; index++) {
            const size = measurements.get(index) || itemHeight;
            items.push({
                index,
                start: currentPosition,
                size,
                measureRef: (el) => measureElement(index, el)
            });
            currentPosition += size;
        }

        return items;
    }, [scrollTop, containerHeight, itemHeight, overscan, measurements, table, measureElement, onVisibleRowsChange]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = (event: Event) => {
            const target = event.target as HTMLDivElement;
            setScrollTop(target.scrollTop);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const totalSize = Array.from(measurements.values()).reduce((sum, size) => sum + size, 0) +
        (table.getRowModel().rows.length - measurements.size) * itemHeight;

    return {
        virtualItems: getVirtualItems(),
        totalSize,
        containerRef
    };
}