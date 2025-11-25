import React, { useState } from 'react';

interface ProductImagesProps {
    mainImage: string;
    additionalImages?: string[];
    productName: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({
    mainImage,
    additionalImages = [],
    productName
}) => {
    const [selectedImage, setSelectedImage] = useState(mainImage);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Combine main image with additional images
    const allImages = [mainImage, ...additionalImages].filter(Boolean);

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/600';
        if (url.startsWith('http')) return url;
        return `http://localhost:3000${url}`;
    };

    return (
        <>
            <div>
                {/* Main Image Display - Smaller and more compact */}
                <div className="mb-3">
                    <div
                        className="relative bg-gray-50 rounded-lg 
                                   overflow-hidden border border-gray-200 
                                   cursor-pointer group"
                        style={{ aspectRatio: '4/3' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {/* Navigation arrows on image */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const currentIndex = allImages.indexOf(selectedImage);
                                        const prevIndex = currentIndex === 0
                                            ? allImages.length - 1
                                            : currentIndex - 1;
                                        setSelectedImage(allImages[prevIndex]);
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 
                                             bg-gray-800 bg-opacity-50 hover:bg-opacity-70 
                                             text-white p-2 rounded-full transition-all z-10"
                                >
                                    <svg className="w-5 h-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const currentIndex = allImages.indexOf(selectedImage);
                                        const nextIndex = currentIndex === allImages.length - 1
                                            ? 0
                                            : currentIndex + 1;
                                        setSelectedImage(allImages[nextIndex]);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 
                                             bg-gray-800 bg-opacity-50 hover:bg-opacity-70 
                                             text-white p-2 rounded-full transition-all z-10"
                                >
                                    <svg className="w-5 h-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        <img
                            src={getImageUrl(selectedImage)}
                            alt={productName}
                            className="w-full h-full object-contain p-3"
                            onError={(e) => {
                                e.currentTarget.src =
                                    'https://via.placeholder.com/400';
                            }}
                        />
                    </div>
                </div>

                {/* Thumbnail Horizontal Scroll - Only 3 images */}
                {allImages.length > 1 && (
                    <div className="relative">
                        <div className="flex gap-2 pb-1">
                            {allImages.slice(0, 3).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`relative flex-shrink-0 w-14 
                                              h-14 rounded-md overflow-hidden 
                                              border-2 transition-all duration-200
                                              hover:scale-105
                                              ${selectedImage === image
                                            ? 'border-red-500 ring-1 ring-red-200'
                                            : 'border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(image)}
                                        alt={`${productName} - Ảnh ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://via.placeholder.com/100';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Modal/Lightbox */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center 
                               justify-center bg-black bg-opacity-90 p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh]">
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-10 right-0 text-white 
                                     hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Large image */}
                        <img
                            src={getImageUrl(selectedImage)}
                            alt={productName}
                            className="w-full h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                            onError={(e) => {
                                e.currentTarget.src =
                                    'https://via.placeholder.com/1200';
                            }}
                        />

                        {/* Navigation arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const currentIndex = allImages.indexOf(selectedImage);
                                        const prevIndex = currentIndex === 0
                                            ? allImages.length - 1
                                            : currentIndex - 1;
                                        setSelectedImage(allImages[prevIndex]);
                                    }}
                                    className="absolute left-4 top-1/2 
                                             -translate-y-1/2 bg-white 
                                             bg-opacity-30 hover:bg-opacity-50 
                                             text-white p-3 rounded-full 
                                             transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const currentIndex = allImages.indexOf(selectedImage);
                                        const nextIndex = currentIndex === allImages.length - 1
                                            ? 0
                                            : currentIndex + 1;
                                        setSelectedImage(allImages[nextIndex]);
                                    }}
                                    className="absolute right-4 top-1/2 
                                             -translate-y-1/2 bg-white 
                                             bg-opacity-30 hover:bg-opacity-50 
                                             text-white p-3 rounded-full 
                                             transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Image counter in modal */}
                        <div className="absolute bottom-4 left-1/2 
                                      -translate-x-1/2 bg-black bg-opacity-50 
                                      text-white px-4 py-2 rounded-full text-sm">
                            {allImages.findIndex(img => img === selectedImage) + 1} / {allImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductImages;
