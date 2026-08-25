// utils/uploadToCloudinary.js
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer, folder = 'uploads') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export default uploadToCloudinary;