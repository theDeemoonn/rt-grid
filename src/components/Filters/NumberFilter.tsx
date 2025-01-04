import React from "react";

interface NumberFilterValue {
    min?: number;
    max?: number;
}

interface NumberFilterProps {
    value: NumberFilterValue;
    onChange: (value: NumberFilterValue) => void;
    min?: number;
    max?: number;
    step?: number;
}

export const NumberFilter: React.FC<NumberFilterProps> = ({
                                                              value,
                                                              onChange,
                                                              min,
                                                              max,
                                                              step = 1
                                                          }): React.ReactElement => {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = e.target.value ? Number(e.target.value) : undefined;
        onChange({ ...value, min: newMin });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = e.target.value ? Number(e.target.value) : undefined;
        onChange({ ...value, max: newMax });
    };

    return (
        <div className="number-filter">
            <input
                type="number"
                className="filter-input"
                value={value.min ?? ''}
                onChange={handleMinChange}
                placeholder="От"
                min={min}
                max={max}
                step={step}
                aria-label="Минимальное значение"
            />
            <input
                type="number"
                className="filter-input"
                value={value.max ?? ''}
                onChange={handleMaxChange}
                placeholder="До"
                min={min}
                max={max}
                step={step}
                aria-label="Максимальное значение"
            />
        </div>
    );
};