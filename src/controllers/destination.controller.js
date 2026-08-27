import { upload } from "../services/cloudinary.services.js";
import { createDestination, deleteDestinationById, findDestinationById, findDestinations, findPublicIds, updateDestinationById } from "../services/destination.services.js"
import { deleteImages } from "../utils/deleteFromCloudinary.js";

export const getAllDestinations = async (req, res) => {
    try {
        const destinations = await findDestinations();
        return res.status(200).json({ message: "Destinations fetched successfully", count: destinations.length, destinations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getSingleDestination = async (req, res) => {
    const { id } = req.params;
    try {
        const destination = await findDestinationById(id);
        return res.status(200).json({ message: "Destination fetched successfully", destination });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createNewDestination = async (req, res) => {
    const { name, places } = JSON.parse(req.body.data);
    if (!name || !places) {
        return res.status(400).json({ message: "Please fill the required fields" });
    }
    try {
        const images = req.files ? await upload(req) : [];
        images.forEach((img) => {
            img.publicId = img.public_id;
            delete img.public_id;
        });

        const data = {
            name,
            places,
            images,
        }

        const destination = await createDestination(data);
        console.log("success");
        return res.status(200).json({ message: "Destination created successfully", destination });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateDestination = async (req, res) => {
    const { id } = req.params;
    const { name, places, images } = JSON.parse(req.body.data);
    if (!name || !places) {
        return res.status(400).json({ message: "Please fill the required fields" });
    }
    const publicIds = req.body.public_id.split(',');
    const filteredImages = images.filter((i) => Object.keys(i).length > 0);
    try {
        if (publicIds.length > 0) {
            const result = await deleteImages(publicIds);
            console.log("Result : ", result)
        } else {
            console.log("No Public Ids");
        }

        const files = req.files ? await upload(req) : [];
        files.forEach((f) => {
            f.publicId = f.public_id;
            delete f.public_id;
        });

        const data = {
            name,
            places,
            images: [...filteredImages, ...files]
        }

        const destination = await updateDestinationById(id, data);
        return res.status(200).json({ message: "Destination updated successfully", destination });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const removeDestination = async (req, res) => {
    const { id } = req.params;
    try {
        const publicIds = await findPublicIds(id);
        if (publicIds.length > 0) {
            const result = await deleteImages(publicIds);
            console.log(result);
        } else {
            console.log("Not provided");
        }
        const destination = await deleteDestinationById(id);
        return res.status(200).json({ message: "Destination removed successfully", destination })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}