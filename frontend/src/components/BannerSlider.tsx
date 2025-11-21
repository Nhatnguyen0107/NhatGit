import { useState, useEffect } from 'react';

interface BannerSliderProps {
    images?: string[];
    interval?: number;
}

const BannerSlider = ({
    images = [
        'http://localhost:3000/uploads/banners/banner1.png',
        'http://localhost:3000/uploads/banners/banner2.png',
        'http://localhost:3000/uploads/banners/banner3.png',
        'http://localhost:3000/uploads/banners/banner4.png',
        'http://localhost:3000/uploads/banners/banner5.png',
    ],
    interval = 3000
}: BannerSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % images.length
            );
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % images.length
        );
    };

    return (
        <div className="relative w-full h-[300px] sm:h-[400px] 
                    md:h-[500px] lg:h-[600px] 
                    overflow-hidden rounded-lg shadow-lg group">
            {/* Images */}
            <div className="relative h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity 
                       duration-1000 ${index === currentIndex
                                ? 'opacity-100'
                                : 'opacity-0'
                            }`}
                    >
                        <img
                            src={image}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-contain bg-gray-100"
                        />
                        <div className="absolute inset-0 
                            bg-gradient-to-t 
                            from-black/40 to-transparent" />
                    </div>
                ))}
            </div>

            {/* Previous Button */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 
                   bg-white/80 hover:bg-white 
                   text-gray-800 p-3 rounded-full 
                   shadow-lg opacity-0 
                   group-hover:opacity-100 
                   transition-opacity duration-300"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* Next Button */}
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 
                   bg-white/80 hover:bg-white 
                   text-gray-800 p-3 rounded-full 
                   shadow-lg opacity-0 
                   group-hover:opacity-100 
                   transition-opacity duration-300"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 
                      -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full 
                       transition-all duration-300 
                       ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                    />
                ))}
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 
                      left-4 sm:left-8 text-white z-10 
                      max-w-xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl 
                       font-bold mb-2">
                    Khuyến mãi đặc biệt
                </h2>
                <p className="text-sm sm:text-base md:text-lg mb-4">
                    Giảm giá lên đến 50% cho sản phẩm chọn lọc
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 
                           text-white px-4 sm:px-6 
                           py-2 sm:py-3 rounded-lg 
                           font-semibold text-sm sm:text-base
                           transition-colors">
                    Mua ngay
                </button>
            </div>
        </div>
    );
};

export default BannerSlider;
