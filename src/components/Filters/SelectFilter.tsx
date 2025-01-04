import React from "react";

interface SelectFilterProps {
    value: string[];
    options: Array<{ value: string; label: string }>;
    onChange: (value: string[]) => void;
    allowMultiple?: boolean;
    placeholder?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
                                                              value,
                                                              options,
                                                              onChange,
                                                              allowMultiple = true,
                                                              placeholder = 'Выберите значение'
                                                          }): React.ReactElement => {
    const handleChange = (optionValue: string) => {
        if (allowMultiple) {
            const newValue = value.includes(optionValue)
                ? value.filter(v => v !== optionValue)
                : [...value, optionValue];
            onChange(newValue);
        } else {
            onChange([optionValue]);
        }
    };

    return (
        <div
            className="select-filter"
            role="listbox"
            aria-multiselectable={allowMultiple}
            aria-label={placeholder}
        >
            {options.map(option => (
                <label
                    key={option.value}
                    className="select-option"
                >
                    <input
                        type={allowMultiple ? "checkbox" : "radio"}
                        checked={value.includes(option.value)}
                        onChange={() => handleChange(option.value)}
                        aria-label={option.label}
                    />
                    <span>{option.label}</span>
                </label>
            ))}
        </div>
    );
};