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

    const allImages = [mainImage, ...additionalImages];

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/600';
        if (url.startsWith('http')) return url;
        return `http://localhost:3000${url}`;
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={getImageUrl(selectedImage)}
                    alt={productName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600';
                    }}
                />
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(image)}
                            className={`aspect-square rounded-lg overflow-hidden 
                border-2 transition-all ${selectedImage === image
                                    ? 'border-blue-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <img
                                src={getImageUrl(image)}
                                alt={`${productName} ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/100';
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImages;
