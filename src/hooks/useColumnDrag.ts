import { useCallback, useEffect, useRef, useState } from "react";

export function useColumnDrag(
    columnId: string,
    onColumnReorder: (sourceId: string, targetId: string) => void
) {
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<HTMLElement | null>(null);

    const handleDragStart = useCallback((e: DragEvent) => {
        if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', columnId);
            setIsDragging(true);
        }
    }, [columnId]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        const sourceId = e.dataTransfer!.getData('text/plain');
        if (sourceId !== columnId) {
            onColumnReorder(sourceId, columnId);
        }
        setIsDragging(false);
    }, [columnId, onColumnReorder]);

    useEffect(() => {
        const element = dragRef.current;
        if (!element) return;

        element.setAttribute('draggable', 'true');
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('drop', handleDrop);

        return () => {
            element.removeEventListener('dragstart', handleDragStart);
            element.removeEventListener('dragend', handleDragEnd);
            element.removeEventListener('dragover', handleDragOver);
            element.removeEventListener('drop', handleDrop);
        };
    }, [handleDragStart, handleDragEnd, handleDragOver, handleDrop]);

    return { dragRef, isDragging };
}