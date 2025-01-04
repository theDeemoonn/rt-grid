import React from "react";

interface TextFilterProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
}

export const TextFilter: React.FC<TextFilterProps> = ({
                                                          value,
                                                          onChange,
                                                          placeholder = 'Фильтр...',
                                                          debounceMs = 300,
                                                      }): React.ReactElement => {
    const [localValue, setLocalValue] = React.useState(value);
    const debounceTimeout = React.useRef<number>(); // Используем number вместо NodeJS.Timeout

    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = window.setTimeout(() => {
            onChange(newValue);
        }, debounceMs);
    };

    return (
        <input
            type="text"
            className="filter-input"
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            aria-label={placeholder}
        />
    );
};