import React from 'react';
import './Status.css';

interface LoadingIndicatorProps {
    size?: 'small' | 'medium' | 'large';
}

export function LoadingIndicator({
                                     size = 'medium'
                                 }: LoadingIndicatorProps): React.ReactElement {
    return (
        <div className={`loading-indicator size-${size}`}>
            <div className="spinner" />
            <div className="loading-text">Загрузка...</div>
        </div>
    );
}