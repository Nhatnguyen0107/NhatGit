interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    startIndex: number;
    endIndex: number;
    itemName?: string;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    startIndex,
    endIndex,
    itemName = 'mục'
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    // Hiển thị tối đa 5 trang
    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }
        if (currentPage > totalPages - 3) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="px-6 py-4 border-t border-gray-200 
              flex items-center justify-between 
              bg-white">
            <div className="text-sm text-gray-700">
                Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)}
                {' '}trong số {totalItems} {itemName}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm 
                          border border-gray-300 
                          rounded-md 
                          hover:bg-gray-50 
                          disabled:opacity-50 
                          disabled:cursor-not-allowed 
                          transition-colors"
                >
                    ← Trước
                </button>

                {currentPage > 3 && totalPages > 5 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-3 py-1 text-sm 
                                  border border-gray-300 
                                  rounded-md 
                                  hover:bg-gray-50"
                        >
                            1
                        </button>
                        <span className="px-2 py-1">...</span>
                    </>
                )}

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 text-sm 
                              border rounded-md 
                              transition-colors
                              ${currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                        <span className="px-2 py-1">...</span>
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-3 py-1 text-sm 
                                  border border-gray-300 
                                  rounded-md 
                                  hover:bg-gray-50"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm 
                          border border-gray-300 
                          rounded-md 
                          hover:bg-gray-50 
                          disabled:opacity-50 
                          disabled:cursor-not-allowed 
                          transition-colors"
                >
                    Sau →
                </button>
            </div>
        </div>
    );
};

export default Pagination;
