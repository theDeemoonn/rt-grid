import React, { useEffect, useRef, useState } from "react";

interface ExportMenuProps {
    onExportExcel: () => Promise<void>;
    onExportCsv: () => Promise<void>;
    isOpen: boolean;
    onClose: () => void;
}

export function ExportMenu({
                               onExportExcel,
                               onExportCsv,
                               isOpen,
                               onClose
                           }: ExportMenuProps): React.ReactElement | null {
    const menuRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<'excel' | 'csv' | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleExport = async (type: 'excel' | 'csv') => {
        try {
            setIsLoading(type);
            await (type === 'excel' ? onExportExcel() : onExportCsv());
            onClose();
        } catch (error) {
            console.error(`Failed to export as ${type}:`, error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div
            ref={menuRef}
            className="export-menu"
            role="menu"
        >
            <button
                className="menu-item"
                onClick={() => handleExport('excel')}
                disabled={isLoading !== null}
                role="menuitem"
            >
                <span className="menu-icon" aria-hidden="true">📊</span>
                {isLoading === 'excel' ? 'Экспорт...' : 'Excel'}
            </button>
            <button
                className="menu-item"
                onClick={() => handleExport('csv')}
                disabled={isLoading !== null}
                role="menuitem"
            >
                <span className="menu-icon" aria-hidden="true">📝</span>
                {isLoading === 'csv' ? 'Экспорт...' : 'CSV'}
            </button>
        </div>
    );
}