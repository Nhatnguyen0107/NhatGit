import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    currentItems: T[];
    setCurrentPage: (page: number) => void;
    handlePageChange: (page: number) => void;
}

export const usePagination = <T,>({
    items,
    itemsPerPage = 10
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = useMemo(() => {
        return items.slice(startIndex, endIndex);
    }, [items, startIndex, endIndex]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        currentItems,
        setCurrentPage,
        handlePageChange
    };
};
