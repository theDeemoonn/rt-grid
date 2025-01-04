import React from "react";

interface NoDataProps {
    message?: string;
}

export function NoData({
                           message = 'Нет данных для отображения'
                       }: NoDataProps): React.ReactElement {
    return (
        <div className="no-data">
            <div className="no-data-icon">📊</div>
            <div className="no-data-message">{message}</div>
        </div>
    );
}