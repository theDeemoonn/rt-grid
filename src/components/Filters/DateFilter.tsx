import React from "react";

interface DateFilterValue {
    from?: string;
    to?: string;
}

interface DateFilterProps {
    value: DateFilterValue;
    onChange: (value: DateFilterValue) => void;
    minDate?: string;
    maxDate?: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({
                                                          value,
                                                          onChange,
                                                          minDate,
                                                          maxDate
                                                      }): React.ReactElement => {
    return (
        <div className="date-filter">
            <input
                type="date"
                className="filter-input"
                value={value.from || ''}
                onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
                min={minDate}
                max={maxDate}
                aria-label="Дата начала"
            />
            <input
                type="date"
                className="filter-input"
                value={value.to || ''}
                onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
                min={minDate}
                max={maxDate}
                aria-label="Дата окончания"
            />
        </div>
    );
};