import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

export type ColumnContextMenuAction = 'pin-left' | 'pin-right' | 'unpin' | 'group' | 'hide';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onAction: (action: ColumnContextMenuAction) => void;
    canGroup?: boolean;
}

export function ContextMenu({
                                x,
                                y,
                                onClose,
                                onAction,
                                canGroup = false
                            }: ContextMenuProps): React.ReactElement {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const menuItems: Array<{ action: ColumnContextMenuAction; label: string; show: boolean }> = [
        { action: 'pin-left', label: 'Закрепить слева', show: true },
        { action: 'pin-right', label: 'Закрепить справа', show: true },
        { action: 'unpin', label: 'Открепить', show: true },
        { action: 'group', label: 'Группировать', show: canGroup },
        { action: 'hide', label: 'Скрыть колонку', show: true }
    ];

    const handleAction = (action: ColumnContextMenuAction) => {
        onAction(action);
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="context-menu"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                maxHeight: '400px',
                overflowY: 'auto'
            }}
            role="menu"
        >
            {menuItems
                .filter(item => item.show)
                .map(item => (
                    <div
                        key={item.action}
                        className="menu-item"
                        onClick={() => handleAction(item.action)}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleAction(item.action);
                            }
                        }}
                    >
                        {item.label}
                    </div>
                ))}
        </div>
    );
}