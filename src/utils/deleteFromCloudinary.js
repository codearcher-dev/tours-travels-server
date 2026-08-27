import cloudinary from "../config/cloudinary.js";

export const deleteImages = async (publicIds) => {
    try {
        // publicIds: ['products/image1', 'products/image2', 'products/image3']
        const result = await cloudinary.api.delete_resources(publicIds, {
            resource_type: 'image',
            invalidate: true, // Clears CDN caches
        });

        return result;
    } catch (error) {
        console.error('Cloudinary bulk delete error:', error);
        throw error;
    }
};