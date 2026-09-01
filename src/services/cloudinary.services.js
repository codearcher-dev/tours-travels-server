import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const upload = async (files) => {
    const uploadPromises = files.map((file) =>
        uploadToCloudinary(file.buffer, 'gallery_images')
    );
    const results = await Promise.all(uploadPromises);
    return results;
}