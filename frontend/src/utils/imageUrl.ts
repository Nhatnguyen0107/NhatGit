/**
 * Get full image URL by adding backend URL prefix
 * @param imagePath - Image path from database (e.g., "/uploads/products/image.png")
 * @returns Full URL (e.g., "http://localhost:3000/uploads/products/image.png")
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) {
        return '/placeholder.jpg';
    }

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Get backend URL (remove /api suffix if exists)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const backendUrl = apiUrl.replace('/api', '');

    // Ensure path starts with /
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${backendUrl}${path}`;
};
