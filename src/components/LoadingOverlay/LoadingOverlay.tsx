import React from 'react';
import './LoadingOverlay.css';

export const LoadingOverlay: React.FC = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Загрузка...</div>
        </div>
    );
};