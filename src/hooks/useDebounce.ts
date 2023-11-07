import { useState, useEffect } from 'react';

function useDebouncedSearch(initialValue: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(initialValue);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [initialValue, delay]);

    return debouncedValue;
}

export default useDebouncedSearch;
