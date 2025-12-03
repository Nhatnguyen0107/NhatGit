import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    itemName?: string;
    showItemsPerPage?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    total,
    itemsPerPage,
    onPageChange,
    itemName = 'mục'
}) => {
    if (total === 0) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, total);

    const getPageNumbers = () => {
        const pages = [];

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        const rangeStart = Math.max(2, currentPage - 1);
        const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis after first page if needed
        if (rangeStart > 2) {
            pages.push(-1); // -1 represents ellipsis
        }

        // Add pages around current page
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (rangeEnd < totalPages - 1) {
            pages.push(-2); // -2 represents ellipsis
        }

        // Always show last page if there's more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200 
              sm:px-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">{startItem}</span>{' '}
                    đến{' '}
                    <span className="font-medium">{endItem}</span>{' '}
                    trong tổng số{' '}
                    <span className="font-medium">{total}</span> {itemName}
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border rounded 
                              hover:bg-gray-50 disabled:opacity-50 
                              disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>

                    {getPageNumbers().map((page, idx) => {
                        if (page < 0) {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="px-2 text-gray-500"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-1 text-sm border rounded ${currentPage === page
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border rounded 
                              hover:bg-gray-50 disabled:opacity-50 
                              disabled:cursor-not-allowed"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
