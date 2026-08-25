import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const upload = async (req) => {
    const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'gallery_images')
    );
    const results = await Promise.all(uploadPromises);
    return results;
}